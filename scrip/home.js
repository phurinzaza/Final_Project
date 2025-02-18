const sidebar = document.getElementById('sidebar');
const openSidebarButton = document.getElementById('open-sidebar');

openSidebarButton.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('-translate-x-full');
});

// Close the sidebar when clicking outside of it
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !openSidebarButton.contains(e.target)) {
        sidebar.classList.add('-translate-x-full');
    }
});

const username = localStorage.getItem("username");
const email = localStorage.getItem("email");
console.log(`Name: ${username}, Email:${email}`);

function verifyJWT(token, secret) {
    const [header, body, signature] = token.split(".");
    const validSignature = btoa(`${header}.${body}.${secret}`);
    if (signature !== validSignature) {
        return { valid: false, reason: "Invalid signature" };
    }
    const payload = JSON.parse(atob(body));
    if (Date.now() > payload.exp) {
        return { valid: false, reason: "Token expired" };
    }
    return { valid: true, payload };
}

document.getElementById("checkJwtBtn").addEventListener("click", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        Swal.fire({
            text: "ไม่พบToken , กรุณาเข้าสู่ระบบอีกครั้ง",
            icon: "warning",
            confirmButtonText: "ตกลง",
        }).then(() => {
            window.location.href = "index.html";
        });
        return;
    }
    const result = verifyJWT(token, "mysecret");
    if (!result.valid) {
        let message = "Invalid token. Please login again.";
        if (result.reason === "Token expired") {
            message = "Token expired. Please login again.";
            localStorage.removeItem("token");
        }
        Swal.fire({
            text: message,
            icon: "error",
            confirmButtonText: "ตกลง",
        }).then(() => {
            window.location.href = "index.html";
        });
    } else {
        Swal.fire({
            text: "Token ถูกต้อง!",
            title: "ยินดีต้อนรับกลับมา! " + result.payload.username,
            icon: "success",
            confirmButtonText: "ตกลง",
        });
    }
});

document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("token");
    Swal.fire({
        text: "ออกจากระบบสำเร็จ!",
        icon: "success",
        confirmButtonText: "ตกลง",
    }).then(() => {
        window.location.href = "index.html";
    });
});
