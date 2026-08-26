const createForm = document.querySelector("#create-account-form");

createForm.addEventListener("submit", async (e) => {
    // don't allow form to submit
    e.preventDefault();

    // get username and password
    const username = document.querySelector("#username").value;
    const fullName = document.querySelector("#full_name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const rePassword = document.querySelector("#re_password").value;

    const res = await fetch("/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            "username": username, 
            "full_name": fullName,
            "email": email, 
            "password": password,
            "re_password": rePassword })
    });

    const data = await res.json();

    // if data returns successful mesage
    if (data.status == "success") {
        // set session storage
        sessionStorage.setItem("username", data.username);
        //sessionStorage.setItem("name", data.name);
    
        // redirect to a new page now
        window.location.href = "/";
    // if data does not return a successful message
    } else {
        console.log('status: ', data.status);
        window.location.href = "/";
    }
})