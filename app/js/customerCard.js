import $ from "jquery"
import Template from "hb-template"

const renderCustomerCard = (container, result) => {

  const searchResultElem = Template.SearchResult({customerName: result.name, customerId: result.id})

  $('#search-panel').after(searchResultElem)
}

export {renderCustomerCard}

