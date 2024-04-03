(() => {
    let usernameField = document.getElementById("usernameField");
    let passwordField = document.getElementById("passwordField");
    let signUpButton = document.getElementById("signup");

    signUpButton.addEventListener("click", async (event) => {
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

        // HELP!!!
        fetch('/signup', request)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                // If it's not a redirect, handle the response as needed
                console.log('Signup successful!');
            }
        })
        .catch(error => console.error('Error:', error));

    })
})();