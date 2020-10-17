function doShare() {
    if (navigator.canShare) {
        navigator.share({
            "title": "Abhijeet Sharma | Profile ",
            "text": "Web & Software Engineer",
            "url": "https://iambas2001.github.io"
        });
    }
}

if (Notification.permission == 'granted') {
    var firstTime = localStorage.getItem("firsttime");
    if(firstTime != "no")
    navigator.serviceWorker.getRegistration().then((reg) => {
        var options = {
            body: 'Feel Free to Contact Me',
            icon: '/favicon.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            // actions: [
            //     { action: 'explore', title: 'Yes', icon: '/favicon.png'},
            //     { action: 'close', title: 'No', icon: '/favicon.png'}
            // ]
        };
        reg.showNotification('', options);
        localStorage.setItem("firsttime","no");
    });
}


if(!navigator.canShare) {
    document.getElementById("share-btn").style.display = "none";
}