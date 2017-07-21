import $ from "jquery"
import Template from "hb-template"

const renderCustomerDetails = (container, customerDetails) => {
  const customerDetailsView = Template.CustomerDetails(customerDetails)
  $('#search-result').after(customerDetailsView)
}

export {renderCustomerDetails}