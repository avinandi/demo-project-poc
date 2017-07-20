import Template from "hb-template"
import $ from "jquery"
import {renderSuccess} from "login-success"

const render = (container) => {
  const loginFormElem = Template.LoginForm()
  container.html(loginFormElem)

  const submitButtonElem = $('#login-form button')
  const userNameElem = $('#login-form #username')
  const passwordElem = $('#login-form #password')

  submitButtonElem.click((event) => {
    event.preventDefault()

    const username = userNameElem.val()
    const password = passwordElem.val()

    submitLoginForm(username, password)
  })

  function submitLoginForm(username, password) {
    $.ajax({
      type: "POST",
      url: "/rest/public/authentication/login",
      data: JSON.stringify({
        username,
        password
      }),
      success: onSuccess,
      error: handleError
    })
  }

  function onSuccess(response) {
    console.log(response.message)
    renderSuccess(container)
  }

  function handleError(xhr) {
    console.log(xhr.status)
    $('#login-form p.error').removeClass('hidden')
  }
}

export {render}