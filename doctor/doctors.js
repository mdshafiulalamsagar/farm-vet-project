// কার্ট ব্যাজ আপডেট ফাংশন
function updateCartBadge(count) {
    const badge = document.querySelector('.cart-badge');
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'block';
    } else {
        badge.textContent = '0';
        badge.style.display = 'none';
    }
}

// লোডার দেখানোর ফাংশন (শুধুমাত্র কার্ট আইকনে ক্লিক করলে ব্যবহার হবে)
function showLoaderAndRedirect(url) {
    const loader = document.getElementById('loaderOverlay');
    loader.style.opacity = '1';
    loader.style.display = 'flex';

    setTimeout(() => {
        window.location.href = url;
    }, 1500); // 1.5 সেকেন্ড
}

// সার্চ ফাংশন
function filterDoctors() {
    const input = document.getElementById('doctorSearch');
    const filter = input.value.toUpperCase();
    const doctorList = document.getElementById('doctorList');
    const items = doctorList.getElementsByClassName('doctor-item');

    for (let i = 0; i < items.length; i++) {
        const nameElement = items[i].querySelector('.doctor-name');
        const banglaName = nameElement.textContent.toUpperCase();
        // অতিরিক্ত ডেটা অ্যাট্রিবিউট থেকে ইংরেজি নাম
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
    // পেজ লোড হওয়ার পর লোডার হাইড
    const initialLoader = document.getElementById('loaderOverlay');
    if (initialLoader) {
        setTimeout(() => {
            initialLoader.style.opacity = '0';
            setTimeout(() => {
                initialLoader.style.display = 'none';
            }, 300);
        }, 500); // 0.5 সেকেন্ডে পেজ কন্টেন্ট দেখাবে

    }

    // কার্ট আইটেম লোড এবং ব্যাজ আপডেট
    const initialCart = JSON.parse(localStorage.getItem('userCart')) || [];
    updateCartBadge(initialCart.length);

    // সার্চ ইনপুট ইভেন্ট লিসেনার
    document.getElementById('doctorSearch').addEventListener('keyup', filterDoctors);

    // কার্ট আইকনে ক্লিক লিসেনার (১.৫ সেকেন্ড লোডার দেখিয়ে কার্টে যাবে)
    document.getElementById('cartIcon').addEventListener('click', () => {
        showLoaderAndRedirect('../cart/cart.html');
    });


    const bookButtons = document.querySelectorAll('.book-button');

    bookButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const doctorItem = event.target.closest('.doctor-item');
            if (!doctorItem) return;

            const nameElement = doctorItem.querySelector('.doctor-name');
            const specialtyElement = doctorItem.querySelector('.doctor-specialty');
            const feeElement = doctorItem.querySelector('.fee');

            const doctorName = nameElement ? nameElement.textContent.trim() : 'Unknown Doctor';
            const doctorSpecialty = specialtyElement ? specialtyElement.textContent.trim() : 'Unknown Specialty';
            const doctorFee = parseInt(feeElement.getAttribute('data-fee')) || 0;

            const newCartItem = {
                type: 'doctor',
                name: doctorName,
                info: doctorSpecialty,
                price: doctorFee,
                quantity: 1
            };

            let cart = JSON.parse(localStorage.getItem('userCart')) || [];

            const existingItemIndex = cart.findIndex(item =>
                item.type === 'doctor' && item.name === doctorName
            );

            if (existingItemIndex === -1) {
                cart.push(newCartItem);

                localStorage.setItem('userCart', JSON.stringify(cart));

                updateCartBadge(cart.length);

                // শুধু অ্যালার্ট দেখাবে, রিডাইরেক্ট করবে না
                alert(`${doctorName} সফলভাবে আপনার কার্টে যোগ করা হয়েছে।`);

            } else {
                // শুধু অ্যালার্ট দেখাবে, রিডাইরেক্ট করবে না
                alert(`${doctorName} ইতিমধ্যেই আপনার কার্টে রয়েছে।`);
            }
        });
    });
};