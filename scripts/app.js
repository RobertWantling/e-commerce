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
// const btns = document.querySelectorAll(".bag-btn");

// main cart variable - where be getting info from local storage
let cart = [];

// buttons
let buttonsDOM = [];
// when run getBagBtns easy assign them

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
    let result = "";
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
  getBagBtns() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    // console.log(buttons); // call this method after calling it ^^ - easier with spread Op ... turn into an array able to manipulate - can also manipulate the nodeList
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      // check if item is in cart
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        (button.innerText = "In Basket"), (button.disabled = true); // if item is already in the cart
      }
      button.addEventListener("click", (event) => {
        // through use of target able to disable text and add to cart
        event.target.innerText = "In Basket";
        event.target.disabled = true;
        // these two things will happen when nothing is in the cart
        // get product from products based on id from the btn
        let cartItem = { ...Storage.getProduct(id), amount: 1 }; // id is from ^^ from the dataset attribute
        // use spread on 'Storage' will get all info from object we are returning on products - add one more property of amount
        // add product to the cart
        cart = [...cart, cartItem];

        // save cart in local storage
        Storage.saveCart(cart); // save cart in storage

        // want to set the values
        this.setCartValues(cart);

        // display cart items
        this.addCartItem(cartItem);
        // show cart w/ overlay on webpage
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    // This is the item for basket
    div.innerHTML = `
    <img src= ${item.image} alt="product" />
    <div>
      <h4>${item.title}</h4>
      <h5>£${item.price}</h5>
      <span class="remove-item" data-id=${item.id}>remove</span>
    </div>
    <div>
      <i class="fas fa-chevron-up" data-id=${item.id}></i>
      <p class="item-amount">${item.amount}</p>
      <i class="fas fa-chevron-down" data-id=${item.id}></i>
    </div>`;
    // append div to cart-content
    cartContent.appendChild(div);
    console.log(cartContent);
  }
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  setupAPP() {
    // empty cart ^ will be assigned values from storage
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closedCartBtn.addEventListener("click", this.hideCart);
  }
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  cartLogic() {
    // clear cart button
    // select clearCart btn - event bubbling whatever clicking on will decrease or increase value
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    }); // this.clearCart // if going to access methods in a class be careful where pointing - using this here points to the button and not clearCart variable. if its just accessing DOM elements and adding something can use this. as not accessing anything within class - why this.showCart works
    // cart functionality - need to access event prop as want to be able to remove / decrease / increase
    cartContent.addEventListener("click", (event) => {
      // can check if class of the item that is clicked on say 'remove-item', then run a functionality, if item has class of chav-up or chav-down then fire invidiual functions for them
      if (event.target.classList.contains("remove-item")) {
        // fucntionaltty get item in basket
        let removeItem = event.target;
        // use dataset to remove from local storage
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        // this will remove from cart
        this.removeItem(id);
        // still need to remove from DOM - need to access parent of parent
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        // values in cart array - so push new amount into local storage - use find method for cart
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        // want to update cart in local storage as well - pass in new cart
        Storage.saveCart(cart);
        // calc the totals in cart
        this.setCartValues(cart); // pass cart that was just updated
        // and total of items we have in basket
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        // want to select cart value - through find method
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
  clearCart() {
    // want to get all ID's of all items that are in the cart - sync with what is in the local storage
    let cartItems = cart.map((item) => item.id);
    // want to loop over this array cartItems and call another method which will remove item from cart
    cartItems.forEach((id) => this.removeItem(id));
    console.log(cartContent.children);
    // target cartContent to remove all items - use while - dom el have prop of children - can check value if length bigger than 0 then want to remove them
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  removeItem(id) {
    // want to remove item from cart - want to filter account return all items that dont have certain id
    cart = cart.filter((item) => item.id !== id);
    // update values after removing items - new value
    this.setCartValues(cart);
    // get last value of cart - item remove no longer there need to store it
    Storage.saveCart(cart);
    // clear cart - want to refresh in the basket to normal
    let button = this.getSingleBtn(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to basket`;
  }
  // method get id and return btn in btns array. Use find as not node list but an array - return btn that has attritubute of dataset.id equal to the btn we are passing in
  getSingleBtn(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
}

// Local storage
// <img src="../pages/assests/icons/heart.png" alt="add to wish list">
class Storage {
  // static method - can use without creating an instance
  static saveProducts(products) {
    // have to stringify the products array
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    // return product from getProduct method
    return products.find((product) => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    // if have some kind of value in local storage then return
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

// EL where kick things off - so once things are loaded things start to load
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // setup application
  ui.setupAPP();

  // get all products / .then allow you to chain
  products
    .getProducts()
    .then((products) => {
      // then - get product
      ui.displayProducts(products); // write 1 method 'ui' and display the product
      Storage.saveProducts(products); // static - call class - to save
    })
    .then(() => {
      ui.getBagBtns();
      ui.cartLogic();
    });
});
// use json parse to get back the info from the stringify called on saveProducts
// local storage okay for a few items but once have 100's products best to use contentful for data
