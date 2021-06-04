const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses'

class GoodsItem {
    constructor(product_name, price, id_product) {
        this.product_name = product_name;
        this.price = price;
        this.id_product = id_product;
    }
    render() {
        return `
        <div id="${this.id_product}" class="goods-item" data-name="${this.product_name}" data-price="${this.price}" alt="preview">
            <h3>${this.product_name}</h3>
            <p>${this.price}</p>
            <button class="goods-item__add-to-cart"><i class="fas fa-shopping-cart"></i> В корзину</button>
        </div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }

    async fetchGoods() {
        const response = await fetch(`${API_URL}/catalogData.json`);
        if (response.ok) {
            const catalogItems = await response.json();
            this.goods = catalogItems;
        } else {
            alert('Ошибка при соединении с сервером');
        }
    }

    render() {
        let listHtml = "";
        this.goods.forEach((good) => {
            const goodItem = new GoodsItem(
                good.product_name,
                good.price,
                good.id_product
            );
            listHtml += goodItem.render();
        });
        document.querySelector(".goods-list").innerHTML = listHtml;
    }

    calcGoods() {
        let cost = this.goods.reduce((sum, goodsItem) => sum + goodsItem.price, 0);
        console.log(cost);
    }
}

class CartItem extends GoodsItem {
    constructor(name, price, id) {
        super(name, price, id);
        this.count = 1;
    }
    render() {
        return `<div id="${this.id_product}" class="goods-item" data-name="${this.product_name}" data-price="${this.price}" alt="preview">
            <h3>${this.product_name}</h3>
            <p>${this.price * this.count}</p>
            <p>${this.count} шт.</p>
            <button class="cart-item__remove-from-cart"><i class="fas fa-shopping-cart"></i> удалить</button>
        </div>`;
    }
}


class CartList {
    constructor() {
        this.cartList = {};
    }


    add(id, product) {
        if (this.cartList[id]) {
            this.cartList[id].count++;
        } else {
            this.cartList[id] = product;
        }

        this.render();
        this.showCart();
    }

    remove(id) {
        if (this.cartList[id].count == 1) {
            delete this.cartList[id];
        } else {
            this.cartList[id].count--;
        }

        this.render();
    }


    render() {
        let cart = '';

        for (let id in this.cartList) {
            cart += this.cartList[id].render();
        }

        document.querySelector('.cart-list').innerHTML = cart;
        this.setRemoveFromCartHandlers();
    }


    setRemoveFromCartHandlers() {
        document.querySelectorAll('.cart-item__remove-from-cart').forEach((button) => {
            button.addEventListener('click', (event) => {
                let product = event.target.closest('div');
                let productId = product.id;
                this.remove(productId);
            })
        });
    }


    setAddToCartHandlers() {
        document.querySelectorAll('.goods-item__add-to-cart').forEach((button) => {
            button.addEventListener('click', (event) => {
                let product = event.target.closest('div');
                let productId = product.id;
                let productName = product.dataset.name;
                let productPrice = product.dataset.price;

                let cartItem = new CartItem(productName, productPrice, productId);
                this.add(productId, cartItem);
            })
        });
    }


    clear() {
        this.cartList = {};
    }

    showCart() {
        console.log(this.cartList);
    }
}



const init = async () => {
    const list = new GoodsList();
    let cartList = new CartList();
    await list.fetchGoods();
    list.render();
    list.calcGoods();
    cartList.setAddToCartHandlers();
};


window.onload = init;