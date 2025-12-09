// ১. পেজ লোড হলে যা যা হবে
document.addEventListener('DOMContentLoaded', function () {
    // লোডিং এনিমেশন হ্যান্ডেল করা
    handleLoader();
    
    // ড্যাশবোর্ডের সংখ্যা আপডেট করা
    updateDashboardStats();
    
    // হোম আইকনের লজিক
    setupHomeIcon();
});

// ২. ড্যাশবোর্ডের সংখ্যা আপডেট করার ফাংশন
async function updateDashboardStats() {
    const userName = localStorage.getItem('user_name');
    if (!userName) return;

    try {
        const response = await fetch(`https://farm-vet-project.vercel.app/dashboard-stats?user_name=${encodeURIComponent(userName)}`);
        const data = await response.json();

        // সংখ্যাগুলো বাংলায় কনভার্ট করে বসাচ্ছি
        if(document.getElementById('total-count')) {
            document.getElementById('total-count').innerText = convertToBanglaNumber(data.total);
        }
        if(document.getElementById('pending-count')) {
            document.getElementById('pending-count').innerText = convertToBanglaNumber(data.pending);
        }
        if(document.getElementById('completed-count')) {
            document.getElementById('completed-count').innerText = convertToBanglaNumber(data.completed);
        }
    } catch (error) {
        console.error("Stats Error:", error);
    }
}

// ৩. ইংরেজি সংখ্যাকে বাংলায় করার ফাংশন
function convertToBanglaNumber(number) {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return number.toString().split('').map(digit => banglaDigits[digit] || digit).join('');
}

// ৪. লোডিং স্ক্রিন হ্যান্ডেলার
function handleLoader() {
    const loaderOverlay = document.getElementById('loaderOverlay');
    const mainContent = document.getElementById('content');

    setTimeout(function () {
        if(loaderOverlay) loaderOverlay.style.opacity = '0';
        setTimeout(function () {
            if(loaderOverlay) loaderOverlay.style.display = 'none';
            if(mainContent) mainContent.style.display = 'block';
        }, 300);
    }, 1000); // ১ সেকেন্ড লোডিং
}

// ৫. হোম আইকন সেটআপ
function setupHomeIcon() {
    const homeIcon = document.getElementById('home-icon');
    const loaderOverlay = document.getElementById('loaderOverlay');
    
    if (homeIcon) {
        homeIcon.addEventListener('click', function (e) {
            e.preventDefault();
            if (loaderOverlay) {
                loaderOverlay.style.display = 'flex';
                loaderOverlay.style.opacity = '1';
            }
            setTimeout(() => {
                // ড্যাশবোর্ড রিলোড বা মেইন ইনডেক্সে যাওয়া
                window.location.href = "farmvet-dashboard.html"; 
            }, 300);
        });
    }
}

// ৬. লগআউট ফাংশন
function handleLogout() {
    if (confirm("আপনি কি নিশ্চিত লগআউট করতে চান?")) {
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_id');
        window.location.href = "../index.html"; 
    }
}

// ৭. প্রোফাইল এডিট ফাংশন
function editProfile() {
    const currentName = localStorage.getItem('user_name') || "";
    const newName = prompt("আপনার নাম পরিবর্তন করুন:", currentName);

    if (newName && newName.trim() !== "") {
        localStorage.setItem('user_name', newName);
        alert("✅ প্রোফাইল আপডেট হয়েছে! নতুন নাম: " + newName);
        location.reload();
    }
}