document.addEventListener('DOMContentLoaded', () => {
    const url = new URL(window.location.href);
    console.log(url.pathname)
    if (url.pathname.includes('wp-login.php')) {
        localStorage.removeItem('authData');
    }
    if (typeof MyAuthData !== 'undefined' && MyAuthData.authData) {
        localStorage.setItem('authData', JSON.stringify(MyAuthData.authData));

        console.log("Auth data loaded from PHP and stored in localStorage:", MyAuthData.authData);
    } else {
        console.log("No auth data found from PHP.");
    }
});
