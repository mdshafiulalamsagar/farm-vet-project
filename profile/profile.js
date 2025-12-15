const API_URL = "https://farm-vet-project.vercel.app";

// ১. পেজ লোড হলে ডাটাবেস থেকে তথ্য আনবে
document.addEventListener('DOMContentLoaded', async function() {
    const userId = localStorage.getItem('user_id');

    if (!userId) {
        alert("দয়া করে লগইন করুন।");
        window.location.href = "../index.html";
        return;
    }

    try {
        // সার্ভার থেকে ডাটা আনা হচ্ছে
        const response = await fetch(`${API_URL}/get-user-profile?user_id=${userId}`);
        const data = await response.json();

        if (response.ok) {
            // বক্সে ডাটা বসানো হচ্ছে
            document.getElementById('name').value = data.full_name || "";
            document.getElementById('phone').value = data.phone || ""; // আগে না থাকলে খালি থাকবে
            document.getElementById('address').value = data.address || "";
            document.getElementById('email').value = data.email || "";
            
            // নামটা লোকাল স্টোরেজেও আপডেট করে রাখি (ড্যাশবোর্ডের জন্য)
            localStorage.setItem('user_name', data.full_name);
        } else {
            console.error("Profile fetch error");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

// ২. আপডেট বাটনে চাপলে ডাটাবেসে সেভ হবে
document.getElementById('profileUpdateForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const userId = localStorage.getItem('user_id');
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const newPassword = document.getElementById('new-password').value;

    const updateButton = document.querySelector('.update-button');
    updateButton.innerText = "আপডেট হচ্ছে...";
    updateButton.disabled = true;

    try {
        const response = await fetch(`${API_URL}/update-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: parseInt(userId),
                full_name: name,
                phone: phone,
                address: address,
                new_password: newPassword // পাসওয়ার্ড না দিলে সমস্যা নেই
            })
        });

        if (response.ok) {
            alert("✅ প্রোফাইল আপডেট সফল হয়েছে!");
            localStorage.setItem('user_name', name); // আপডেট নাম সেভ
            
            // পাসওয়ার্ড চেঞ্জ করলে আবার লগইন করতে বলা ভালো
            if(newPassword && newPassword.trim() !== "") {
                alert("যেহেতু পাসওয়ার্ড পরিবর্তন করেছেন, দয়া করে আবার লগইন করুন।");
                localStorage.clear();
                window.location.href = "../index.html";
            } else {
                window.location.href = "../farmvet-dashboard/farmvet-dashboard.html";
            }
        } else {
            alert("❌ আপডেট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("ইন্টারনেট কানেকশন চেক করুন।");
    } finally {
        updateButton.innerText = "তথ্য আপডেট করুন";
        updateButton.disabled = false;
    }
});

// ব্যাক বাটন
document.getElementById('backToHomeButton').addEventListener('click', function () {
    window.location.href = "../farmvet-dashboard/farmvet-dashboard.html";
});