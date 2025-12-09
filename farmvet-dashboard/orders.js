const API_URL = "https://farm-vet-project.vercel.app";

document.addEventListener('DOMContentLoaded', () => {
    fetchMyOrders();
});

async function fetchMyOrders() {
    const userName = localStorage.getItem('user_name');
    const container = document.getElementById('orderList');

    // ১. লগইন করা না থাকলে সরাবো
    if (!userName) {
        container.innerHTML = `<p style="text-align:center; color:red;">দয়া করে আগে লগইন করুন।</p>`;
        return;
    }

    try {
        // ২. ইউজারের নাম দিয়ে ডাটাবেস থেকে অর্ডার আনছি
        // URL-এ নাম পাঠাচ্ছি: /my-orders?user_name=Sagar
        const response = await fetch(`${API_URL}/my-orders?user_name=${encodeURIComponent(userName)}`);
        const orders = await response.json();

        // ৩. অর্ডার লিস্ট রেন্ডার করা
        renderOrders(orders);

    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = `<p style="text-align:center; color:red;">সার্ভার থেকে ডাটা পাওয়া যাচ্ছে না।</p>`;
    }
}

function renderOrders(orders) {
    const container = document.getElementById('orderList');
    container.innerHTML = ''; // লোডিং লেখা সরালাম

    // যদি কোনো অর্ডার না থাকে
    if (orders.length === 0) {
        container.innerHTML = `<p style="text-align:center; margin-top:50px;">আপনি এখনো কোনো অর্ডার করেননি।</p>`;
        return;
    }

    // অর্ডার কার্ড তৈরি
    orders.forEach(order => {
        // তারিখ ফরম্যাট করা (একটু সুন্দর দেখানোর জন্য)
        const dateObj = new Date(order.order_date);
        const dateStr = dateObj.toLocaleDateString('bn-BD'); 

        // স্ট্যাটাস কালার ঠিক করা
        const statusClass = order.status === 'Pending' ? 'pending' : 'success';
        const statusText = order.status === 'Pending' ? 'পেন্ডিং' : 'সম্পন্ন';

        const html = `
            <div class="order-card">
                <div class="order-info">
                    <h3>${order.item_name}</h3>
                    <p>টাইপ: ${order.type === 'medicine' ? 'ঔষধ' : 'ডাক্তার'}</p>
                    <p>তারিখ: ${dateStr}</p>
                </div>
                <div class="order-right">
                    <span class="status ${statusClass}">${statusText}</span>
                    <div class="price">৳ ${order.price}</div>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}