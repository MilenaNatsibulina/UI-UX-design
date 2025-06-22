document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.querySelector(".main.cart");
    const totalPriceBlock = document.querySelector(".upplate .hi"); // блок "Итого"
    const CART_KEY = "cartItems";

    function getCartItems() {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    }

    function saveCartItems(items) {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    }

    function renderCart() {
        const items = getCartItems();
        cartContainer.innerHTML = "";
        let total = 0;

        items.forEach((item, index) => {
            total += item.price * item.quantity;

            const itemHTML = `
                <div class="main cart">
                    <div style="display: flex; align-items: center; width: 50%;">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <div class="hi">${item.name}</div>
                            <div style="display: flex; width: 62px; justify-content: space-between; margin-top: 13px;">
                                <img src="../Icons/minus-cirlce.svg" alt="-" class="qty-minus" data-index="${index}">
                                <div>${item.quantity}</div>
                                <img src="../Icons/add-circle.svg" alt="+" class="qty-plus" data-index="${index}">
                            </div>
                        </div>
                    </div>
                    <div class="rightblock" style="width: 50%; justify-content: center;">
                        <div class="hi" style="width: 90%; text-align: center;">${item.price * item.quantity}₽</div>
                        <img src="../Icons/close-small.svg" alt="×" class="delete-item" data-index="${index}">
                    </div>
                </div>
            `;
            cartContainer.insertAdjacentHTML("beforeend", itemHTML);
        });

        totalPriceBlock.textContent = `Итого: ${total}₽`;
        addEventListeners();
    }

    function addEventListeners() {
        document.querySelectorAll(".qty-plus").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = btn.dataset.index;
                const items = getCartItems();
                items[index].quantity++;
                saveCartItems(items);
                renderCart();
            });
        });

        document.querySelectorAll(".qty-minus").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = btn.dataset.index;
                const items = getCartItems();
                if (items[index].quantity > 1) {
                    items[index].quantity--;
                    saveCartItems(items);
                    renderCart();
                }
            });
        });

        document.querySelectorAll(".delete-item").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = btn.dataset.index;
                const items = getCartItems();
                items.splice(index, 1);
                saveCartItems(items);
                renderCart();
            });
        });
    }

    renderCart();
});
