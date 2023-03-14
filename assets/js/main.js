function preloader () {
  const preloaderHTML = document.querySelector('.preloader')

  window.addEventListener('load', () => {
    preloaderHTML.style.display = 'none'
  })
}

function darkMode () {
  const navbarIconMoonHTML = document.querySelector('.navbar__icon-moon')
  const navbarIconSunHTML = document.querySelector('.navbar__icon-sun')
  const moonIconHTML = document.querySelector('.bx-moon')
  const sunIconHTML = document.querySelector('.bxs-sun')
  const bodyHTML = document.querySelector('body')

  moonIconHTML.addEventListener('click', function () {
    bodyHTML.classList.toggle('dark-theme')
    navbarIconMoonHTML.classList.toggle('logo__darkmode')
    navbarIconSunHTML.classList.toggle('logo__darkmode')
  
    if (document.body.classList.contains('dark-theme')) {
      localStorage.setItem('dark-mode', 'true')
    } else {
      localStorage.setItem('dark-mode', 'false')
    }
  })

  sunIconHTML.addEventListener('click', function () {
    bodyHTML.classList.toggle('dark-theme')
    navbarIconMoonHTML.classList.toggle('logo__darkmode')
    navbarIconSunHTML.classList.toggle('logo__darkmode')

    if (document.body.classList.contains('dark-theme')) {
      localStorage.setItem('dark-mode', 'true')
    } else {
      localStorage.setItem('dark-mode', 'false')
    }
  })
}

