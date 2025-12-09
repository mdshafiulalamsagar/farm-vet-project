const API_URL = "https://farm-vet-project.vercel.app";

document.addEventListener('DOMContentLoaded', () => {
    fetchMedicines();
});

async function fetchMedicines() {
    const loader = document.getElementById('loaderOverlay');
    try {
        const response = await fetch(`${API_URL}/medicines`);
        const data = await response.json();
        renderMedicines(data);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        if(loader) loader.style.display = 'none';
    }
}

function renderMedicines(medicines) {
    const container = document.getElementById('productList');
    if(!container) return;
    container.innerHTML = '';

    medicines.forEach(med => {
        container.innerHTML += `
            <div class="product-item">
                <div class="product-details">
                    <div class="product-name">${med.name}</div>
                    <div class="manufacturer">ডোজ: ${med.dose}</div>
                </div>
                <div class="product-action">
                    <div class="price">৳ ${med.price}</div>
                    <button class="order-button" onclick="placeOrder('${med.name}', ${med.price}, 'medicine')">অর্ডার করুন</button>
                </div>
            </div>
        `;
    });
}

// --- অর্ডার ফাংশন ---
async function placeOrder(itemName, price, type) {
    const userName = localStorage.getItem('user_name');
    
    if (!userName) {
        alert("অর্ডার করার জন্য দয়া করে আগে লগইন করুন!");
        window.location.href = "../index.html";
        return;
    }

    if(!confirm(`আপনি কি '${itemName}' অর্ডার করতে চান? দাম: ${price} টাকা।`)) return;

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
            alert("✅ অর্ডার সফল হয়েছে! ধন্যবাদ।");
        } else {
            alert("❌ সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        }
    } catch (error) {
        alert("ইন্টারনেট কানেকশন চেক করুন।");
    }
}