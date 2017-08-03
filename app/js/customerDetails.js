import $ from "jquery"
import Template from "hb-template"

const renderNavigation = (customerDetails) => {
  const navigation = Template.Navigation(customerDetails)
  $('#customer-details').append(navigation)
}

const renderFeatureContainer = (customerDetails) => {
  $('#customer-contact a').click(() => {
    $('#customer-contact a').addClass('selected')
    const featureContainer = Template.FeatureContainer()
    $('#customer-details').append(featureContainer)
  })
}

const renderCustomerDetails = (container, customerDetails) => {
  $('#search-result').after('<div id="customer-details"></div>')
  renderNavigation(customerDetails)
  renderFeatureContainer(customerDetails)
}

export {renderCustomerDetails}