(() => {
    // declarations
    const modalView = document.getElementById('noticeDialog');

    window.addEventListener('load', async () => {
        try {
            const response = await fetch('/isSignedIn');
            const data = await response.json();
            // console.log(data);
    
            if (!data) {
                modalView.style.display = '';
            } 
        } catch (error) {
            console.error('Error:', error);
        }
    });
})()
