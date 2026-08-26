const loginForm = document.querySelector("#login-form");


loginForm.addEventListener("submit", async (e) => {
    // don't allow form to submit
    e.preventDefault();

    // get username and password
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    const res = await fetch("/verify/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    // if data returns successful mesage
    if (data.status == "success") {
        // set session storage
        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("name", data.name);
    
        // redirect to a new page now
        window.location.href = "/";

    // if data is not a successful message
    } else {
        console.log('status: ', data.status);
        window.location.href = "/";
    }
})

