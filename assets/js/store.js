if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

function init() {
  // remove item cart
  var removeButtonElements = document.getElementsByClassName('remove-item')
  for (let i = 0; i < removeButtonElements.length; i++) {
    var button = removeButtonElements[i]
    button.addEventListener('click', function (event) {
      var buttonClicked = event.target
      buttonClicked.parentElement.parentElement.remove()
      updateCartTotal()
    })
  }

  // change quantity
  var quantityInputs = document.getElementsByClassName('input-number')
  for (let i = 0; i < quantityInputs.length; i++) {
    var inputElelemt = quantityInputs[i]
    inputElelemt.addEventListener('change', quantityChanged)
  }

  // add to cart
  var addCartButtonElement = document.getElementsByClassName('add-cart')
  for (let i = 0; i < addCartButtonElement.length; i++) {
    var button = addCartButtonElement[i]
    button.addEventListener('click', addToCartClicked)
  }

}

function addToCartClicked(event) {
  var button = event.target
  var itemCartElement = button.parentElement.parentElement
  var title = itemCartElement.getElementsByClassName('cart-title')[0].innerText
  var priceElement = itemCartElement.getElementsByClassName('cart-price')[0]
  var price = priceElement.innerText.replace('$', '')
  addItemToCart(title, price)
}

function addItemToCart(title, price) {
  var products = JSON.parse(localStorage.getItem('cart')) || []
  var quantity = 1
  var obj = {
    'title': title,
    'price': price,
    'quantity': quantity
  }

  // check exist product
  for (let i = 0; i < products.length; i++) {
    var objTitle = products[i].title
    if (objTitle == title) {
      alert('This item is already added to the cart')
      return
    }
  }

  // push item to cart
  products.push(obj)
  localStorage.setItem('cart', JSON.stringify(products))

  // update number cart
  var cartNumber = document.getElementsByClassName('cart-number')[0]
  cartNumber.innerText = products.length
}

function quantityChanged(event) {
  var input = event.target
  if (isNaN(input.value)) {
    input.value = 1
  }
  updateCartTotal()
}

function updateCartTotal() {
  var itemRowElements = document.getElementsByClassName('item-row')
  var total = 0
  for (let i = 0; i < itemRowElements.length; i++) {
    var itemRowElement = itemRowElements[i]
    var itemPriceElement = itemRowElement.getElementsByClassName('item-price')[0]
    var quantityElement = itemRowElement.getElementsByClassName('input-number')[0]
    var price = parseFloat(itemPriceElement.innerText.replace('$', ''))
    var quantity = quantityElement.value
    total += price * quantity
    document.getElementsByClassName('item-total')[i].innerText = '$' + price * quantity
  }
  document.getElementsByClassName('price-total')[0].innerText = '$' + total
}