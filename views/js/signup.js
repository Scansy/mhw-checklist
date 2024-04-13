(() => {
    let usernameField = document.getElementById("usernameField");
    let passwordField = document.getElementById("passwordField");
    let signUpButton = document.getElementById("signup");

    signUpButton.addEventListener("click", async (event) => {
        event.preventDefault();

        let username_ = usernameField.value;
        let password_ = passwordField.value;
        console.log(username_, password_);

        if (!passwordVerification(password_)) {
            displayError();
            return;
        }

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
        fetch('/signup', request)
        .then(response => {
            if (response.status === 300 || response.redirected) {
                window.location.href = "/signin.html";
            } else {
                // if it's not a redirect, handle the response as needed
                console.log('Signup successful!');
            }
        })
        .catch(error => console.error('Error:', error));

    })

    // password verification
    const passwordVerification = (password) => {
        return password.length >= 8 && password.length <= 20 && /(?=.*[A-Z]).{8,}/.test(password);
    }

    /**
     * displays errors regarding authentication
     */
    const displayError = () => {
        // reset alert
        let oldAlert = document.querySelector(".alert");
        if (oldAlert)
            oldAlert.remove();

        // declaration
        let form = document.querySelector("form");
        let div = document.querySelector("#signupDiv");

        // create alert
        let alert = document.createElement("div");
        alert.classList.add("alert", "alert-light");
        alert.innerHTML = "Password must be 8-20 characters long with at least one uppercase letter";

        form.insertBefore(alert, div);
    };

})();