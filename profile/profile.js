// পেজ লোড হলে ইউজারের নাম অটোমেটিক বসাবে
document.addEventListener('DOMContentLoaded', function() {
    const savedName = localStorage.getItem('user_name');
    if(savedName) {
        document.getElementById('name').value = savedName;
    }
});

document.getElementById('profileUpdateForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const currentPassword = document.getElementById('current-password').value;

    // ভ্যালিডেশন
    if (currentPassword.trim() === "") {
        alert("প্রোফাইল আপডেট করার জন্য বর্তমান পাসওয়ার্ড প্রয়োজন।");
        return;
    }

    // নাম আপডেট হলে লোকাল স্টোরেজেও আপডেট করছি
    if(name) {
        localStorage.setItem('user_name', name);
    }

    // ফিল্ড ক্লিয়ার
    document.getElementById('new-password').value = '';
    document.getElementById('current-password').value = '';

    // সাকসেস মেসেজ
    alert("✅ আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে।");

    // ড্যাশবোর্ডে ফেরত পাঠানো
    window.location.href = "../farmvet-dashboard/farmvet-dashboard.html";
});

// ব্যাক বাটন লজিক
document.getElementById('backToHomeButton').addEventListener('click', function () {
    window.location.href = "../farmvet-dashboard/farmvet-dashboard.html";
});