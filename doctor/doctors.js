const API_URL = "https://farm-vet-project.vercel.app/doctors";

document.addEventListener('DOMContentLoaded', () => {
    fetchDoctors();
});

async function fetchDoctors() {
    // লোডার থাকলে ধরবো
    const loader = document.getElementById('loaderOverlay');
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderDoctors(data);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        // ডাটা আসা শেষ হলে লোডার গায়েব হবে
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
                    <button class="book-button" onclick="alert('ধন্যবাদ! আপনার বুকিং রিকোয়েস্ট নেওয়া হয়েছে। আমরা শীঘ্রই কল করবো।')">বুক করুন</button>
                </div>
            </div>
        `;
    });
}