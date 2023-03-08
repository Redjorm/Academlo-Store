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
    if (window.scrollY > 250) {
      headerHTML.classList.add('header_active')
    } else {
      headerHTML.classList.remove('header_active')
    }
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
        <div class="product_item_info">
            <h3>$ ${product.price} <span>Stock: ${product.quantity}</span></h3> 
            <p>${product.name}
            <i class='bx bx-plus' id='${product.id}'></i>
            </p>
        </div>
    </div>`
  }

  productsHTML.innerHTML = html
}

async function main () {
  menu()

  darkMode()
  saveDarkMode()

  const db = {
    products:
      JSON.parse(window.localStorage.getItem('products')) ||
      (await getProducts()),
    cart: {}
  }

  printProducts(db)
}

main()
