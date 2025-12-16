const API_URL = "https://farm-vet-project.vercel.app";

document.addEventListener('DOMContentLoaded', () => {
    fetchAllOrders();
});

async function fetchAllOrders() {
    const userId = localStorage.getItem('user_id');
    const tableBody = document.getElementById('ordersTableBody');

    if (!userId) {
        alert("দয়া করে লগইন করুন।");
        window.location.href = "../index.html";
        return;
    }

    try {
        // ১. সার্ভার থেকে সব অর্ডার আনছি
        const response = await fetch(`${API_URL}/admin/orders?user_id=${userId}`);
        
        if (response.status === 403) {
            alert("⚠️ অ্যাক্সেস নেই! শুধুমাত্র অ্যাডমিন এই পেজ দেখতে পারে।");
            window.location.href = "../dashboard/dashboard.html";
            return;
        }

        const orders = await response.json();
        renderTable(orders);

    } catch (error) {
        console.error("Admin Error:", error);
        tableBody.innerHTML = `<tr><td colspan="7" style="color:red; text-align:center;">ডাটা লোড করতে সমস্যা হচ্ছে।</td></tr>`;
    }
}

function renderTable(orders) {
    const tableBody = document.getElementById('ordersTableBody');
    tableBody.innerHTML = '';

    if (orders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">কোনো অর্ডার নেই।</td></tr>`;
        return;
    }

    orders.forEach(order => {
        const dateStr = new Date(order.order_date).toLocaleDateString('bn-BD');
        
        const row = `
            <tr>
                <td>#${order.id}</td>
                <td>
                    <b>${order.user_name}</b><br>
                    <small style="color:gray;">${dateStr}</small>
                </td>
                <td>
                    ${order.item_name} <br>
                    <span style="font-size:12px; background:#eee; padding:2px 5px; border-radius:3px;">${order.type}</span>
                </td>
                <td>
                    Phone: ${order.phone || 'N/A'} <br>
                    Addr: ${order.address || 'N/A'}
                </td>
                <td><b>৳ ${order.price}</b></td>
                <td>
                    <span class="status-${order.status}">${order.status}</span>
                </td>
                <td>
                    <div style="display:flex; align-items:center;">
                        <select class="status-select" id="status-${order.id}">
                            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                        <button class="update-btn" onclick="updateStatus(${order.id})"><i class="fas fa-save"></i></button>
                    </div>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// --- স্ট্যাটাস আপডেট করার ফাংশন ---
async function updateStatus(orderId) {
    const newStatus = document.getElementById(`status-${orderId}`).value;
    const adminId = localStorage.getItem('user_id');

    if(!confirm(`আপনি কি নিশ্চিত এই অর্ডারের স্ট্যাটাস '${newStatus}' করতে চান?`)) return;

    try {
        const response = await fetch(`${API_URL}/admin/update-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                order_id: orderId,
                new_status: newStatus,
                admin_id: parseInt(adminId)
            })
        });

        if (response.ok) {
            alert("✅ স্ট্যাটাস আপডেট হয়েছে!");
            fetchAllOrders(); // টেবিল রিফ্রেশ
        } else {
            alert("❌ আপডেট ব্যর্থ হয়েছে।");
        }
    } catch (error) {
        console.error(error);
        alert("সার্ভার এরর।");
    }
}