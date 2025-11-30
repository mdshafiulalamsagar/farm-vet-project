document.getElementById('profileUpdateForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // ডেটা সংগ্রহের প্রয়োজন নেই, শুধুমাত্র নিশ্চিত করতে হবে যে বর্তমান পাসওয়ার্ড পূরণ করা হয়েছে
    const currentPassword = document.getElementById('current-password').value;

    if (currentPassword.trim() === "") {
        alert("প্রোফাইল আপডেট করার জন্য বর্তমান পাসওয়ার্ড প্রয়োজন।");
        return;
    }

    // পাসওয়ার্ড ফিল্ডগুলো খালি করে দেওয়া হলো
    document.getElementById('new-password').value = '';
    document.getElementById('current-password').value = '';

    // আপডেট সফল হওয়ার পর অ্যালার্ট দেখাবে
    alert("আপনার প্রোফাইলটি সফলভাবে আপডেট করা হয়েছে।");

    // ওকে (OK) বাটনে ক্লিক করার পর ব্যবহারকারীকে হোমপেজে (dashboard.html) নিয়ে যাবে
    window.location.href = "../dashboard/dashboard.html";
});

document.getElementById('backToHomeButton').addEventListener('click', function () {
    // হোমপেজে ফিরে যেতে
    window.location.href = "../dashboard/dashboard.html";
});