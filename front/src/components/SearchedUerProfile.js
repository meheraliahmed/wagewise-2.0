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

    return (
        <div>
            <h2>User Threads</h2>
            {error && <p>{error}</p>}
            {threads.length > 0 ? (
                threads.map((thread, index) => (
                    <div key={index}>
                        <p>{thread.content}</p>
                        <p>Created At: {new Date(thread.createdAt).toLocaleString()}</p>
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
