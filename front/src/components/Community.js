import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

function Community() {
  const [showThreadForm, setShowThreadForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const email = useSelector(state => state.login.email); // Assuming you're storing email in Redux

  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Handle thread creation
  const handleCreateThread = async () => {
    try {
      await axios.post('http://localhost:3001/create-thread', {
        email,
        title,
        content
      });
      alert('Thread created successfully');
    } catch (error) {
      console.error('Error creating thread', error);
      alert('Failed to create thread');
    }
  };

  // Handle user search
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form submission reload
    try {
      const response = await axios.get(`http://localhost:3001/search-users?name=${searchTerm}`);
      setSearchResults(response.data); // Update the search results
    } catch (error) {
      console.error('Error searching users:', error);
      alert('Failed to search users');
    }
  };

  // Handle clicking on a user name
  const handleUserClick = (email) => {
    navigate(`/user-profile/${email}`); // Navigate to the user profile page
    console.log("Navigating to user profile with email:", email);
  };

  return (
    <div className="community-page">
      <h1>Community</h1>
      
      {/* Create a Thread Section */}
      <button onClick={() => setShowThreadForm(!showThreadForm)}>
        {showThreadForm ? 'Cancel' : 'Create a Thread'}
      </button>

      {showThreadForm && (
        <div className="thread-form">
          <input
            type="text"
            placeholder="Thread Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Thread Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={handleCreateThread}>Create Thread</button>
        </div>
      )}

      {/* Search Section */}
      <div className="search-section">
        <h2>Search for Users</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {/* Search Results */}
        <div className="search-results">
          {searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div key={user._id} className="user-result">
                <p
                  onClick={() => handleUserClick(user.personalInfo.email)}
                  style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                >
                  Name: {user.personalInfo.name}
                </p> {/* Clickable user name */}
                <p>Email: {user.personalInfo.email}</p>
              </div>
            ))
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Community;
