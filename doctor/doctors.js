const API_URL = "https://farm-vet-project.vercel.app"; // মেইন লিংক

document.addEventListener('DOMContentLoaded', () => {
    fetchDoctors();
});

async function fetchDoctors() {
    const loader = document.getElementById('loaderOverlay');
    try {
        const response = await fetch(`${API_URL}/doctors`);
        const data = await response.json();
        renderDoctors(data);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        if(loader) loader.style.display = 'none';
    }
}

function renderDoctors(doctors) {
    const container = document.getElementById('doctorList');
    if(!container) return;
    container.innerHTML = '';

    doctors.forEach(doc => {
        container.innerHTML += `
            <div class="doctor-item">
                <div class="doctor-info">
                    <p class="doctor-name">${doc.name}</p>
                    <p class="doctor-specialty">${doc.speciality}</p>
                    <p style="font-size:13px; color:gray;">${doc.degree}</p>
                </div>
                <div class="appointment-details">
                    <p class="fee">৳ ${doc.fee}</p>
                    <button class="book-button" onclick="placeOrder('${doc.name}', ${doc.fee}, 'doctor')">বুক করুন</button>
                </div>
            </div>
        `;
    });
}

// --- অর্ডার ফাংশন ---
async function placeOrder(itemName, price, type) {
    const userName = localStorage.getItem('user_name');
    
    // ১. লগইন করা না থাকলে আটকাবে
    if (!userName) {
        alert("বুকিং করার জন্য দয়া করে আগে লগইন করুন!");
        window.location.href = "../index.html"; 
        return;
    }

    // ২. কনফার্মেশন চাইবে
    if(!confirm(`আপনি কি '${itemName}' বুক করতে চান? ফি: ${price} টাকা।`)) return;

    // ৩. সার্ভারে রিকোয়েস্ট পাঠাবে
    try {
        const response = await fetch(`${API_URL}/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_name: userName,
                item_name: itemName,
                type: type,
                price: price
            })
        });

        if (response.ok) {
            alert("✅ বুকিং সফল হয়েছে! আমাদের প্রতিনিধি শীঘ্রই কল করবেন।");
        } else {
            alert("❌ সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        }
    } catch (error) {
        alert("ইন্টারনেট কানেকশন চেক করুন।");
    }
}