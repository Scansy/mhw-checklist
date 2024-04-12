(() => {
    let signInBtn = document.getElementById('signin');

    const changeToLogOut = () => {
        signInBtn.innerHTML = 'Log Out';
        signInBtn.href = '/logout';
    }

    window.addEventListener('load', async () => {
        let response = await fetch('/isSignedIn');
        let data = await response.json();

        if (data) {
            changeToLogOut();
        }
    });
})();