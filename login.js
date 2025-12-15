// --- 1. Loading Screen Soranor Code ---
window.addEventListener('load', function() {
    const loader = document.getElementById('loaderOverlay');
    if (loader) {
        loader.style.display = 'none';
    }
});

// --- 2. Tab Change Korar Logic ---
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(div => div.classList.remove('active'));
    document.querySelectorAll('.tab-menu div').forEach(div => div.classList.remove('active'));

    const content = document.getElementById(tabName + 'Content');
    const tab = document.getElementById(tabName + 'Tab');
    
    if (content) content.classList.add('active');
    if (tab) tab.classList.add('active');
}

// --- 3. Password Dekha/Lukanor Logic ---
function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text"; 
        icon.textContent = "🙈"; 
    } else {
        input.type = "password"; 
        icon.textContent = "👁️";
    }
}

// --- 4. REGISTER FUNCTION (LIVE SERVER) ---
async function handleRegister() {
    const fullName = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (!fullName || !email || !password) {
        alert("সব তথ্য পূরণ করুন!");
        return;
    }

    // ফ্রন্টএন্ড ভ্যালিডেশন
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("দয়া করে একটি সঠিক ইমেইল ঠিকানা দিন! (যেমন: example@gmail.com)");
        return;
    }

    const registerBtn = document.querySelector('.register-btn');
    const originalText = registerBtn.innerText;
    registerBtn.innerText = "অপেক্ষা করুন...";
    registerBtn.disabled = true;

    try {
        const response = await fetch('https://farm-vet-project.vercel.app/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name: fullName, email: email, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("অ্যাকাউন্ট তৈরি সফল হয়েছে! এখন লগইন করুন।");
            showTab('login');
        } else {
            // 🔥 ফিক্সড: এরর মেসেজ হ্যান্ডলিং
            let errorMsg = "রেজিস্ট্রেশন ব্যর্থ হয়েছে";
            
            if (data.detail) {
                if (typeof data.detail === 'string') {
                    // যদি সাধারণ টেক্সট এরর হয়
                    errorMsg = data.detail;
                } else if (Array.isArray(data.detail)) {
                    // যদি Pydantic এরর লিস্ট পাঠায় (যেমন ইমেইল ভুল)
                    errorMsg = "তথ্য সঠিক নয়: " + data.detail[0].msg;
                }
            }
            alert("সমস্যা: " + errorMsg);
        }
    } catch (error) {
        console.error('Error:', error);
        alert("সার্ভারে সমস্যা হচ্ছে। ইন্টারনেট কানেকশন চেক করুন।");
    } finally {
        registerBtn.innerText = originalText;
        registerBtn.disabled = false;
    }
}

// --- 5. LOGIN FUNCTION (LIVE SERVER) ---
async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert("ইমেইল এবং পাসওয়ার্ড দিন!");
        return;
    }

    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.innerText;
    loginBtn.innerText = "যাচাই করা হচ্ছে...";
    loginBtn.disabled = true;

    try {
        const response = await fetch('https://farm-vet-project.vercel.app/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('user_name', data.name);
            localStorage.setItem('user_id', data.user_id); 
            
            alert("স্বাগতম " + data.name + "!");
            window.location.href = "dashboard/dashboard.html"; 
        } else {
            alert("লগইন ব্যর্থ: " + (data.detail || "ভুল ইমেইল বা পাসওয়ার্ড"));
        }
    } catch (error) {
        console.error('Error:', error);
        alert("সার্ভারে সমস্যা হচ্ছে।");
    } finally {
        loginBtn.innerText = originalText;
        loginBtn.disabled = false;
    }
}

// --- 6. Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.login-btn');
    if(loginBtn) loginBtn.onclick = handleLogin;

    const registerBtn = document.querySelector('.register-btn');
    if(registerBtn) registerBtn.onclick = handleRegister;

    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const resetTab = document.getElementById('resetTab');

    if(loginTab) loginTab.addEventListener('click', () => showTab('login'));
    if(registerTab) registerTab.addEventListener('click', () => showTab('register'));
    if(resetTab) resetTab.addEventListener('click', () => showTab('reset'));
});