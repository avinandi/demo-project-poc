import $ from "jquery"
import {render} from "login-form"

// Global Ajax setup
$.ajaxSetup({
  cache: false,
  contentType: 'application/json'
})

render($("#app-root"))




