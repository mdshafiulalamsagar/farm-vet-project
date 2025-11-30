// কার্ট ব্যাজ আপডেট ফাংশন
function updateCartBadge(count) {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'block';
        } else {
            badge.textContent = '0';
            badge.style.display = 'none';
        }
    }
}

// লোডার দেখানোর ফাংশন
function showLoaderAndRedirect(url) {
    const loader = document.getElementById('loaderOverlay');
    loader.style.opacity = '1';
    loader.style.display = 'flex';

    setTimeout(() => {
        window.location.href = url;
    }, 1500); // 1.5 সেকেন্ড
}

// সার্চ ফাংশন
function filterMedicines() {
    const input = document.getElementById('medicineSearch');
    const filter = input.value.toUpperCase();
    const productList = document.getElementById('productList');
    const items = productList.getElementsByClassName('product-item');

    for (let i = 0; i < items.length; i++) {
        const nameElement = items[i].querySelector('.product-name');
        const banglaName = nameElement.textContent.toUpperCase();
        // ডেটা অ্যাট্রিবিউট থেকে ইংরেজি নাম
        const englishName = nameElement.getAttribute('data-english-name').toUpperCase();

        // বাংলা নাম বা ইংরেজি নামের সাথে সার্চের মিল খুঁজবে
        if (banglaName.includes(filter) || englishName.includes(filter)) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
    }
}


window.onload = function () {
    const loader = document.getElementById('loaderOverlay');

    // পেজ লোড হওয়ার পর লোডার হাইড
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }, 500);
    }

    // কার্ট আইটেম লোড এবং ব্যাজ আপডেট
    const initialCart = JSON.parse(localStorage.getItem('userCart')) || [];
    updateCartBadge(initialCart.length);

    // সার্চ ইনপুট ইভেন্ট লিসেনার
    document.getElementById('medicineSearch').addEventListener('keyup', filterMedicines);

    // কার্ট আইকনে ক্লিক লিসেনার (১.৫ সেকেন্ড লোডার দেখিয়ে কার্টে যাবে)
    document.getElementById('cartIconLink').addEventListener('click', (e) => {
        e.preventDefault(); // ডিফল্ট লিঙ্ক প্রিভেন্ট
        showLoaderAndRedirect('../cart/cart.html');
    });


    const orderButtons = document.querySelectorAll('.order-button');

    orderButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productItem = event.target.closest('.product-item');
            if (!productItem) return;

            const nameElement = productItem.querySelector('.product-name');
            const manufacturerElement = productItem.querySelector('.manufacturer');
            const priceElement = productItem.querySelector('.price');

            const productName = nameElement ? nameElement.textContent.trim() : 'Unknown Product';
            const productManufacturer = manufacturerElement ? manufacturerElement.textContent.trim() : 'Unknown Manufacturer';
            const productPriceText = priceElement ? priceElement.textContent.trim().replace('৳', '').trim() : '0';
            const productPrice = parseInt(productPriceText) || 0;

            const newCartItem = {
                type: 'medicine',
                name: productName,
                info: productManufacturer,
                price: productPrice,
                quantity: 1
            };

            let cart = JSON.parse(localStorage.getItem('userCart')) || [];

            const existingItemIndex = cart.findIndex(item =>
                item.type === 'medicine' && item.name === productName
            );

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += 1;
                alert(`${productName} এর পরিমাণ বাড়ানো হয়েছে!`);
            } else {
                cart.push(newCartItem);
                alert(`${productName} কার্টে যোগ করা হয়েছে!`);
            }

            localStorage.setItem('userCart', JSON.stringify(cart));
            updateCartBadge(cart.length);

            // এখানে পরিবর্তন: সরাসরি কার্টে না গিয়ে শুধু অ্যালার্ট দেখাবে।
            // যদি কার্ট পেজে যেতে চান, নিচের লাইনটি Uncomment করুন:
            // window.location.href = '../cart/cart.html'; 
        });
    });
};