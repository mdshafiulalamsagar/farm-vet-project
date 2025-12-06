// Vercel API Link
const API_URL = "https://farm-vet-project.vercel.app/medicines";

document.addEventListener('DOMContentLoaded', () => {
    fetchMedicines();

    // সার্চ বার লজিক
    const searchInput = document.getElementById('medicineSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterMedicines(e.target.value);
        });
    }
});

let allMedicines = []; // সব ঔষধ জমা থাকবে

// ১. ডাটাবেস থেকে ঔষধ আনার ফাংশন
async function fetchMedicines() {
    const loader = document.getElementById('loaderOverlay');
    
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Network Error");
        
        const data = await response.json();
        allMedicines = data;
        renderMedicines(allMedicines);

    } catch (error) {
        console.error("Error fetching medicines:", error);
        document.getElementById('productList').innerHTML = `<p style="text-align:center; color:red; width:100%;">ডাটা লোড হচ্ছে না। ইন্টারনেট চেক করুন।</p>`;
    } finally {
        if(loader) loader.style.display = 'none';
    }
}

// ২. স্ক্রিনে ঔষধ দেখানোর ফাংশন (ডিজাইন জেনারেটর)
function renderMedicines(medicines) {
    const container = document.getElementById('productList');
    container.innerHTML = '';

    if (medicines.length === 0) {
        container.innerHTML = `<p style="text-align:center; width:100%;">কোনো ঔষধ পাওয়া যায়নি।</p>`;
        return;
    }

    medicines.forEach(med => {
        // হুবহু তোমার আগের HTML স্ট্রাকচার
        const productHTML = `
            <div class="product-item">
                <div class="product-details">
                    <div class="product-name">${med.name}</div>
                    <div class="manufacturer" style="color: gray; font-size: 14px;">ডোজ: ${med.dose}</div>
                </div>
                <div class="product-action">
                    <div class="price">৳ ${med.price}</div>
                    <button class="order-button" onclick="addToCart('${med.name}', ${med.price})">অর্ডার করুন</button>
                </div>
            </div>
        `;
        container.innerHTML += productHTML;
    });
}

// ৩. সার্চ ফিল্টার
function filterMedicines(searchTerm) {
    const term = searchTerm.toLowerCase();
    const filtered = allMedicines.filter(med => 
        med.name.toLowerCase().includes(term)
    );
    renderMedicines(filtered);
}

// ৪. কার্ট লজিক (আপাতত অ্যালার্ট)
function addToCart(name, price) {
    alert(`'${name}' কার্টে যুক্ত করা হয়েছে। দাম: ${price} টাকা।`);
    // এখানে ভবিষ্যতে কার্ট লজিক বসবে
}