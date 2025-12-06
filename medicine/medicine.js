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
                    <button class="order-button" onclick="alert('পণ্যটি কার্টে যুক্ত হয়েছে! (Checkout coming soon)')">অর্ডার করুন</button>
                </div>
            </div>
        `;
    });
}