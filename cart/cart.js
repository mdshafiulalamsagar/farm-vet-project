function formatCurrency(amount) {
    return `৳ ${Number(amount).toLocaleString('bn-BD')}`;
}

function updateCartBadge(count) {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = count;
    }
}

function renderCart() {
    let cart = JSON.parse(localStorage.getItem('userCart')) || [];
    const cartList = document.getElementById('cartList');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartSummary = document.getElementById('cartSummary');
    const emptyMessage = document.getElementById('emptyCartMessage');
    let total = 0;
    let cartHtml = '';

    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
        cartSummary.style.display = 'none';
        updateCartBadge(0);
        cartList.innerHTML = '';
        attachEventListeners();
        return;
    }

    emptyMessage.style.display = 'none';
    cartSummary.style.display = 'block';


    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const isMedicine = item.type === 'medicine';

        let quantityControlHtml = '';
        if (isMedicine) {
            quantityControlHtml = `
                        <div class="quantity-controls">
                            <button class="qty-btn" data-index="${index}" data-action="decrement" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                            <input type="text" class="item-quantity" value="${item.quantity}" readonly>
                            <button class="qty-btn" data-index="${index}" data-action="increment">+</button>
                        </div>
                    `;
        } else {
            quantityControlHtml = `<div class="quantity-controls" style="min-width:30px; border: none; margin-right: 40px;">বুকিং</div>`;
        }


        cartHtml += `
                    <div class="cart-item" data-index="${index}">
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                            <div class="item-details">${item.info}</div>
                        </div>
                        <div class="item-price-actions">
                            ${quantityControlHtml}
                            <div class="item-price">
                                ${formatCurrency(item.price)}
                                <span class="item-subtotal">মোট: ${formatCurrency(subtotal)}</span>
                            </div>
                            <i class="fas fa-trash-alt delete-btn" data-index="${index}"></i>
                        </div>
                    </div>
                `;
    });

    cartList.innerHTML = cartHtml;
    cartTotalElement.textContent = formatCurrency(total);
    updateCartBadge(cart.length);

    attachEventListeners();
}

function attachEventListeners() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const qtyButtons = document.querySelectorAll('.qty-btn');
    const backButton = document.getElementById('backButton');
    const homeIcon = document.getElementById('home-icon');
    const loader = document.getElementById('loaderOverlay');
    const checkoutButton = document.querySelector('.checkout-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.dataset.index;
            let cart = JSON.parse(localStorage.getItem('userCart')) || [];

            cart.splice(index, 1);

            localStorage.setItem('userCart', JSON.stringify(cart));

            renderCart();
        });
    });

    qtyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.dataset.index;
            const action = event.target.dataset.action;
            let cart = JSON.parse(localStorage.getItem('userCart')) || [];

            if (cart[index] && cart[index].type === 'medicine') {
                if (action === 'increment') {
                    cart[index].quantity += 1;
                } else if (action === 'decrement' && cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                }

                localStorage.setItem('userCart', JSON.stringify(cart));

                renderCart();
            }
        });
    });

    if (homeIcon) {
        homeIcon.addEventListener('click', () => {
            if (loader) {
                loader.style.display = 'flex';
                setTimeout(() => { loader.style.opacity = '1'; }, 10);
            }
            setTimeout(() => {
                window.location.href = "../dashboard/dashboard.html";
            }, 500);
        });
    }

    if (backButton) {
        backButton.addEventListener('click', () => {
            window.history.back();
        });
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            alert('চেকআউট প্রক্রিয়াকরণ শুরু হচ্ছে...');

            if (loader) {
                loader.style.display = 'flex';
                setTimeout(() => { loader.style.opacity = '1'; }, 10);
            }

            setTimeout(() => {
                window.location.href = "../checkout/checkout.html";
            }, 1500);
        });
    }
}


window.onload = function () {
    renderCart();
};