// ১. লোডিং ফিক্স (Back বাটন চাপলে যাতে আটকে না থাকে)
window.addEventListener('pageshow', function(event) {
    const loader = document.getElementById('loaderOverlay');
    if (loader) {
        loader.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // ২. লোকাল স্টোরেজ থেকে ইউজারের নাম আনা
    const userName = localStorage.getItem('user_name');
    
    // ৩. যদি নাম থাকে, তবে কনসোলে দেখাবে বা চাইলে ওয়েলকাম দিতে পারো
    if (userName) {
        console.log("Logged in as:", userName);
        
        // অপশনাল: তুমি চাইলে হ্যালো মেসেজ দিতে পারো
        // alert("স্বাগতম, " + userName + "!"); 
    } else {
        // যদি লগইন না করে কেউ জোর করে ড্যাশবোর্ডে ঢুকে, তাকে বের করে দিবো
        // window.location.href = "../index.html"; 
    }
});

// ৪. লগআউট ফাংশন (তোমার HTML-এ যদি লগআউট বাটন থাকে)
function handleLogout() {
    if(confirm("আপনি কি নিশ্চিত আপনি লগআউট করতে চান?")) {
        localStorage.removeItem('user_name'); // নাম মুছে ফেললাম
        window.location.href = "../index.html"; // লগইন পেজে পাঠালাম
    }
}