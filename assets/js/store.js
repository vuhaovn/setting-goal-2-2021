import { data } from './product-data.js'

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

function init() {
  // render to HTML in shop.html
  renderProduct()

  // render to HTML in cart.html
  renderCart()

  // remove item cart
  var removeButtonElements = document.getElementsByClassName('remove-item')
  for (let i = 0; i < removeButtonElements.length; i++) {
    let button = removeButtonElements[i]
    button.addEventListener('click', removeItem)
  }

  // change quantity
  var quantityInputs = document.getElementsByClassName('input-number')
  for (let i = 0; i < quantityInputs.length; i++) {
    let inputElelemt = quantityInputs[i]
    inputElelemt.addEventListener('change', quantityChanged)
  }

  // add to cart
  var addCartButtonElement = document.getElementsByClassName('add-cart')
  for (let i = 0; i < addCartButtonElement.length; i++) {
    let button = addCartButtonElement[i]
    button.addEventListener('click', addToCartClicked)
  }

  // minus or plus quantity
  var quantityButtonElement = document.getElementsByClassName('btn-number')
  for (let i = 0; i < quantityButtonElement.length; i++) {
    let button = quantityButtonElement[i]
    button.addEventListener('click', quantityButtonClicked)
  }

  // checkout page
  sumTotalPrice()
}

function renderProduct() {
  let productListElement = document.getElementById('product-list')
  if (productListElement) {
    var productItemElement = ''
    for (let i = 0; i < data.length; i++) {
      productItemElement += `
        <div class="col-md-4">
          <div class="card mb-4 product-wap rounded-0">
            <div class="card rounded-0">
              <img class="card-img rounded-0 img-fluid" src="${data[i].imgSrc}">
              <div
                class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                <ul class="list-unstyled">
                  <li><a class="btn btn-danger text-white mt-2" href="shop-single.html"><i class="far fa-eye"></i></a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="card-body" data-id="${data[i].id}">
              <a href="shop-single.html" class="cart-title h3 text-decoration-none">${data[i].title}</a>
              <ul class="list-unstyled d-flex justify-content-center mb-1">
                <li>
                  <i class="text-warning fa fa-star"></i>
                  <i class="text-warning fa fa-star"></i>
                  <i class="text-warning fa fa-star"></i>
                  <i class="text-muted fa fa-star"></i>
                  <i class="text-muted fa fa-star"></i>
                </li>
              </ul>
              <div class="d-flex">
                <p class="w-50 cart-price">$${data[i].price}</p>
                <button class="btn btn-danger add-cart w-50">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
        `
    }
    productListElement.innerHTML = productItemElement
  }
}

function renderCart() {
  var tBodyElement = document.getElementById('tbody')
  if (tBodyElement) {
    var trElement = ''
    var products = JSON.parse(localStorage.getItem('cart'))
    if (products.length > 0) {
      for (let i = 0; i < products.length; i++) {
        trElement += `
        <tr class="item-row" data-id="${products[i].id}">
          <td class="image" data-title="No"><img src="${products[i].imgSrc}" alt="${products[i].title}"></td>
          <td class="product-des" data-title="Description">
            <p class="product-name"><a href="#">${products[i].title}</a></p>
          </td>
          <td class="price" data-title="Price"><span class="item-price">$${products[i].price}</span></td>
          <td class="qty" data-title="Qty">
            <div class="input-group">
              <input type="hidden" class="id-number" value="${products[i].id}"/>
              <div class="button minus">
                <button type="button" class="btn btn-primary fs-4 btn-number" data-type="minus" data-field="quant[1]">
                  -
                </button>
              </div>
              <input type="text" name="quant[1]" class="input-number" data-min="1" data-max="100" value="${products[i].quantity}">
              <div class="button plus">
                <button type="button" class="btn btn-primary fs-6 btn-number" data-type="plus" data-field="quant[1]">
                  +
                </button>
              </div>
            </div>
          </td>
          <td class="total-amount" data-title="Total"><span class="item-total">$220.88</span></td>
          <td class="action" data-title="Remove"><button class="btn btn-danger remove-item">Delete</button>
          </td>
        </tr>`
      }
      tBodyElement.innerHTML = trElement
    } else {
      tBodyElement.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="text-center">
              <span>Cart is empty</span>
              <a href="shop.html" class="ms-3 btn btn-primary">Go to shop</a>
            </div>
          </td>
        </tr>
      `
    }
    updateCartTotal()
  }
}

function removeItem(event) {
  let buttonClicked = event.target
  let itemClicked = buttonClicked.parentElement.parentElement

  // update client
  itemClicked.remove()
  updateCartTotal()

  // update localStore
  let id = itemClicked.getAttribute('data-id')
  let products = JSON.parse(localStorage.getItem('cart'))
  products = products.filter(x => x.id !== id)
  localStorage.setItem('cart', JSON.stringify(products))
  showNumberCart()

  // if cart is empty
  if (products.length === 0) {
    renderCart()
  }
}

function addToCartClicked(event) {
  let button = event.target
  let itemCartElement = button.parentElement.parentElement
  let id = itemCartElement.getAttribute('data-id')
  let title = itemCartElement.getElementsByClassName('cart-title')[0].innerText
  let priceElement = itemCartElement.getElementsByClassName('cart-price')[0]
  let price = priceElement.innerText.replace('$', '')
  let imgSrc = itemCartElement.parentElement.getElementsByClassName('card-img')[0].src
  addItemToCart(id, title, price, imgSrc)
}

function addItemToCart(id, title, price, imgSrc) {
  let products = JSON.parse(localStorage.getItem('cart')) || []
  let exist = products.find(x => x.id === id)
  if (exist) {
    exist.quantity += 1
  } else {
    products.push({ id, title, price, imgSrc, quantity: 1 })
  }
  localStorage.setItem('cart', JSON.stringify(products))

  // update number cart
  showNumberCart()
}

function quantityChanged(event) {
  let input = event.target
  if (isNaN(input.value)) {
    input.value = 1
  }
  updateCartTotal()
}

function quantityButtonClicked(event) {
  let button = event.target
  let type = button.getAttribute('data-type')
  let group = button.parentElement.parentElement
  let id = group.getElementsByClassName('id-number')[0].value
  let input = group.getElementsByClassName('input-number')[0]
  let value = parseInt(input.value)
  if (type === 'minus') {
    value = value === 1 ? value : value - 1
  } else {
    value += 1
  }
  input.value = value
  updateCartTotal()

  // update localStore
  let products = JSON.parse(localStorage.getItem('cart')) || []
  products.map(x => {
    if (x.id == id) {
      x.quantity = value
    }
  })
  localStorage.setItem('cart', JSON.stringify(products))
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

function showNumberCart() {
  let products = JSON.parse(localStorage.getItem('cart')) || []
  let cartNumber = document.getElementsByClassName('cart-number')[0]
  cartNumber.innerText = products.length
}

function sumTotalPrice() {
  let priceBefore = document.getElementsByClassName('price-before')[0]
  let priceShipping = document.getElementsByClassName('price-shipping')[0]
  let priceTotal = document.getElementsByClassName('price-total')[0]
  let products = JSON.parse(localStorage.getItem('cart')) || []
  let sumBefore = products.reduce((prev, current, index, arr) => {
    return prev + current.price * current.quantity
  }, 0)
  let shipping = sumBefore > 500 ? 0 : 30
  let sumTotal = sumBefore + shipping
  if (priceBefore) {
    priceBefore.innerText = '$' + sumBefore
    priceShipping.innerText = '$' + shipping
    priceTotal.innerText = '$' + sumTotal
  }
}