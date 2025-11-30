// --- 1. Loading Screen Soranor Code ---
window.addEventListener('load', function() {
    const loader = document.getElementById('loaderOverlay');
    if (loader) {
        // Page load hoye gele loading screen ta soriye dibo
        loader.style.display = 'none';
    }
});

// --- 2. Tab Change Korar Logic ---
function showTab(tabName) {
    // Sob tab er content age hide kore felsi
    document.querySelectorAll('.tab-content').forEach(div => div.classList.remove('active'));
    document.querySelectorAll('.tab-menu div').forEach(div => div.classList.remove('active'));

    // Jei tab e click kora hoise oita active kortesi
    const content = document.getElementById(tabName + 'Content');
    const tab = document.getElementById(tabName + 'Tab');
    
    if (content) content.classList.add('active');
    if (tab) tab.classList.add('active');
}

// --- 3. Password Dekha/Lukanor Logic ---
function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text"; // Ekhon password dekha jabe
        icon.textContent = "🙈"; 
    } else {
        input.type = "password"; // Abar lukiye fellam
        icon.textContent = "👁️";
    }
}

// --- 4. REGISTER FUNCTION (LIVE SERVER) ---
async function handleRegister() {
    // Input theke value gula nicchi
    const fullName = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    // Keu jodi faka rakhe taile atkabo
    if (!fullName || !email || !password) {
        alert("সব তথ্য পূরণ করুন!");
        return;
    }

    // Button er text change kore "Loading" dekhacci
    const registerBtn = document.querySelector('.register-btn');
    const originalText = registerBtn.innerText;
    registerBtn.innerText = "অপেক্ষা করুন...";
    registerBtn.disabled = true;

    try {
        // Vercel er live link e data pathacci
        const response = await fetch('https://farm-vet-project.vercel.app/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name: fullName, email: email, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("অ্যাকাউন্ট তৈরি সফল হয়েছে! এখন লগইন করুন।");
            showTab('login'); // Success hole login page e pathay dibo
        } else {
            alert("সমস্যা: " + data.detail); // Kono error hole user k bolbo
        }
    } catch (error) {
        console.error('Error:', error);
        alert("সার্ভারে সমস্যা হচ্ছে। ইন্টারনেট কানেকশন ঠিক আছে তো?");
    } finally {
        // Kaj shesh, button abar ager moto kore dilam
        registerBtn.innerText = originalText;
        registerBtn.disabled = false;
    }
}

// --- 5. LOGIN FUNCTION (LIVE SERVER) ---
async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert("ইমেইল এবং পাসওয়ার্ড দিন!");
        return;
    }

    // Button disable kore dicchi jate 2 bar click na pore
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.innerText;
    loginBtn.innerText = "যাচাই করা হচ্ছে...";
    loginBtn.disabled = true;

    try {
        // Vercel er live link e login request pathacci
        const response = await fetch('https://farm-vet-project.vercel.app/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            // LocalStorage e user er nam rekhe dilam (Future e lagbe)
            localStorage.setItem('user_name', data.name);
            
            alert("স্বাগতম " + data.name + "!");
            // Login success! Dashboard e pathay dicchi
            window.location.href = "dashboard/dashboard.html"; 
        } else {
            alert("লগইন ব্যর্থ: " + data.detail);
        }
    } catch (error) {
        console.error('Error:', error);
        alert("সার্ভারে সমস্যা হচ্ছে। ইন্টারনেট কানেকশন ঠিক আছে তো?");
    } finally {
        // Button thik kore dilam
        loginBtn.innerText = originalText;
        loginBtn.disabled = false;
    }
}

// --- 6. Sob Button r Tab er kaj ekhane set kora ---
document.addEventListener('DOMContentLoaded', () => {
    // Login button click korle ki hobe
    const loginBtn = document.querySelector('.login-btn');
    if(loginBtn) loginBtn.onclick = handleLogin;

    // Register button click korle ki hobe
    const registerBtn = document.querySelector('.register-btn');
    if(registerBtn) registerBtn.onclick = handleRegister;

    // Tab e click korle page change hobe
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const resetTab = document.getElementById('resetTab');

    if(loginTab) loginTab.addEventListener('click', () => showTab('login'));
    if(registerTab) registerTab.addEventListener('click', () => showTab('register'));
    if(resetTab) resetTab.addEventListener('click', () => showTab('reset'));
});