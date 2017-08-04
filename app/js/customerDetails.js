import $ from "jquery"
import Template from "hb-template"
import _ from "lodash"

const renderNavigation = (customerDetails) => {
  const navigation = Template.Navigation(customerDetails)
  $('#customer-details').append(navigation)
}

const createPostalAddress = (medium) => {
  return medium.street1 + ', ' + medium.city + ', ' + medium.stateOrProvince + ', ' + medium.country + ', ' + medium.postcode
}

const getMediums = (mediums) => {
  return _.map(mediums, (medium) => {
    if (medium.type === 'Email') {
      return _.assignIn(medium, {data: medium.medium.emailAddress})
    } else if (medium.type === 'PostalAddress') {
      return _.assignIn(medium, {data: createPostalAddress(medium.medium)})
    } else if (medium.type === 'TelephoneNumber') {
      return _.assignIn(medium, {data: medium.medium.number})
    }
  })
}

const renderFeatureContainer = (customerDetails) => {
  $('#customer-contact a').click(() => {
    $('#customer-contact a').addClass('selected')
    const mediums = getMediums(customerDetails.contact.contactMedium)
    const featureContainer = Template.FeatureContainer({mediums})
    $('#customer-details').append(featureContainer)
  })
}

const renderCustomerDetails = (container, customerDetails) => {
  $('#search-result').after('<div id="customer-details"></div>')
  renderNavigation(customerDetails)
  renderFeatureContainer(customerDetails)
}

export {renderCustomerDetails}