import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import './questionnaire.css';

function SignupQuestionnaire() {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    personalDetails: {
      name: '',
      age: '',
      hometown: '',
      currentCity: '',
      email: '',
      phone: '',
    },
    educationalQualifications: [
      { degree: '', institute: '', graduationYear: '', gpa: '' }
    ],
    professionalExperience: [
      { companyName: '', designation: '', city: '', yearsOfExperience: '' }
    ],
    skills: [{ skillName: '' }],
  });

  const handleChange = (section, index, e) => {
    const { name, value } = e.target;

    if (Array.isArray(formData[section])) {
      setFormData(prevData => ({
        ...prevData,
        [section]: prevData[section].map((item, i) => 
          i === index ? { ...item, [name]: value } : item
        ),
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [section]: { ...prevData[section], [name]: value },
      }));
    }
  };

  const addMore = (section) => {
    if (Array.isArray(formData[section])) {
      setFormData(prevData => ({
        ...prevData,
        [section]: [...prevData[section], {}],
      }));
    }
  };

  const removeEntry = (section, index) => {
    if (Array.isArray(formData[section])) {
      setFormData(prevData => ({
        ...prevData,
        [section]: prevData[section].filter((_, i) => i !== index),
      }));
    }
  };

  const nextPage = () => setPage(page + 1);
  const prevPage = () => setPage(page - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingData = Object.keys(formData).some(key => {
      if (Array.isArray(formData[key])) {
        return formData[key].some(item => Object.values(item).some(value => !value));
      } else {
        return Object.values(formData[key]).some(value => !value);
      }
    });

    if (missingData) {
      console.error('Error: Some fields are missing or incorrect.');
      return;
    }

    console.log('User Data being submitted:', formData);

    try {
      const response = await axios.post('http://localhost:3001/add-info', formData);
      console.log('Response from server:', response.data);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  return (
    <div className="signup-questionnaire">
      <Header />
      <div className="questionnaire-content">
        <h1>Sign Up Questionnaire</h1>
        <form onSubmit={handleSubmit}>
          {page === 1 && (
            <PersonalDetails
              data={formData.personalDetails}
              onChange={(e) => handleChange('personalDetails', null, e)}
            />
          )}
          {page === 2 && (
            <EducationalQualifications
              data={formData.educationalQualifications}
              onChange={handleChange}
              addMore={() => addMore('educationalQualifications')}
              removeEntry={removeEntry}
            />
          )}
          {page === 3 && (
            <ProfessionalExperience
              data={formData.professionalExperience}
              onChange={handleChange}
              addMore={() => addMore('professionalExperience')}
              removeEntry={removeEntry}
            />
          )}
          {page === 4 && (
            <Skills
              data={formData.skills}
              onChange={handleChange}
              addMore={() => addMore('skills')}
              removeEntry={removeEntry}
            />
          )}
          <div className="button-group">
            {page > 1 && <button type="button" onClick={prevPage}>Previous</button>}
            {page < 4 && <button type="button" onClick={nextPage}>Next</button>}
            {page === 4 && <button type="submit">Submit</button>}
          </div>
        </form>
      </div>
    </div>
  );
}

function PersonalDetails({ data, onChange }) {
  return (
    <div className="section">
      <h2>Personal Details</h2>
      <input name="name" placeholder="Full Name" value={data.name} onChange={onChange} />
      <input name="age" type="number" placeholder="Age" value={data.age} onChange={onChange} />
      <input name="hometown" placeholder="Hometown" value={data.hometown} onChange={onChange} />
      <input name="currentCity" placeholder="Current City" value={data.currentCity} onChange={onChange} />
      <input name="email" type="email" placeholder="Email" value={data.email} onChange={onChange} />
      <input name="phone" placeholder="Phone Number" value={data.phone} onChange={onChange} />
    </div>
  );
}

function EducationalQualifications({ data, onChange, addMore, removeEntry }) {
  return (
    <div className="section">
      <h2>Educational Qualifications</h2>
      {data.map((edu, index) => (
        <div key={index} className="education-entry">
          <input name="degree" placeholder="Degree" value={edu.degree} onChange={(e) => onChange('educationalQualifications', index, e)} />
          <input name="institute" placeholder="Institute" value={edu.institute} onChange={(e) => onChange('educationalQualifications', index, e)} />
          <input name="graduationYear" placeholder="Graduation Year" value={edu.graduationYear} onChange={(e) => onChange('educationalQualifications', index, e)} />
          <input name="gpa" placeholder="GPA (optional)" value={edu.gpa} onChange={(e) => onChange('educationalQualifications', index, e)} />
          {index > 0 && (
            <button type="button" onClick={() => removeEntry('educationalQualifications', index)} className="remove-btn">Remove</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addMore} className="add-more">Add More</button>
    </div>
  );
}

function ProfessionalExperience({ data, onChange, addMore, removeEntry }) {
  return (
    <div className="section">
      <h2>Professional Experience</h2>
      {data.map((exp, index) => (
        <div key={index} className="experience-entry">
          <input name="companyName" placeholder="Company Name" value={exp.companyName} onChange={(e) => onChange('professionalExperience', index, e)} />
          <input name="designation" placeholder="Designation" value={exp.designation} onChange={(e) => onChange('professionalExperience', index, e)} />
          <input name="city" placeholder="City" value={exp.city} onChange={(e) => onChange('professionalExperience', index, e)} />
          <input name="yearsOfExperience" placeholder="Years of Experience" value={exp.yearsOfExperience} onChange={(e) => onChange('professionalExperience', index, e)} />
          {index > 0 && (
            <button type="button" onClick={() => removeEntry('professionalExperience', index)} className="remove-btn">Remove</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addMore} className="add-more">Add More</button>
    </div>
  );
}

function Skills({ data, onChange, addMore, removeEntry }) {
  return (
    <div className="section">
      <h2>Skills</h2>
      {data.map((skill, index) => (
        <div key={index} className="skill-entry">
          <input
            name="skillName"
            placeholder="Skill"
            value={skill.skillName}
            onChange={(e) => onChange('skills', index, e)}
          />
          {index > 0 && (
            <button type="button" onClick={() => removeEntry('skills', index)} className="remove-btn">Remove</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addMore} className="add-more">Add More</button>
    </div>
  );
}

export default SignupQuestionnaire;
