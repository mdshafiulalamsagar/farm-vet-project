// তোমার Vercel API লিংক
const API_URL = "https://farm-vet-project.vercel.app/doctors";

// ১. পেজ লোড হলে এই ফাংশন কল হবে
document.addEventListener('DOMContentLoaded', () => {
    fetchDoctors();
    
    // সার্চ বারের লজিক
    const searchInput = document.getElementById('doctorSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterDoctors(e.target.value);
        });
    }
});

let allDoctors = []; // সব ডাক্তার এখানে জমা থাকবে

// ২. ডাটাবেস থেকে ডাক্তার আনার ফাংশন
async function fetchDoctors() {
    const loader = document.getElementById('loaderOverlay');
    
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        allDoctors = data; // ডাটা সেভ করলাম
        renderDoctors(allDoctors); // স্ক্রিনে দেখালাম

    } catch (error) {
        console.error("Error fetching doctors:", error);
        const container = document.getElementById('doctorList');
        if(container) {
            container.innerHTML = `<p style="text-align:center; color:red; font-family:'Baloo Da 2';">সার্ভার থেকে ডাটা লোড করা যাচ্ছে না। দয়া করে ইন্টারনেট চেক করুন।</p>`;
        }
    } finally {
        // লোডিং সরালাম
        if(loader) loader.style.display = 'none';
    }
}

// ৩. স্ক্রিনে ডাক্তার দেখানোর ফাংশন (ডিজাইন জেনারেটর)
function renderDoctors(doctors) {
    const container = document.getElementById('doctorList');
    if (!container) return;
    
    container.innerHTML = ''; // আগের সব মুছে ফ্রেশ করে নিলাম

    if (doctors.length === 0) {
        container.innerHTML = `<p style="text-align:center; font-family:'Baloo Da 2';">কোনো ডাক্তার পাওয়া যায়নি।</p>`;
        return;
    }

    doctors.forEach(doc => {
        // এই সেইম HTML স্ট্রাকচার তুমি আগে হাতে লিখেছিলে
        // এখন আমরা ডাটাবেস থেকে ভ্যালু বসাচ্ছি
        const doctorCard = `
            <div class="doctor-item">
                <div class="doctor-info">
                    <p class="doctor-name">${doc.name}</p>
                    <p class="doctor-specialty">${doc.speciality}</p>
                    ${doc.degree ? `<p style="font-size: 13px; color: #666; margin-top: 2px;">${doc.degree}</p>` : ''}
                </div>
                <div class="appointment-details">
                    <p class="fee">৳ ${doc.fee}</p>
                    <button class="book-button" onclick="bookDoctor('${doc.name}', ${doc.fee})">বুক করুন</button>
                </div>
            </div>
        `;
        container.innerHTML += doctorCard;
    });
}

// ৪. সার্চ ফিল্টার ফাংশন
function filterDoctors(searchTerm) {
    const term = searchTerm.toLowerCase();
    const filtered = allDoctors.filter(doc => 
        doc.name.toLowerCase().includes(term) || 
        doc.speciality.toLowerCase().includes(term)
    );
    renderDoctors(filtered);
}

// ৫. বুকিং ফাংশন (আপাতত অ্যালার্ট)
function bookDoctor(name, fee) {
    alert(`আপনি ${name}-কে সিলেক্ট করেছেন। ফি: ${fee} টাকা।\n(বুকিং সিস্টেম শীঘ্রই যুক্ত হবে!)`);
}