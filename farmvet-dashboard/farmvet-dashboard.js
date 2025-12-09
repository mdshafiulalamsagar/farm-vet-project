// পেজ লোড হওয়ার পর এই ফাংশনটি কাজ করবে
window.addEventListener('load', function () {
    const loaderOverlay = document.getElementById('loaderOverlay');
    const mainContent = document.getElementById('content');

    // setTimeout() ফাংশনটি ১.৫ সেকেন্ড (1500 মিলিসেকেন্ড) অপেক্ষা করবে
    setTimeout(function () {
        // লোডিং স্ক্রিনটিকে অদৃশ্য করে দেবে (Fade out effect)
        loaderOverlay.style.opacity = '0';

        // Opacity ট্রানজিশন শেষ হলে (৩০০ মিলিসেকেন্ড পর), এটিকে পুরোপুরি ডিসপ্লে থেকে সরিয়ে দেবে
        setTimeout(function () {
            loaderOverlay.style.display = 'none';
            // মূল কন্টেন্ট দৃশ্যমান করবে
            mainContent.style.display = 'block';
        }, 300); // CSS-এ দেওয়া transition-এর সময়ের সাথে মিল রেখে

    }, 1500); // ১.৫ সেকেন্ডের লোড টাইম
});

// নতুন কোড: হোম আইকন হ্যান্ডেল করা 
document.addEventListener('DOMContentLoaded', function () {
    const homeIcon = document.getElementById('home-icon');
    const loaderOverlay = document.getElementById('loaderOverlay');
    const transitionDelay = 300;
    // হোম আইকনে ক্লিক ইভেন্ট হ্যান্ডেল করা 
    if (homeIcon) {
        homeIcon.addEventListener('click', function (e) {
            e.preventDefault();

            // হোমপেজের মতো লোডার দেখিয়ে রিডাইরেক্ট করা
            if (loaderOverlay) {
                loaderOverlay.style.display = 'flex';
                // কন্টেন্ট ব্লক করা
                document.getElementById('content').style.display = 'block';
                // ওভারলে দেখান
                loaderOverlay.style.opacity = '1';
            }

            setTimeout(() => {
                // একই পৃষ্ঠায় লোড এড়াতে ডাইরেক্টলি নেভিগেট না করে অন্য কোনো লিঙ্কে নেভিগেট করা উচিত।
                // আপনার পূর্বের কোড অনুযায়ী একই পৃষ্ঠায় রিডাইরেক্ট করা হয়েছে। আপনি যদি homepage এ যেতে চান, তাহলে ../index.html ব্যবহার করতে পারেন।
                window.location.href = "../dashboard/dashboard.html";
            }, transitionDelay);
        });
    }
});

// লগআউট ফাংশন
function handleLogout() {
    // ১. ইউজারের কাছে কনফার্মেশন চাইবো
    const confirmLogout = confirm("আপনি কি নিশ্চিত লগআউট করতে চান?");
    
    if (confirmLogout) {
        // ২. ব্রাউজার থেকে ইউজারের সব ডাটা মুছে ফেলবো
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_id');
        
        // ৩. লগইন পেজে (Home Page) পাঠিয়ে দিবো
        window.location.href = "../index.html"; 
    }
}
// প্রোফাইল এডিট করার ফাংশন
function editProfile() {
    // আগের নামটা নিচ্ছি
    const currentName = localStorage.getItem('user_name') || "";
    
    // ইউজারের কাছে নতুন নাম চাইছি
    const newName = prompt("আপনার নাম পরিবর্তন করুন:", currentName);

    // যদি ইউজার কিছু লিখে OK দেয়
    if (newName && newName.trim() !== "") {
        localStorage.setItem('user_name', newName); // নতুন নাম সেভ করলাম
        alert("✅ প্রোফাইল আপডেট হয়েছে! নতুন নাম: " + newName);
        location.reload(); // পেজ রিলোড দিলাম যাতে নামটা আপডেট হয়
    }
}