function saveDarkMode () {
  const bodyHTML = document.querySelector('body')
  const navbarIconMoonHTML = document.querySelector('.navbar__icon-moon')
  const navbarIconSunHTML = document.querySelector('.navbar__icon-sun')

  if (localStorage.getItem('dark-mode') === 'true') {
    bodyHTML.classList.add('dark-theme')
    navbarIconMoonHTML.classList.add('logo__darkmode')
    navbarIconSunHTML.classList.remove('logo__darkmode')
  } else {
    bodyHTML.classList.remove('dark-theme')
    navbarIconMoonHTML.classList.remove('logo__darkmode')
    navbarIconSunHTML.classList.add('logo__darkmode')
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
      headerHTML.classList.add('header__active')
    } else {
      headerHTML.classList.remove('header__active')
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
  const productsHTML = document.querySelector('.products__items')

  let html = ''

  for (const product of db.products) {
    html += `
    <div class="product__item mix ${product.category}">
        <div class="product__item-img">
            <img src="${product.image}" alt="${product.name}">
        </div>
          ${
            product.quantity
              ? `<div class="addCart"><i class='bx bx-plus' id='${product.id}'></i></div>`
              : ''
          }

        <div class="product__item-info">
            <h3>$${product.price.toFixed(2)} 
            ${
              product.quantity
                ? `<span> Stock: ${product.quantity} </span>`
                : '<span class="sold__out">SoldOut</span>'
            }
            </h3> 
            <p class="product__name" id='${product.id}'>${product.name}</p>
        </div>
    </div>`
  }

  productsHTML.innerHTML = html
}

function addCart (db) {
  const productsItemsHTML = document.querySelector('.products__items')

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
  const cartProductHTML = document.querySelector('.cart__products')

  let html = ''

  let total = 0

  for (const product in db.cart) {
    const { quantity, price, name, image, id, amount } = db.cart[product]

    total = price * amount

    html += `
      <div class="card__product"> 
          <div class="card__product-img">
            <img src="${image}" alt="${name}"></img>
          </div>
          <div class="card__product-description">
            <h3 class="card__product-description-title">${name}</h3>
            <p class="card__product-description-stock">Stock:${quantity} | <span>$${price.toFixed(2)}</span> </p>
            <p class="card__product-description-subtotal">Subtotal: $${total.toFixed(2)}</p>
            <div class="card__product-description-unit-total" id="${id}">
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
  const cartProductsHTML = document.querySelector('.cart__products')

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

function filter () {
  $(function () {
    $('#productsItems').on('mixLoad', function () {
      console.log('[event-handler] MixItUp Loaded')
    })

    $('#productsItems').on('mixStart', function () {
      console.log('[event-handler] Animation Started')
    })

    $('#productsItems').on('mixEnd', function () {
      console.log('[event-handler] Animation Ended')
    })

    $('#productsItems').mixItUp({
      callbacks: {
        onMixLoad: function () {
          console.log('[callback] MixItUp Loaded')
        },
        onMixStart: function () {
          console.log('[callback] Animation Started')
        },
        onMixEnd: function () {
          console.log('[callback] Animation Ended')
        }
      }
    })
  })
}

function cartTotal (db) {
  const cartTotalInfoItemsHTML = document.querySelector(
    '.cart__total-info-items'
  )
  const cartTotalInfoTotalHTML = document.querySelector(
    '.cart__total-info-total'
  )
  const productsInCart = document.querySelector('.products__cart')

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

function deleteAll(db){
  const trashAllHTML = document.querySelector('.bxs-trash')

  trashAllHTML.addEventListener('click', function() {
    if (Object.values(db.cart).length === 0) {
      alert('No tiene productos que eliminar.')
    } else {
      const response = confirm(
        '¿Usted desea eliminar todos los productos de su carrito?'
      )

      if (!response) return
      db.cart = {}
      window.localStorage.setItem('cart', JSON.stringify(db.cart))

      printProducts(db)
      printProductsInCart(db)
      cartTotal(db)

      location.reload()
    }
  })
}

function buy (db) {
  const btnBuy = document.querySelector('.btn')

  btnBuy.addEventListener('click', function () {
    if (Object.values(db.cart).length === 0) {
      alert('Añade algún producto a tu carrito.')
    } else {
      const response = confirm(
        '¿Usted desea comprar los productos seleccionados?'
      )
      if (!response) return

      const currentProducts = []

      for (const product of db.products) {
        const productCart = db.cart[product.id]

        if (product.id === productCart?.id) {
          currentProducts.push({
            ...product,
            quantity: product.quantity - productCart.amount
          })
        } else {
          currentProducts.push(product)
        }
      }

      db.products = currentProducts
      db.cart = {}

      window.localStorage.setItem('products', JSON.stringify(db.products))
      window.localStorage.setItem('cart', JSON.stringify(db.cart))

      location.reload()

      printProducts(db)
      printProductsInCart(db)
      cartTotal(db)
      filter()
    }
  })
}

function modal (db) {
  const productModalHTML = document.querySelector('.products__items')
  const modalHTML = document.querySelector('.modal')

  productModalHTML.addEventListener('click', function(e){
    if (e.target.classList.contains('product__name')) {
      const id = Number(e.target.id)
      let html = ''

      for (const product of db.products) {
        if (id === product.id) {
          html += `
        <div class="modal__item">
            <div class="modal__x">
              <i class='bx bx-x'></i>
            </div>
            <div class="modal__item-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
              
    
            <div class="modal__item-info">
              <p class="modal__name" >${product.name} - ${product.category}</p>
              <p class="modal__description">${product.description}</p>
            
              <div class="modal__info">
                <h3>$ ${product.price.toFixed(2)} 
                ${
                  product.quantity
                    ? `<span> Stock: ${product.quantity} </span>`
                    : '<span class="sold__out">SoldOut</span>'
                }
                </h3> 
                <p>Stock: ${product.quantity}</p>
              </div>
              
            </div>
        </div>` 
        break
        }
      }
      
      modalHTML.classList.toggle('show__modal')
      modalHTML.innerHTML = html 

      modalHTML.addEventListener('click', function(e){
        if (e.target.classList.contains('bx-x')) {
          modalHTML.classList.remove('show__modal')
        }
      })
    }
  })
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
  
  deleteAll(db)
  
  buy(db)

  filter()

  modal(db)
}

main()
