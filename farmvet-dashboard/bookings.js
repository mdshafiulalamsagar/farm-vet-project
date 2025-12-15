const API_URL = "https://farm-vet-project.vercel.app";

document.addEventListener('DOMContentLoaded', () => {
    fetchMyBookings();
});

async function fetchMyBookings() {
    const userName = localStorage.getItem('user_name');
    const container = document.getElementById('bookingList');

    if (!userName) {
        container.innerHTML = `<p style="text-align:center; color:red;">দয়া করে আগে লগইন করুন।</p>`;
        return;
    }

    try {
        // ১. সব অর্ডার আনছি
        const response = await fetch(`${API_URL}/my-orders?user_name=${encodeURIComponent(userName)}`);
        const orders = await response.json();

        // ২. ফিল্টার করছি (শুধু type='doctor' গুলো নিবো)
        const doctorBookings = orders.filter(order => order.type === 'doctor');

        // ৩. রেন্ডার করছি
        renderBookings(doctorBookings);

    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = `<p style="text-align:center; color:red;">সার্ভার থেকে ডাটা পাওয়া যাচ্ছে না।</p>`;
    }
}

function renderBookings(bookings) {
    const container = document.getElementById('bookingList');
    container.innerHTML = ''; 

    if (bookings.length === 0) {
        container.innerHTML = `<p style="text-align:center; margin-top:50px;">আপনি এখনো কোনো ডাক্তার বুক করেননি।</p>`;
        return;
    }

    bookings.forEach(booking => {
        // তারিখ সুন্দর করা
        const dateObj = new Date(booking.order_date);
        const dateStr = dateObj.toLocaleDateString('bn-BD');
        const timeStr = dateObj.toLocaleTimeString('bn-BD');

        const statusClass = booking.status === 'Pending' ? 'pending' : 'success';
        const statusText = booking.status === 'Pending' ? 'অপেক্ষমান' : 'কনফার্ম';

        const html = `
            <div class="booking-card">
                <span class="status ${statusClass}">${statusText}</span>
                <div class="doctor-name">${booking.item_name}</div>
                <div class="speciality">ফি: ৳ ${booking.price}</div>
                <div class="time-box">
                    <i class="far fa-clock"></i>
                    বুকিং তারিখ: ${dateStr} (${timeStr})
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}