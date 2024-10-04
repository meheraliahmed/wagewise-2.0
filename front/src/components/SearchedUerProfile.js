import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SearchedUserProfile = () => {
    const { email } = useParams(); // Get the email from the URL
    console.log('Email from URL:', email); // Log the email prop
    const [threads, setThreads] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!email) {
            console.error('No email provided'); // Log if email is undefined
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

        fetchUserThreads();
    }, [email]);

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
        </div>
    );
};

export default SearchedUserProfile;
