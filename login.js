// --- 1. Loading Screen Soranor Code ---
window.addEventListener('load', function() {
    const loader = document.getElementById('loaderOverlay');
    if (loader) {
        loader.style.display = 'none'; // Loading sesh hole screen soriye dibe
    }
});

// --- 2. Tab Change Korar Logic ---
function showTab(tabName) {
    // Sob tab er content age hide kori
    document.querySelectorAll('.tab-content').forEach(div => div.classList.remove('active'));
    document.querySelectorAll('.tab-menu div').forEach(div => div.classList.remove('active'));

    // Jei tab e click kora hoise oita active kori
    const content = document.getElementById(tabName + 'Content');
    const tab = document.getElementById(tabName + 'Tab');
    
    if (content) content.classList.add('active');
    if (tab) tab.classList.add('active');
}

// --- 3. Password Dekha/Lukanor Logic ---
function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text"; // Password dekha jabe
        icon.textContent = "🙈"; 
    } else {
        input.type = "password"; // Abar lukabe
        icon.textContent = "👁️";
    }
}

// --- 4. REGISTER FUNCTION (API Call) ---
async function handleRegister() {
    // Input theke data nicchi
    const fullName = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    // Keu jodi khali rakhe, tke atkabo
    if (!fullName || !email || !password) {
        alert("সব তথ্য পূরণ করুন!");
        return;
    }

    try {
        // Backend e data pathacci
        const response = await fetch('http://127.0.0.1:8000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name: fullName, email: email, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("অ্যাকাউন্ট তৈরি সফল হয়েছে! এখন লগইন করুন।");
            showTab('login'); // Success hole login page e niye jabo
        } else {
            alert("সমস্যা: " + data.detail); // Error dekhabo
        }
    } catch (error) {
        console.error('Error:', error);
        alert("সার্ভারে সমস্যা হচ্ছে। backend choltese to?");
    }
}

// --- 5. LOGIN FUNCTION (API Call) ---
async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert("ইমেইল এবং পাসওয়ার্ড দিন!");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("স্বাগতম " + data.name + "!");
            // Login successful hole dashboard e niye jabe
            window.location.href = "dashboard/dashboard.html"; 
        } else {
            alert("লগইন ব্যর্থ: " + data.detail);
        }
    } catch (error) {
        console.error('Error:', error);
        alert("সার্ভারে সমস্যা হচ্ছে। backend choltese?");
    }
}

// --- 6. Event Listeners (Button & Tab Click Setup) ---
// Page load hoile ei kaj gula hobe
document.addEventListener('DOMContentLoaded', () => {
    
    // Login Button e click logic set kora
    const loginBtn = document.querySelector('.login-btn');
    if(loginBtn) loginBtn.onclick = handleLogin;

    // Register Button e click logic set kora
    const registerBtn = document.querySelector('.register-btn');
    if(registerBtn) registerBtn.onclick = handleRegister;

    // Upore tab e click korle jeno kaj kore
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const resetTab = document.getElementById('resetTab');

    if(loginTab) {
        loginTab.addEventListener('click', () => showTab('login'));
    }
    if(registerTab) {
        registerTab.addEventListener('click', () => showTab('register'));
    }
    if(resetTab) {
        resetTab.addEventListener('click', () => showTab('reset'));
    }
});