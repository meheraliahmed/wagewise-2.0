import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';
import './UserProfile.css';

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit mode
  const [editData, setEditData] = useState(null); // Store editable form data
  const email = useSelector(state => state.login.email);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user-profile?email=${email}`);
        setUserData(response.data);
        setEditData(response.data); // Initialize editData with the current user data
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (email) {
      fetchUserData();
    }
  }, [email]);

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handle form input change
  const handleInputChange = (e, section, index = null, field = null) => {
    const { name, value } = e.target;

    // Update nested fields based on section (personalInfo, education, job, skills)
    if (section === 'personalInfo') {
      setEditData(prevData => ({
        ...prevData,
        personalInfo: { ...prevData.personalInfo, [name]: value }
      }));
    } else if (section === 'education') {
      const updatedEducation = [...editData.education];
      updatedEducation[index][name] = value;
      setEditData(prevData => ({ ...prevData, education: updatedEducation }));
    } else if (section === 'job') {
      const updatedJobs = [...editData.job];
      updatedJobs[index][name] = value;
      setEditData(prevData => ({ ...prevData, job: updatedJobs }));
    } else if (section === 'skills') {
      const updatedSkills = [...editData.skills];
      updatedSkills[index][name] = value;
      setEditData(prevData => ({ ...prevData, skills: updatedSkills }));
    }
  };

  // Submit the updated data
  const handleSubmit = async () => {
    try {
      await axios.put('http://localhost:3001/update-profile', editData);
      setUserData(editData); // Update the view with the edited data
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <Header />
      <div className="profile-info">
        {isEditing ? (
          <>
            {/* Editable fields for personal information */}
            <h1>
              <input
                type="text"
                name="name"
                value={editData.personalInfo.name}
                onChange={e => handleInputChange(e, 'personalInfo')}
              />
            </h1>
            <p>
              Email: <input type="text" name="email" value={editData.personalInfo.email} onChange={e => handleInputChange(e, 'personalInfo')} />
            </p>
            <p>
              Age: <input type="text" name="age" value={editData.personalInfo.age} onChange={e => handleInputChange(e, 'personalInfo')} />
            </p>
            <p>
              Hometown: <input type="text" name="hometown" value={editData.personalInfo.hometown} onChange={e => handleInputChange(e, 'personalInfo')} />
            </p>
            <p>
              Current City: <input type="text" name="currentCity" value={editData.personalInfo.currentCity} onChange={e => handleInputChange(e, 'personalInfo')} />
            </p>
            <p>
              Phone: <input type="text" name="phone" value={editData.personalInfo.phone} onChange={e => handleInputChange(e, 'personalInfo')} />
            </p>

            {/* Editable fields for education */}
            <h2>Education</h2>
            {editData.education.map((edu, index) => (
              <div key={index}>
                <p>
                  Degree: <input type="text" name="degree" value={edu.degree} onChange={e => handleInputChange(e, 'education', index)} />
                </p>
                <p>
                  Institute: <input type="text" name="institute" value={edu.institute} onChange={e => handleInputChange(e, 'education', index)} />
                </p>
                <p>
                  Graduation Year: <input type="text" name="graduationYear" value={edu.graduationYear} onChange={e => handleInputChange(e, 'education', index)} />
                </p>
                <p>
                  GPA: <input type="text" name="gpa" value={edu.gpa} onChange={e => handleInputChange(e, 'education', index)} />
                </p>
              </div>
            ))}

            {/* Editable fields for professional experience */}
            <h2>Professional Experience</h2>
            {editData.job.map((job, index) => (
              <div key={index}>
                <p>
                  Company Name: <input type="text" name="companyName" value={job.companyName} onChange={e => handleInputChange(e, 'job', index)} />
                </p>
                <p>
                  Designation: <input type="text" name="designation" value={job.designation} onChange={e => handleInputChange(e, 'job', index)} />
                </p>
                <p>
                  City: <input type="text" name="city" value={job.city} onChange={e => handleInputChange(e, 'job', index)} />
                </p>
                <p>
                  Years of Experience: <input type="text" name="yearsOfExperience" value={job.yearsOfExperience} onChange={e => handleInputChange(e, 'job', index)} />
                </p>
              </div>
            ))}

            {/* Editable fields for skills */}
            <h2>Skills</h2>
            {editData.skills.map((skill, index) => (
              <p key={index}>
                Skill: <input type="text" name="skillName" value={skill.skillName} onChange={e => handleInputChange(e, 'skills', index)} />
              </p>
            ))}

            {/* Submit button */}
            <button onClick={handleSubmit}>Save Changes</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
          <img src="/profile.png" alt={userData.personalInfo.name} className="profile-image" />
            <h1>{userData.personalInfo.name}</h1>
            <p>Email: {userData.personalInfo.email}</p>
            <p>Age: {userData.personalInfo.age}</p>
            <p>Hometown: {userData.personalInfo.hometown}</p>
            <p>Current City: {userData.personalInfo.currentCity}</p>
            <p>Phone: {userData.personalInfo.phone}</p>

            <h2>Education</h2>
            {userData.education.map((edu, index) => (
              <div key={index}>
                <p>Degree: {edu.degree}</p>
                <p>Institute: {edu.institute}</p>
                <p>Graduation Year: {edu.graduationYear}</p>
                <p>GPA: {edu.gpa}</p>
              </div>
            ))}

            <h2>Professional Experience</h2>
            {userData.job.map((job, index) => (
              <div key={index}>
                <p>Company Name: {job.companyName}</p>
                <p>Designation: {job.designation}</p>
                <p>City: {job.city}</p>
                <p>Years of Experience: {job.yearsOfExperience}</p>
              </div>
            ))}

            <h2>Skills</h2>
            {userData.skills.map((skill, index) => (
              <p key={index}>Skill: {skill.skillName}</p>
            ))}

            <div className="profile-actions">
              <button onClick={handleEditClick}>Edit Profile</button>
              <Link to="/change-password" state={{ email: userData.personalInfo.email }}>
                <button>Change Password</button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
