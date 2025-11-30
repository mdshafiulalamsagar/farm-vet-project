function goBack() {
    window.history.back();
}

function formatCurrency(amount) {
    return `৳ ${Number(amount).toLocaleString('bn-BD')}`;
}

function getFormattedCurrentDateTime() {
    const now = new Date();

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    const formattedDate = now.toLocaleString('bn-BD', options);

    return formattedDate.replace('AM', 'এএম').replace('PM', 'পিএম');
}

function updateCartBadge(count) {
    const badge = document.getElementById('checkoutCartBadge');
    if (badge) {
        badge.textContent = count;
    }
}

function renderCheckoutCart(items) {
    const cartContainer = document.getElementById('checkout-cart-items-container');
    const totalAmountSpan = document.getElementById('final-total-amount');
    let total = 0;

    cartContainer.innerHTML = '';

    if (items.length === 0) {
        cartContainer.innerHTML = '<div class="summary-item"><span class="name">কার্টে কোনো আইটেম নেই।</span><span class="price">৳ 0</span></div>';
        totalAmountSpan.textContent = formatCurrency(0);
        return;
    }

    items.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('summary-item');
        itemDiv.innerHTML = `
                    <span class="name">${item.name}</span>
                    <span class="price">${formatCurrency(subtotal)}</span>
                `;
        cartContainer.appendChild(itemDiv);

        if (item.type === 'medicine') {
            const qtyDetailsDiv = document.createElement('div');
            qtyDetailsDiv.classList.add('summary-item', 'service-total-item');
            qtyDetailsDiv.innerHTML = `
                        <span class="name-qty">${item.info} x ${item.quantity}</span>
                        <span class="price-qty item-details-small">ইউনিট: ${formatCurrency(item.price)}</span>
                    `;
            qtyDetailsDiv.querySelector('.name-qty').classList.add('item-details-small');
            cartContainer.appendChild(qtyDetailsDiv);
        }

        if (item.type === 'doctor') {
            const doctorDetailsDiv = document.createElement('div');
            doctorDetailsDiv.classList.add('summary-item', 'service-total-item');
            doctorDetailsDiv.innerHTML = `
                        <span class="name-qty">${item.info}</span>
                        <span class="price-qty item-details-small">সার্ভিস ফি: ${formatCurrency(item.price)}</span>
                    `;
            doctorDetailsDiv.querySelector('.name-qty').classList.add('item-details-small');
            cartContainer.appendChild(doctorDetailsDiv);
        }
    });

    totalAmountSpan.textContent = formatCurrency(total);
}

function loadCheckoutCart() {
    const cartJson = localStorage.getItem('userCart');
    let cartItems = [];

    if (cartJson) {
        try {
            cartItems = JSON.parse(cartJson);
        } catch (e) {
            console.error("Error parsing cart data from localStorage:", e);
        }
    }

    renderCheckoutCart(cartItems);

    updateCartBadge(cartItems.length);

    const deliveryTimeInput = document.getElementById('delivery-time');
    if (deliveryTimeInput) {
        deliveryTimeInput.value = getFormattedCurrentDateTime();
    }

    document.getElementById('confirmOrderButton').addEventListener('click', function () {
        alert('অর্ডার কনফার্ম করা হলো! ধন্যবাদ।');

        window.location.href = '../dashboard/dashboard.html';
    });
}