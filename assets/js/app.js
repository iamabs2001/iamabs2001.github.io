function doShare() {
    if (navigator.canShare) {
        navigator.share({
            "title": "Abhijeet Sharma | Profile ",
            "text": "Web & Software Engineer",
            "url": "https://iambas2001.github.io"
        });
    }
}

if(!navigator.canShare) {
    document.getElementById("share-btn").style.display = "none";
}