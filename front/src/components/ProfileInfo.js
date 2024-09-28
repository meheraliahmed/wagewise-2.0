// src/components/ProfileInfo.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProfileInfo({ email }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user-profile?email=${email}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [email]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-info">
      <img src="/profile.png" alt={userData.personalInfo.name} className="profile-image" />
      <h1>{userData.personalInfo.name}</h1>
      <p>{userData.email}</p>
      <p>{userData.personalInfo.age} years old</p>
      <p>From {userData.personalInfo.hometown}</p>
      <p>Living in {userData.personalInfo.currentCity}</p>
      <div>
        <h2>Education</h2>
        {userData.education.map((edu, index) => (
          <div key={index}>
            <p>{edu.degree} from {edu.institute} ({edu.graduationYear}) - GPA: {edu.gpa}</p>
          </div>
        ))}
      </div>
      <div>
        <h2>Experience</h2>
        {userData.job.map((job, index) => (
          <div key={index}>
            <p>{job.designation} at {job.companyName} ({job.city}) - {job.yearsOfExperience} years</p>
          </div>
        ))}
      </div>
      <div>
        <h2>Skills</h2>
        {userData.skills.map((skill, index) => (
          <div key={index}>
            <p>{skill.skillName}</p>
          </div>
        ))}
      </div>
      <div className="profile-actions">
        <button>Edit Profile</button>
        <button>Change Password</button>
      </div>
    </div>
  );
}

export default ProfileInfo;
