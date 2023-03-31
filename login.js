document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.querySelector('#loginForm');
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting via the browser
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    fetch('https://allyricsbackend-production.up.railway.app/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Incorrect email or password.');
        }
      })
      .then(data => {
        console.log(data);
        if (data.role === 'admin') {
          window.location.href = 'admin.html'; // Redirect to admin dashboard for admin users
        } else {
          Swal.fire({
            title: 'Success!',
            text: 'Login successful!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = 'index.html'; // Redirect to home page for non-admin users
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  });
});
