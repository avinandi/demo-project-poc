import $ from "jquery"
import Template from "hb-template"
import {render} from "login-form"

const renderSuccess = (container, loginPageElem) => {
  const loginSuccessPageelem = Template.LoginSuccess()
  container.empty()
  container.html(loginSuccessPageelem)

  $('#logout').click((event) => {
    event.preventDefault()

    $.ajax({
      type: "POST",
      url: "/rest/public/authentication/logout",
      success: onSuccess
    })
  })

  function onSuccess(response) {
    console.log(response.message)
    container.empty()
    render(container)
  }
}

export {renderSuccess}