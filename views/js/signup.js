(() => {
    // declarations
    let submitBtn = document.getElementById("signup");
    let usernameField = document.getElementById("usernameField");
    let passwordField = document.getElementById("passwordField");
    
    // When submit is clicked
    submitBtn.addEventListener("click", async () => {
        let username = usernameField.value;
        let password = passwordField.value;
        await fetch(`/signup/username=${username}/password=${password}`);
    })
})();

