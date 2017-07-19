import $ from "jquery"
import Template from "hb-template"

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

  function onSuccess() {
    container.empty()
    container.html(loginPageElem)
  }
}

export {renderSuccess}