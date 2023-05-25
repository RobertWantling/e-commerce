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
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
// async - always returns the promise can use chainging on dot then - and await - wait till promise is settled and then return result

// dispaly products - responsible for getting all items that are being returned from product and then displaying them or manipulating / or getting them from local storage

class UI {}

// Local storage

class Storage {}

// EL where kick things off - so once things are loaded things start to load
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // get all products
  products.getProducts().then((data) => console.log(data));
});
