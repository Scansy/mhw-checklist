(() => {
    let usernameField = document.getElementById("usernameField");
    let passwordField = document.getElementById("passwordField");
    let signInButton = document.getElementById("signin");

    /**
     * sign in button function
     */
    signInButton.addEventListener("click", async (event) => {
        event.preventDefault();

        let username_ = usernameField.value;
        let password_ = passwordField.value;
        console.log(username_, password_);

        const data = {
            username: username_,
            password: password_
        };

        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        // call signup endpoint
        fetch('/signin', request)
        .then(response => {
            if (response.status === 200) {
                console.log("code 200")
                displayError();
            } else if (response.status === 300) {
                window.location.href = "/index.html";
            } else {
                // if it's not a redirect, handle the response as needed
                console.log('Signup successful!');
            }
        })
        .catch(error => console.error('Error:', error));

    })

    /**
     * displays errors regarding authentication
     */
    const displayError = () => {
        let form = document.querySelector("form");
        let div = document.querySelector("#signinDiv");

        // create alert
        let alert = document.createElement("div");
        alert.classList.add("alert", "alert-light");
        alert.innerHTML = "Oops! You entered the wrong username/password.";

        form.insertBefore(alert, div);
    };
})();