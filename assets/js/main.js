function preloader () {
  const preloaderHTML = document.querySelector('.preloader')

  window.addEventListener('load', () => {
    preloaderHTML.style.display = 'none'
  })
}

function darkMode () {
  const moonIconHTML = document.querySelector('.bx-moon')
  const bodyHTML = document.querySelector('body')

  moonIconHTML.addEventListener('click', function () {
    bodyHTML.classList.toggle('dark-theme')

    console.log(document.body.classList.contains('dark-theme'))

    if (document.body.classList.contains('dark-theme')) {
      localStorage.setItem('dark-mode', 'true')
    } else {
      localStorage.setItem('dark-mode', 'false')
    }
  })
}

function saveDarkMode () {
  const bodyHTML = document.querySelector('body')
  if (localStorage.getItem('dark-mode') === 'true') {
    bodyHTML.classList.add('dark-theme')
  } else {
    bodyHTML.classList.remove('dark-theme')
  }
}

function menu () {
  const iconMenuHTML = document.querySelector('.bxs-dashboard')
  const headerHTML = document.querySelector('.header')
  const navbarUlHTML = document.querySelector('.navbar__ul')
  const logoHTML = document.querySelector('.logo')
  const moonIconHTML = document.querySelector('.bx-moon')

  iconMenuHTML.addEventListener('click', function () {
    navbarUlHTML.classList.toggle('navbar_ul_show')
    headerHTML.classList.toggle('header_show')
    logoHTML.classList.toggle('logo_show')
    moonIconHTML.classList.toggle('logo_show')
  })

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      headerHTML.classList.add('header_active')
    } else {
      headerHTML.classList.remove('header_active')
    }
  })
}

function showCart () {
  const iconCartHTML = document.querySelector('.bx-shopping-bag')
  const cartHTML = document.querySelector('.cart')

  iconCartHTML.addEventListener('click', function () {
    cartHTML.classList.toggle('cart_show')
  })
}

function closeCart () {
  const iconWindowCloseHTML = document.querySelector('.bx-window-close')
  const cartHTML = document.querySelector('.cart')

  iconWindowCloseHTML.addEventListener('click', function () {
    cartHTML.classList.toggle('cart_show')
  })
}

async function getProducts () {
  try {
    const data = await fetch('https://ecommercebackend.fundamentos-29.repl.co/')

    const res = await data.json()

    window.localStorage.setItem('products', JSON.stringify(res))

    return res
  } catch (error) {
    console.log(error)
  }
}

function printProducts (db) {
  const productsHTML = document.querySelector('.products_items')

  let html = ''

  for (const product of db.products) {
    html += `
    <div class="product_item">
        <div class="product_item_img">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="addCart"><i class='bx bx-plus' id='${product.id}'></i></div>
        <div class="product_item_info">
            <h3>$ ${product.price.toFixed(2)} <span>Stock: ${
      product.quantity
    }</span></h3> 
            <p>${product.name}</p>
        </div>
    </div>`
  }

  productsHTML.innerHTML = html
}

function addCart (db) {
  const productsItemsHTML = document.querySelector('.products_items')

  productsItemsHTML.addEventListener('click', function (e) {
    if (e.target.classList.contains('bx-plus')) {
      const id = Number(e.target.id)

      let productFind = null

      for (const product of db.products) {
        if (product.id === id) {
          productFind = product
          break
        }
      }

      if (db.cart[productFind.id]) {
        if (productFind.quantity === db.cart[productFind.id].amount) {
          return alert('No hay más disponibilidad del producto.')
        } else {
          db.cart[productFind.id].amount++
        }
      } else {
        db.cart[productFind.id] = { ...productFind, amount: 1 }
      }

      window.localStorage.setItem('cart', JSON.stringify(db.cart))
      printProductsInCart(db)
      cartTotal(db)
    }
  })
}

function printProductsInCart (db) {
  const cartProductHTML = document.querySelector('.cart_products')

  let html = ''

  let total = 0

  for (const product in db.cart) {
    const { quantity, price, name, image, id, amount } = db.cart[product]

    total = price * amount

    html += `
      <div class="card_product"> 
          <div class="card_product_img">
            <img src="${image}" alt="${name}"></img>
          </div>
          <div class="card_product_description">
            <h3 class="card_product_description_title">${name}</h3>
            <p class="card_product_description_stock">Stock:${quantity} | <span>$${price.toFixed(
      2
    )}</span> </p>
            <p class="card_product_description_subtotal">Subtotal: $${total.toFixed(
              2
            )}</p>
            <div class="card_product_description_unit_total" id="${id}">
              <i class='bx bx-minus-circle' ></i>
              <p>${amount} units</p>
              <i class='bx bx-plus-circle' ></i>
              <i class='bx bx-trash' ></i> 
            </div>
          </div>
      </div>
    `
  }

  cartProductHTML.innerHTML = html
}

function operationsInCart (db) {
  const cartProductsHTML = document.querySelector('.cart_products')

  cartProductsHTML.addEventListener('click', function (e) {
    if (e.target.classList.contains('bx-minus-circle')) {
      let id = Number(e.target.parentElement.id)
      if (db.cart[id].amount === 1) {
        const response = confirm('¿Desea quitar el producto del carrito?')

        if (!response) return

        delete db.cart[id]
      } else {
        db.cart[id].amount--
      }
    }

    if (e.target.classList.contains('bx-plus-circle')) {
      let id = Number(e.target.parentElement.id)

      let productFind = null

      for (const product of db.products) {
        if (product.id === id) {
          productFind = product
          break
        }
      }

      if (productFind.quantity === db.cart[productFind.id].amount) {
        return alert('No hay más disponibilidad del producto.')
      } else {
        db.cart[id].amount++
      }
    }

    if (e.target.classList.contains('bx-trash')) {
      let id = Number(e.target.parentElement.id)
      const response = confirm('¿Desea quitar el producto del carrito?')

      if (!response) return

      delete db.cart[id]
    }
    window.localStorage.setItem('cart', JSON.stringify(db.cart))
    printProductsInCart(db)
    cartTotal(db)
  })
}

function cartTotal (db) {
  const cartTotalInfoItemsHTML = document.querySelector(
    '.cart_total_info_items'
  )
  const cartTotalInfoTotalHTML = document.querySelector(
    '.cart_total_info_total'
  )
  const productsInCart = document.querySelector('.products_in_cart')

  let totalProducts = 0
  let amountProdutcs = 0

  for (const item in db.cart) {
    const { amount, price } = db.cart[item]
    totalProducts += amount * price
    amountProdutcs += amount
  }

  cartTotalInfoItemsHTML.textContent = amountProdutcs + ' Units'
  productsInCart.textContent = amountProdutcs
  cartTotalInfoTotalHTML.textContent = '$' + totalProducts.toFixed(2)
}



async function main () {
  preloader()

  menu()

  darkMode()

  saveDarkMode()

  showCart()

  closeCart()

  const db = {
    products:
      JSON.parse(window.localStorage.getItem('products')) ||
      (await getProducts()),
    cart: JSON.parse(window.localStorage.getItem('cart')) || {}
  }

  printProducts(db)

  addCart(db)

  printProductsInCart(db)

  operationsInCart(db)

  cartTotal(db)

  
}

main()
