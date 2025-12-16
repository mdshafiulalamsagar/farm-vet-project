// ১. পেজ লোড হলে যা যা হবে
document.addEventListener('DOMContentLoaded', function () {
    handleLoader();
    updateDashboardStats();
    setupHomeIcon();
    
    // 🔥 নতুন: অ্যাডমিন বাটন চেক
    checkAdminAccess();
});

// ২. ড্যাশবোর্ডের সংখ্যা আপডেট
async function updateDashboardStats() {
    const userName = localStorage.getItem('user_name');
    if (!userName) return;

    try {
        const response = await fetch(`https://farm-vet-project.vercel.app/dashboard-stats?user_name=${encodeURIComponent(userName)}`);
        const data = await response.json();

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

// ৩. বাংলা কনভার্টার
function convertToBanglaNumber(number) {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return number.toString().split('').map(digit => banglaDigits[digit] || digit).join('');
}

// ৪. লোডার
function handleLoader() {
    const loaderOverlay = document.getElementById('loaderOverlay');
    const mainContent = document.getElementById('content');

    setTimeout(function () {
        if(loaderOverlay) loaderOverlay.style.opacity = '0';
        setTimeout(function () {
            if(loaderOverlay) loaderOverlay.style.display = 'none';
            if(mainContent) mainContent.style.display = 'block';
        }, 300);
    }, 1000); 
}

// ৫. হোম আইকন
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
                window.location.href = "../dashboard/dashboard.html"; 
            }, 300);
        });
    }
}

// ৬. লগআউট
function handleLogout() {
    if (confirm("আপনি কি নিশ্চিত লগআউট করতে চান?")) {
        localStorage.clear(); // সব ক্লিয়ার
        window.location.href = "../index.html"; 
    }
}

// ৭. 🔥 নতুন: অ্যাডমিন বাটন দেখানোর লজিক
function checkAdminAccess() {
    const role = localStorage.getItem('user_role'); // লগইনের সময় সেভ হয়েছিল
    const adminBtn = document.getElementById('admin-panel-btn');
    
    // যদি রোল 'admin' হয়, বাটন দেখাও
    if (role === 'admin' && adminBtn) {
        adminBtn.style.display = 'block';
    }
}