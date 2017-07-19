var sourceDir = "./app/"

var gulp = require('gulp') // Main gulp module
var connect = require('gulp-connect') // Gulp server
var bower = require('gulp-bower') // Gulp bower plugin
var del = require('del') // for 'rm -rf' dist
var path = require('path') // concat paths
var runSequence = require('run-sequence') // Run multiple tasks from main tasks sequentially

var less = require('gulp-less') // Gulp less plugin
var autoprefixer = require('gulp-autoprefixer') // LESS ==> CSS

var browserify = require('browserify') // required stuffs in JS
var watchify = require('watchify') // For debugging: live watch on live reload

var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')

var proxy = require('http-proxy-middleware') // Http-proxy from front => rest

var handlebars = require('gulp-handlebars') // Gulp handlebars plugin
var defineModule = require('gulp-define-module') // To link with browserify
var wrap = require('gulp-wrap') // Wrap inside custom tag
var concat = require('gulp-concat') // create one handlebars template as JS

var configuredBabelify = require('babelify').configure({
  ignore: /^.*bower_components\/.*/,
  experimental: false
}); // Improve the JS

var configuredAliasify = require('aliasify').configure({
  configDir: __dirname,
  aliases: require('./aliases.json')
}); // Import statement alias configuration

var paths = {
  dist: './dist/',
  less: {
    targetFile: 'main.css',
    source: sourceDir + 'less/'
  },
  js: {
    targetFile: 'bundle.js',
    source: sourceDir + 'js/',
    initialEntry: sourceDir + 'js/app.js'
  },
  image: {
    source: sourceDir + 'image/'
  },
  html: {
    source: sourceDir + 'html/'
  },
  template: {
    source: sourceDir + 'template/*.hbs'
  }
}

// main tasks starts here
gulp.task('bower', bower)

gulp.task('rm-dist', function() {
  return del([paths.dist])
});

gulp.task('less', function () {
  return gulp.src(paths.less.source + 'main.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less') ]
    }).on('error', function(err) {
      console.error('\007\033[31mLESS error in \033[33m'+ err.fileName)
      console.error('\033[39m'+ err.message)
      this.emit('end')
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.dist))
    .pipe(connect.reload())
})

gulp.task('copy-html', function() {
  return gulp.src(paths.html.source + '**/*.html')
    .pipe(gulp.dest(paths.dist))
})

gulp.task('copy-images', function() {
  return gulp.src(paths.image.source + '**/*')
    .pipe(gulp.dest(paths.dist + 'img/'))
})

gulp.task('template', function(){
  gulp.src(paths.template.source)
    .pipe(handlebars({
      handlebars: require('handlebars') // Required to override tansitive handlebars dependency inside gulp-handlebars
    }))
    .pipe(defineModule('plain', {
      require: { Handlebars: 'handlebars'},
      wrapper: 'var Handlebars = require(\'handlebars\');\n module.exports[\'<%= name %>\'] = <%= handlebars %>'
    }))
    .pipe(concat('template.js'))
    .pipe(gulp.dest(paths.dist));
});

// Development tasks starts here
gulp.task('watch-scripts', function() {
  return buildBrowserifyTasks(paths.js.initialEntry, paths.js.targetFile, true)
})

gulp.task('watch-less', ['less'], function() {
  return gulp.watch(paths.less.source +'**/*.less', ['less'])
})

gulp.task('watch-html', ['copy-html'], function() {
  return gulp.watch(paths.html.source + '**/*.html', ['copy-html'])
})

gulp.task('watch-images', ['copy-images'], function() {
  return gulp.watch(paths.image.source + '**/*', ['copy-images'])
})

gulp.task('watch-template', ['template'], function() {
  return gulp.watch(paths.template.source, ['template'])
})

gulp.task('watch', ['watch-less', 'watch-html', 'watch-images', 'watch-template', 'watch-scripts'])

gulp.task('start-server', function() {
  return connect.server(getServerConfig())
})

gulp.task('server', function(callback) {
  runSequence(
    ['bower', 'rm-dist'],
    'watch',
    'start-server',
    callback)
})

gulp.task('default', ['server'])

// Utility functions
function buildBrowserifyTasks(sourceFile, targetFile, watch = false) {
  var bundler = createBrowserifyBundler(sourceFile, watch)
    .transform(configuredBabelify)
    .transform(configuredAliasify)

  if(watch) {
    bundler.on('update', () => bundle)
    bundler.on('log', function(msg) {
      console.log("Watchify triggered: " + msg)
    })
  }

  return bundle(bundler, targetFile)
}

function bundle(bundler, targetFile) {
  return bundler
    .bundle()
    .on("error", function (err) {
      console.log('\007\033[31mError: \033[39m'+ err.message)
    })
    .pipe(source(targetFile))
    .pipe(buffer())
    .pipe(gulp.dest(paths.dist))
    .pipe(connect.reload())
}

function createBrowserifyBundler(sourceFile, watch) {
  var opts = {
    entries: [sourceFile],
    debug: watch,
    cache: {},
    packageCache: {},
    fullPaths: true
  }

  if(watch) {
    return watchify(browserify(opts))
  } else {
    return browserify(opts)
  }
}

function getServerConfig() {
  return {
    root: 'dist',
    livereload: true,
    port: 6060,
    middleware: function () {
      var pr0xy = proxy('/rest', {
        target: 'http://localhost:9090',
        changeOrigin:true
      })
      return [pr0xy]
    }
  }
}
