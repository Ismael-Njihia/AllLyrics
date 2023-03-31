document.addEventListener('DOMContentLoaded', function() {
  const addUserForm = document.querySelector('#add-user-form');
  const editUserBtn = document.querySelector('#edit-user-btn');

  addUserForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting via the browser
    const formData = new FormData(addUserForm); // Serialize form data
    fetch('https://allyricsbackend-production.up.railway.app/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    })
    .then(response => {
      if (response.ok) {
        $('#addUserModal').modal('hide'); // Hide the modal after successful submission
        location.reload(); // Reload the page to see the changes
      } else {
        throw new Error('Error in response.');
      }
    })
    .catch(error => console.error(error));
  });
  editUserBtn.addEventListener('click', function() {
    const selectedRows = document.querySelectorAll('#user-table-body tbody .delete-checkbox:checked');
    if (selectedRows.length !== 1) {
      alert('Please select one row to edit.');
      return;
    }
    const selectedRow = selectedRows[0];
    const email = selectedRow.querySelector('.email').textContent;
    fetch(`https://allyricsbackend-production.up.railway.app/users/${email}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error in response.');
        }
      })
      .then(data => {
        // Populate the form with the user details
        const inputs = addUserForm.querySelectorAll('input');
        inputs.forEach(input => {
          const name = input.name;
          if (name in data) {
            input.value = data[name];
          } else {
            input.value = '';
          }
        });
        const emailInput = addUserForm.querySelector('[name="email"]');
        emailInput.readOnly = true; // Disable editing of email
        $('#addUserModal').modal('show'); // Show the modal with the user details
      })
      .catch(error => console.error(error));
  });
});

 // Add event listener to the delete button
      const deleteButton = document.querySelector('#delete-selected-btn');
      deleteButton.addEventListener('click', () => {
        const selectedRows = document.querySelectorAll('#user-table-body tbody .delete-checkbox:checked');
        selectedRows.forEach(selectedRow => {
          const email = selectedRow.querySelector('.email').textContent;
          fetch(`https://allyricsbackend-production.up.railway.app/users/${email}`, { method: 'DELETE' })
            .then(response => {
              if (response.ok) {
                const row = selectedRow.closest('tr');
                row.remove();
              } else {
                throw new Error('Error in response.');
              }
            })
            .catch(error => console.error(error));
        });
      }); 

   document.addEventListener('DOMContentLoaded', function() {
  fetch('https://allyricsbackend-production.up.railway.app/users')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error in response.');
      }
    })
    .then(data => {
      data.forEach((user, index) => {
        const row = document.createElement('tr');
        const id = index + 1; 
        row.innerHTML = `
          <td>${id}</td>
          <td>${user.name}</td>
          <td class="email" id="deleteUserEmail">${user.email}</td>
          <td>${user.role}</td>
          <td>${user.password}</td>
           <td><input type="checkbox" class="delete-checkbox"></td>
          
        `;
        document.querySelector('#user-table-body').appendChild(row);
      });
    })
    .catch(error => console.error(error));
});