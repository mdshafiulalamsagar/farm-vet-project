document.addEventListener('DOMContentLoaded', () => {
    // লগইনের সময় সেভ করা নামটা নিয়ে আসছি
    const userName = localStorage.getItem('user_name');
    
    if (userName) {
        // সুন্দর করে নাম ধরে ওয়েলকাম জানানো
        alert("স্বাগতম, " + userName + "! 👋");
    }
});

// কার্ট ব্যাজ আপডেট করার ফাংশন
function updateCartBadge() {
    const cartSpan = document.querySelector('.cart-icon span');
    // localStorage থেকে কার্ট ডেটা নেওয়া হচ্ছে (যদি না থাকে তবে ফাঁকা Array)
    let cart = JSON.parse(localStorage.getItem('userCart')) || [];
    const count = cart.length; // কার্টে থাকা আইটেমের মোট সংখ্যা

    if (cartSpan) {
        if (count > 0) {
            cartSpan.textContent = count;
            cartSpan.style.display = 'inline-block'; // আইটেম থাকলে ব্যাজ দেখাও
        } else {
            cartSpan.textContent = '0';
            cartSpan.style.display = 'none'; // আইটেম না থাকলে ব্যাজ লুকাও
        }
    }
}

// পেজ লোড হলে (সমস্ত রিসোর্স লোড হওয়ার পর) যা হবে
window.onload = function () {
    updateCartBadge(); // পেজ লোড হলে কার্ট ব্যাজ আপডেট করা হবে
    const loader = document.getElementById('loaderOverlay');

    if (loader) {
        // লোডারকে ধীরে ধীরে অদৃশ্য করা হচ্ছে (Fade out effect)
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none'; // ট্রানজিশন শেষ হলে পুরোপুরি লুকিয়ে ফেলা
            }, 300);
        }, 300); // 300ms পর লোডার আউট শুরু
    }
};

// DOM কন্টেন্ট লোড হওয়ার পর ইভেন্ট লিসেনার সেট করা
document.addEventListener('DOMContentLoaded', function () {
    const medicineCard = document.getElementById('medicine-card');
    const doctorCard = document.getElementById('doctor-card');
    const dashboardCard = document.getElementById('dashboard-card');
    const profileIcon = document.getElementById('profile-icon');
    const cartIcon = document.getElementById('cart-icon');
    const loader = document.getElementById('loaderOverlay');
    const transitionDelay = 300; // ট্রানজিশন শেষ হওয়ার সময় (ms)

    // --- নেভিগেশন (কার্ড ও আইকনে ক্লিক করলে লোডিং দেখিয়ে পেজ পরিবর্তন) ---

    function handleNavigation(e, url) {
        e.preventDefault();
        // লোডার দৃশ্যমান করা হলো
        if (loader) { loader.style.display = 'flex'; loader.style.opacity = '1'; }
        // ট্রানজিশন শেষ হওয়ার পর নতুন পেজে রিডাইরেক্ট করা হলো
        setTimeout(() => {
            window.location.href = url;
        }, transitionDelay);
    }

    // ইভেন্ট লিসেনারগুলি সেট করা
    if (medicineCard) {
        medicineCard.addEventListener('click', (e) => handleNavigation(e, "../medicine/medicine.html"));
    }
    if (doctorCard) {
        doctorCard.addEventListener('click', (e) => handleNavigation(e, "../doctor/doctors.html"));
    }
    if (dashboardCard) {
        dashboardCard.addEventListener('click', (e) => handleNavigation(e, "../farmvet-dashboard/farmvet-dashboard.html"));
    }
    if (profileIcon) {
        profileIcon.addEventListener('click', (e) => handleNavigation(e, "../profile/profile.html"));
    }
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => handleNavigation(e, "../cart/cart.html"));
    }


    // --- 'বুক করুন' ও 'অর্ডার করুন' বাটন লজিক (কার্টে যোগ করা) ---
    document.querySelectorAll('.btn-secondary, .btn-tertiary').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();

            // আইটেমের বিবরণ সংগ্রহ করা হচ্ছে
            const listItem = event.target.closest('.list-item');
            const itemName = listItem.querySelector('.item-name').textContent.trim();
            const itemInfo = listItem.querySelector('.item-info').textContent.trim();
            const priceText = listItem.querySelector('.price').textContent.trim();
            // '৳' চিহ্ন সরিয়ে সংখ্যায় রূপান্তর করা হলো
            const itemPrice = parseInt(priceText.replace('৳', '').trim());

            // বাটনের ক্লাস দেখে আইটেম ডাক্তার (btn-secondary) নাকি ঔষধ (btn-tertiary) তা নির্ধারণ করা হচ্ছে
            const isDoctor = event.target.classList.contains('btn-secondary');
            const itemType = isDoctor ? 'doctor' : 'medicine';

            const newCartItem = {
                type: itemType,
                name: itemName,
                info: itemInfo,
                price: itemPrice,
                quantity: 1 // প্রথমবার যোগ হচ্ছে তাই পরিমাণ ১
            };

            let cart = JSON.parse(localStorage.getItem('userCart')) || []; // স্থানীয় স্টোরেজ থেকে কার্ট ডেটা নেওয়া

            // এই আইটেমটি কার্টে আগে থেকেই আছে কি না তা খোঁজা হচ্ছে
            const existingItemIndex = cart.findIndex(item =>
                item.type === itemType && item.name === itemName
            );

            if (existingItemIndex === -1) {
                // যদি কার্টে না থাকে, নতুন আইটেম যোগ করা হলো
                cart.push(newCartItem);
                alert(`${itemName} সফলভাবে আপনার কার্টে যোগ করা হয়েছে।`);
            } else {
                // যদি আগে থেকেই থাকে:
                if (itemType === 'medicine') {
                    // ঔষধ হলে পরিমাণ ১ বাড়ানো হলো
                    cart[existingItemIndex].quantity += 1;
                    alert(`${itemName} এর পরিমাণ বাড়ানো হয়েছে। নতুন পরিমাণ: ${cart[existingItemIndex].quantity}`);
                } else {
                    // ডাক্তার বুকিং হলে, একবারের বেশি যোগ করা যাবে না
                    alert(`${itemName} এর বুকিং ইতিমধ্যেই আপনার কার্টে রয়েছে।`);
                    return; // যোগ না করে ফিরে যাওয়া
                }
            }

            // স্থানীয় স্টোরেজে কার্ট ডেটা সেভ করা এবং ব্যাজ আপডেট করা
            localStorage.setItem('userCart', JSON.stringify(cart));
            updateCartBadge();
        });
    });
});
// --- নতুন: কার্টে যোগ করার ফাংশন ---
function addToCart(name, price, type) {
    // ১. আগের কার্ট চেক করছি
    let cart = JSON.parse(localStorage.getItem('my_cart')) || [];

    // ২. নতুন আইটেম বানাচ্ছি
    const newItem = {
        name: name,
        price: price,
        type: type, // 'doctor' অথবা 'medicine'
        quantity: 1
    };

    // ৩. কার্টে ঢুকাচ্ছি
    cart.push(newItem);
    
    // ৪. সেভ করছি
    localStorage.setItem('my_cart', JSON.stringify(cart));
    
    // ৫. ইউজারকে জানাচ্ছি
    if(confirm(`${name} কার্টে যোগ হয়েছে! আপনি কি চেকআউট করতে কার্ট পেজে যেতে চান?`)) {
        // কার্ট পেজের লোকেশন (ফোল্ডার অনুযায়ী পাথ ঠিক করা হলো)
        window.location.href = "../cart/cart.html"; 
    }
}