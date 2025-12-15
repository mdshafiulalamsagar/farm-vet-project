const API_URL = "https://farm-vet-project.vercel.app/doctors";

document.addEventListener('DOMContentLoaded', () => {
    fetchDoctors();
});

async function fetchDoctors() {
    const loader = document.getElementById('loaderOverlay');
    try {
        const response = await fetch(API_URL);
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
                    <button class="book-button" onclick="addToCart('${doc.name}', ${doc.fee}, 'doctor')">বুক করুন</button>
                </div>
            </div>
        `;
    });
}

// --- কার্টে যোগ করার ফাংশন ---
function addToCart(name, price, type) {
    let cart = JSON.parse(localStorage.getItem('my_cart')) || [];

    const newItem = {
        name: name,
        price: price,
        type: type, // 'doctor' টাইপ হিসেবে সেভ হবে
        quantity: 1
    };

    cart.push(newItem);
    localStorage.setItem('my_cart', JSON.stringify(cart));
    
    if(confirm(`${name}-এর অ্যাপয়েন্টমেন্ট কার্টে যোগ হয়েছে! আপনি কি কনফার্ম করতে কার্টে যেতে চান?`)) {
        window.location.href = "../cart/cart.html";
    }
}