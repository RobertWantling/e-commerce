// variables
const cartBtn = document.querySelector(".cart-btn");
const closedCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

// main cart variable - where be getting info from local storage
let cart = [];

// classes responsible for getting products - locally (later content full data management)

class Products {
  async getProducts() {
    try {
      let result = await fetch("../scripts/products.json"); // ajax request
      let data = await result.json(); // sysncrounous code in syncrounous matter
      let products = data.items;
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image }; // return clean object - es6 dont have to reassign can just call ^^
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}
// async - always returns the promise can use chainging on dot then - and await - wait till promise is settled and then return result

// dispaly products - responsible for getting all items that are being returned from product and then displaying them or manipulating / or getting them from local storage
// have most of the methods
class UI {
  // this method get array Products - call method once get products @ .then
  displayProducts(products) {
    console.log(products);
    let result = " ";
    products.forEach((product) => {
      result += `
    <article class="product">
      <div class="img-container">
        <img src=${product.image} alt="product"
          class="product-img"
          />
          <button class="bag-btn" data-id=${product.id}>
            <i class="fas fa-shopping-cart">add to basket</i>
          </button>
      
      <div class="add-to-wishlist">
        <img src="../pages/assests/icons/heart.png" alt="add-to-wishlist">
      </div>
      <div class="add-to-cart">
        <img src="../pages/assests/icons/bag-plus.png" alt="add-to-cart">
      </div>
      </div>
      <h3>${product.title}</h3>
      <h4>£${product.price}</h4>
    </article>
    `;
    });
    productsDOM.innerHTML = result;
  }
}
// Local storage
// <img src="../pages/assests/icons/heart.png" alt="add to wish list">
class Storage {}

// EL where kick things off - so once things are loaded things start to load
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // get all products
  products.getProducts().then((products) => ui.displayProducts(products));
});
