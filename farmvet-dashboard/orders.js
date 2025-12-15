const API_URL = "https://farm-vet-project.vercel.app";

document.addEventListener('DOMContentLoaded', () => {
    fetchMyOrders();
});

async function fetchMyOrders() {
    const userName = localStorage.getItem('user_name');
    const container = document.getElementById('orderList');

    if (!userName) {
        container.innerHTML = `<p style="text-align:center; color:red;">দয়া করে আগে লগইন করুন।</p>`;
        return;
    }

    // ১. URL থেকে ফিল্টার চেক করা (যেমন: ?filter=Pending)
    const urlParams = new URLSearchParams(window.location.search);
    const filterStatus = urlParams.get('filter');

    // টাইটেল আপডেট করা (অপশনাল, সুন্দর দেখানোর জন্য)
    if(filterStatus === 'Pending') document.querySelector('.title').innerText = "পেন্ডিং অর্ডার সমূহ";
    if(filterStatus === 'Completed') document.querySelector('.title').innerText = "সম্পন্ন অর্ডার সমূহ";

    try {
        const response = await fetch(`${API_URL}/my-orders?user_name=${encodeURIComponent(userName)}`);
        let orders = await response.json();

        // ২. যদি ফিল্টার থাকে, তবে সেই অনুযায়ী ডাটা ছাঁটাই করবো
        if (filterStatus) {
            orders = orders.filter(order => order.status === filterStatus);
        }

        renderOrders(orders);

    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = `<p style="text-align:center; color:red;">সার্ভার থেকে ডাটা পাওয়া যাচ্ছে না।</p>`;
    }
}

function renderOrders(orders) {
    const container = document.getElementById('orderList');
    container.innerHTML = ''; 

    if (orders.length === 0) {
        container.innerHTML = `<p style="text-align:center; margin-top:50px; color:#777;">এই তালিকায় কোনো অর্ডার নেই।</p>`;
        return;
    }

    orders.forEach(order => {
        const dateObj = new Date(order.order_date);
        const dateStr = dateObj.toLocaleDateString('bn-BD'); 

        // স্ট্যাটাস কালার সেটআপ
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