const API_URL = "https://farm-vet-project.vercel.app/medicines";

document.addEventListener('DOMContentLoaded', () => {
    fetchMedicines();
});

async function fetchMedicines() {
    const loader = document.getElementById('loaderOverlay');
    try {
        const response = await fetch(API_URL);
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
                    <button class="order-button" onclick="addToCart('${med.name}', ${med.price}, 'medicine')">অর্ডার করুন</button>
                </div>
            </div>
        `;
    });
}

// --- কার্টে যোগ করার ফাংশন ---
function addToCart(name, price, type) {
    // ১. আগের কার্ট চেক করছি
    let cart = JSON.parse(localStorage.getItem('my_cart')) || [];

    // ২. নতুন আইটেম বানাচ্ছি
    const newItem = {
        name: name,
        price: price,
        type: type,
        quantity: 1
    };

    // ৩. কার্টে ঢুকাচ্ছি
    cart.push(newItem);
    
    // ৪. সেভ করছি
    localStorage.setItem('my_cart', JSON.stringify(cart));
    
    // ৫. ইউজারকে জানাচ্ছি
    if(confirm(`${name} কার্টে যোগ হয়েছে! আপনি কি এখনই কার্টে যেতে চান?`)) {
        window.location.href = "../cart/cart.html"; // কার্ট পেজে নিয়ে যাবে
    }
}