// Fetch all music data
async function fetchMusicData() {

    const url='https://allyricsbackend-production.up.railway.app/music';
    Headers = {
								'Content-Type': 'application/json',
								'Accept': 'application/json',
								'Access-Control-Allow-Origin': '*',
								'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
							}
  try {
        const response = await fetch(url, { Headers });
        return await response.json();
    } catch (error) {
        return console.error(error);
    }
}

// Function to create search result item
function createSearchResultItem(resultData) {
  const searchResultItem = document.createElement('div');
  const resultLink = document.createElement('a');
  resultLink.href = `lyrics.html?id=${resultData.id}&title=${resultData.title}`; // Redirect to lyrics page with songId and songTitle as query parameters
  resultLink.textContent = resultData.title;
  searchResultItem.appendChild(resultLink);
  searchResults.appendChild(searchResultItem);
}

// Function to clear search results
function clearSearchResults() {
  searchResults.innerHTML = '';
}

// Function to handle search button click
function handleSearchButtonClick() {
  const searchTerm = searchInput.value;
  if (searchTerm.trim() !== '') {
    clearSearchResults();
    fetchMusicData()
      .then(musicData => {
        // Filter music data based on search term
        const filteredMusicData = musicData.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.artist.toLowerCase().includes(searchTerm.toLowerCase()));
        // Create search result items for filtered music data
        filteredMusicData.forEach(item => {
          createSearchResultItem(item);
        });
      })
      .catch(error => console.error(error));
  }
}

const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');

// Add event listener to search button click
searchBtn.addEventListener('click', handleSearchButtonClick);
