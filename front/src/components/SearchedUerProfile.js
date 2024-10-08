import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SearchedUserProfile = () => {
    const { email } = useParams(); // Get the email from the URL
    console.log('Email from URL:', email); // Log the email prop

    const [threads, setThreads] = useState([]);
    const [error, setError] = useState(null);
    const [isFriend, setIsFriend] = useState(false); // State to track friend status
    const [searchedUserFriends, setSearchedUserFriends] = useState([]); // Store friends of the searched user
    const [newReply, setNewReply] = useState(''); // For reply input
    const [repliesByThread, setRepliesByThread] = useState({}); // Track replies for each thread

    // Get the logged-in user's email from the Redux store
    const loggedInUserEmail = useSelector(state => state.login.email); 
    console.log('Logged-in User Email:', loggedInUserEmail); // Log the logged-in user's email

    useEffect(() => {
        if (!email) {
            console.error('No email provided');
            return;
        }

        const fetchUserThreads = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/user-threads/${email}`);
                console.log('Response from server:', response.data);
                setThreads(response.data);
            } catch (error) {
                console.error('Error fetching user threads:', error);
                setError('Failed to fetch user threads.');
            }
        };

        // Fetch the full user data by email to get the friends list
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/user/${email}`);
                const userData = response.data;
                console.log('Fetched user data:', userData);

                // Store the searched user's friends list
                setSearchedUserFriends(userData.friends); // Store the friends list

                // Log the logged-in user's email and the emails in the friends array of the searched user
                console.log('Logged-in User Email:', loggedInUserEmail);
                console.log('Searched User Friends:', userData.friends);

                // Check if the logged-in user's email is in the friends list of the searched user
                const isUserFriend = userData.friends.some(friend => {
                    console.log('Comparing with Friend Email:', friend.email); // Log comparison
                    return friend.email === loggedInUserEmail; // Compare emails
                });

                setIsFriend(isUserFriend); // Update the friend status
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data.');
            }
        };

        fetchUserThreads();
        fetchUserData();
    }, [email, loggedInUserEmail]);

    const handleFriendToggle = async () => {
        try {
            const response = await axios.post('http://localhost:3001/toggle-friend', {
                userEmail: loggedInUserEmail, // Logged-in user's email
                friendEmail: email, // Use the friend's email
            });
            alert(response.data); // Show success message
            setIsFriend(prev => !prev); // Toggle friend status in the UI
        } catch (error) {
            console.error('Error toggling friend status:', error);
            alert('Error toggling friend status.');
        }
    };

    // Handle like (frontend only for now)
    const handleLike = async (threadId) => {
        console.log("Liking thread ID:", threadId);
        console.log("Searched User Email:", email);
        console.log("Logged In User Email:", loggedInUserEmail); // Display the logged-in user's email
    
        const requestData = {
            threadId,
            email,
            loggedInUserEmail,
        };
        console.log("Request Data:", requestData); // Log the request data
    
        try {
            const response = await axios.post('http://localhost:3001/like-thread', requestData);
            console.log(response.data);
        } catch (error) {
            console.error('Error liking thread:', error.response ? error.response.data : error.message);
        }
    };

    // Handle dislike (frontend only for now)
    const handleDislike = async (threadId) => {
        console.log("Disliking thread ID:", threadId);
        console.log("Searched User Email:", email);
        console.log("Logged In User Email:", loggedInUserEmail); // Display the logged-in user's email

        const requestData = {
            threadId,
            email,
            loggedInUserEmail,
        };
        console.log("Request Data:", requestData); // Log the request data

        try {
            const response = await axios.post('http://localhost:3001/dislike-thread', requestData);
            console.log(response.data);
        } catch (error) {
            console.error('Error disliking thread:', error.response ? error.response.data : error.message);
        }
    };

    // Handle reply
    const handleReply = async (threadId) => {
        console.log(`Replying to thread with ID: ${threadId}, Reply: ${newReply}`);
        
        const requestData = {
            threadId,
            replyContent: newReply,
            replyingUserEmail: loggedInUserEmail, // Send the logged-in user's email
        };
    
        // Log the request data before sending it
        console.log('Request Data:', requestData);
    
        try {
            const response = await axios.post('http://localhost:3001/reply-to-thread', requestData);
            console.log('Server response:', response.data);
            setNewReply(''); // Clear reply input after successful submission
        } catch (error) {
            console.error('Error replying to thread:', error.response ? error.response.data : error.message);
        }
    };

    // Fetch replies for a thread
    const fetchReplies = async (threadId) => {
        try {
            const response = await axios.get(`http://localhost:3001/replies/${threadId}`);
            console.log('Fetched replies:', response.data);
            setRepliesByThread(prevReplies => ({
                ...prevReplies,
                [threadId]: response.data, // Store the replies for the specific thread
            }));
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

    return (
        <div>
            <h2>User Threads</h2>
            {error && <p>{error}</p>}
            {threads.length > 0 ? (
                threads.map((thread, index) => (
                    <div key={index}>
                        <p>{thread.content}</p>
                        <p>Created At: {new Date(thread.createdAt).toLocaleString()}</p>
                        <p>Likes: {thread.likes?.length || 0} | Dislikes: {thread.dislikes?.length || 0}</p>
                        
                        {/* Like and Dislike Buttons */}
                        <button onClick={() => handleLike(thread._id)}>Like</button>
                        <button onClick={() => handleDislike(thread._id)}>Dislike</button>
                        
                        {/* Reply Section */}
                        <div>
                            <input
                                type="text"
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                placeholder="Type your reply..."
                            />
                            <button onClick={() => handleReply(thread._id)}>Reply</button>
                        </div>
                        
                        {/* Display replies if available */}
                        <div>
                            <h4>Replies:</h4>
                            <button onClick={() => fetchReplies(thread._id)}>
                                {repliesByThread[thread._id] ? 'Hide Replies' : 'View All Replies'}
                            </button>
                            {repliesByThread[thread._id] && repliesByThread[thread._id].length > 0 ? (
                                repliesByThread[thread._id].map((reply, replyIndex) => (
                                    <div key={replyIndex}>
                                        <p>{reply.content}</p>
                                        <p>Replied At: {new Date(reply.createdAt).toLocaleString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No replies yet.</p>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p>No threads found for this user.</p>
            )}
            <button onClick={handleFriendToggle}>
                {isFriend ? 'Unfriend' : 'Add Friend'}
            </button>
        </div>
    );
};

export default SearchedUserProfile;
