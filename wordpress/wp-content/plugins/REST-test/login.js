document.addEventListener('user_registration_login_success', function (event) {
    // Optionally inspect event.detail for data
    // If roles are NOT passed in event.detail, we fetch them
    alert("called")
    fetch('/wp-json/wp/v2/users/me', {
        credentials: 'include'
    })
    .then(res => res.json())
    .then(user => {
        if (user.roles.includes('manager')) {
            window.location.href = '/managers/';
        } else if (user.roles.includes('employee')) {
            window.location.href = '/employee/';
        } else {
            window.location.href = '/';
        }
    })
    .catch(err => {
        console.error('Error getting current user info:', err);
        window.location.href = '/'; // fallback
    });
});