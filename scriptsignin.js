// Function to toggle between Sign In and Register forms
function showRegister() {
    document.getElementById('signInBox').style.display = 'none';
    document.getElementById('registerBox').style.display = 'block';
}

function showSignIn() {
    document.getElementById('registerBox').style.display = 'none';
    document.getElementById('signInBox').style.display = 'block';
}

// Sign In Form Validation
document.getElementById('signInForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    if (email && password) {
        alert('Sign In Successful!');
    } else {
        alert('Please fill in all fields.');
    }
});

// Register Form Validation
document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (name && email && password && confirmPassword) {
        if (password === confirmPassword) {
            alert('Registration Successful!');
        } else {
            alert('Passwords do not match.');
        }
    } else {
        alert('Please fill in all fields.');
    }
});
