import $ from "jquery"
import Template from "hb-template"
import {renderCustomerDetails} from "customer-details"

const renderViewOnClickingOnCard = (container, result) => {
  $('#search-result').click(event => {
    event.preventDefault()

    renderCustomerDetails(container, result)
  })
}

const renderCustomerCard = (container, result) => {

  const searchResultElem = Template.SearchResult({customerName: result.name, customerId: result.id})

  $('#search-panel').after(searchResultElem)

  renderViewOnClickingOnCard(container, result)
}

export {renderCustomerCard}

