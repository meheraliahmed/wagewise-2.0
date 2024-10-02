import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function Community() {
  const [showThreadForm, setShowThreadForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const email = useSelector(state => state.login.email); // Assuming you're storing email in Redux

  const handleCreateThread = async () => {
    try {
      const response = await axios.post('http://localhost:3001/create-thread', {
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

  return (
    <div className="community-page">
      <h1>Community</h1>
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
    </div>
  );
}

export default Community;
