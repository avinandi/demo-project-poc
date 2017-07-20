import $ from "jquery"
import Template from "hb-template"
import {render} from "login-form"
import {renderCustomerCard} from "customer-card"

const handleLogout = (container) => {
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

const handleSearch= (container) => {
  $('#search-button').click((event) => {
    event.preventDefault()
    const mobileNumber = $('#mobile-number').val()

    $.ajax({
      type: "GET",
      url: "/rest/search/by-msisdn/" + mobileNumber,
      success: onSuccess,
      error: onError
    })
  })

  function onSuccess(response) {
    console.log(response)
    renderCustomerCard(container, response)
  }

  function onError(xhr) {
    console.log(xhr)
  }
}

const renderSuccess = (container) => {
  const loginSuccessPageElem = Template.LoginSuccess()
  container.empty()
  container.html(loginSuccessPageElem)

  handleLogout(container)
  handleSearch(container)
}

export {renderSuccess}