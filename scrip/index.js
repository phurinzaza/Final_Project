const mockUser = {
    username: "phurin",  
    password: "12345",
    email: "Phurin@gmail.com"
};




 

function createJWT(payload, secret, expireSec = 20) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = btoa(JSON.stringify({
        ...payload,
        exp: Date.now() + expireSec * 1000,  
    }));
    const signature = btoa(`${header}.${body}.${secret}`);
    return `${header}.${body}.${signature}`;  
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === mockUser.username && password === mockUser.password) {  
        const token = createJWT({ username: mockUser.username }, "mysecret", 20);

        localStorage.setItem("token", token);
        localStorage.setItem("username", username);  
        localStorage.setItem("password", password);

        Swal.fire({
            text: "กลับไปหน้าhomepage!",
            title: "ล็อกอินถูกต้อง!",
            icon: "success",
            confirmButtonText: "ตกลง",
          }).then(() => {
            window.location.href = "home.html";
          });
         
    } else {
        Swal.fire({
            text: "กรุณาล็อกอินใหม่!",
            title: "ล็อกอินไม่สำเร็จ!",
            icon: "error",
            confirmButtonText: "ตกลง",
          })
    }
});