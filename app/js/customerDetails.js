import $ from "jquery"
import Template from "hb-template"

const renderNavigation = (customerDetails) => {
  const navigation = Template.Navigation(customerDetails)
  $('#customer-details').append(navigation)
}

const renderCustomerDetails = (container, customerDetails) => {
  $('#search-result').after('<div id="customer-details"></div>')
  renderNavigation(customerDetails)
}

export {renderCustomerDetails}