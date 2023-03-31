function loadLyricsTable() {
  const tableBody = document.querySelector('#lyrics-table tbody');

  // Clear existing data in the table
  tableBody.innerHTML = '';

  fetch('https://allyricsbackend-production.up.railway.app/music')
    .then(response => response.json())
    .then(data => {
      data.forEach(lyric => {
        const row = document.createElement('tr');
        row.dataset.id = lyric.id;
        row.innerHTML = `
          <td>${lyric.id}</td>
          <td>${lyric.music_title}</td>
          <td>${lyric.artist}</td>
          <td>${lyric.lyrics}</td>
          <td>
            <div class="form-check">
              <input type="checkbox" class="form-check-input delete-checkbox" data-id="${lyric.id}">
            </div>
          </td>
        `;
         tableBody.appendChild(row);

        row.addEventListener('click', () => {
          const selectedRow = document.querySelector('#lyrics-table tbody .table-primary');
          if (selectedRow) {
            selectedRow.classList.remove('table-primary');
          }
          row.classList.add('table-primary');
          // code to show the selected lyric in the form
        });
      });

      // Add event listener to the delete button
      const deleteButton = document.querySelector('#delete-selected-btn');
      deleteButton.addEventListener('click', () => {
        const selectedRows = document.querySelectorAll('#lyrics-table tbody .delete-checkbox:checked');
        selectedRows.forEach(selectedRow => {
          const id = selectedRow.dataset.id;
          fetch(`https://allyricsbackend-production.up.railway.app/music/${id}`, { method: 'DELETE' })
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

      // Add event listener to the edit button
const editButton = document.querySelector('#edit-lyrics-button');
editButton.addEventListener('click', () => {
  const selectedRow = document.querySelector('#lyrics-table tbody .table-primary');
  if (selectedRow) {
    const id = selectedRow.dataset.id;
    const musicTitle = selectedRow.querySelector('.music-title').textContent;
    const artist = selectedRow.querySelector('.artist').textContent;
    const lyrics = selectedRow.querySelector('.lyrics').textContent;
    
    // Populate form with selected lyric data
    document.querySelector('#edit-lyric-id').value = id;
    document.querySelector('#edit-music-title').value = musicTitle;
    document.querySelector('#edit-artist').value = artist;
    document.querySelector('#edit-lyrics').value = lyrics;

    // Show the edit lyric form
    document.querySelector('#edit-lyric-form').classList.remove('d-none');
  } else {
    alert('Please select a row to edit.');
  }
});

// Add event listener to the edit lyric form
const editLyricForm = document.querySelector('#edit-lyric-form');
editLyricForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form from submitting via browser
  const id = document.querySelector('#edit-lyric-id').value;
  const musicTitle = document.querySelector('#edit-music-title').value;
  const artist = document.querySelector('#edit-artist').value;
  const lyrics = document.querySelector('#edit-lyrics').value;

  // Send PUT request to server to update lyric data
  fetch(`https://allyricsbackend-production.up.railway.app/lyrics/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      music_title: musicTitle,
      artist: artist,
      lyrics: lyrics
    })
  })
  .then(response => {
    if (response.ok) {
      // Reload lyrics table with updated data
      loadLyricsTable();
      // Hide the edit lyric form
      document.querySelector('#edit-lyric-form').classList.add('d-none');
      Swal.fire({
        title: 'Success!',
        text: 'Lyric updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } else {
      throw new Error('Error updating lyric.');
    }
  })
  .catch(error => {
    console.error(error);
    Swal.fire({
      title: 'Error!',
      text: error.message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  });
});

// Add event listener to the cancel edit button
const cancelEditButton = document.querySelector('#cancel-edit-btn');
cancelEditButton.addEventListener('click', () => {
  // Hide the edit lyric form
  document.querySelector('#edit-lyric-form').classList.add('d-none');
});

});}
