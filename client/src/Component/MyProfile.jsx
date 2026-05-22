import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ChatWidget from './ChatWidget';

export default function MyProfile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const { control, register, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      skills: [{ name: '', level: '' }],
      experience: [{ company: '', role: '', duration: '', description: '' }],
      education: [{ degree: '', institution: '', yearOfPassing: '' }],
    },
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: 'skills' });
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: 'experience' });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: 'education' });

  const [resume, setResume] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:6102/api/user/getUserById/${userId}`);
        const user = res.data.user;
        setValue('name', user.name || '');
        setValue('email', user.email || '');
        setValue('phone', user.phone || '');
        setValue('skills', user.skills || [{ name: '', level: '' }]);
        setValue('experience', user.experience || []);
        setValue('education', user.education || []);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [setValue, userId]);

const onSubmit = async (data) => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('skills', JSON.stringify(data.skills));
    formData.append('experience', JSON.stringify(data.experience));
    formData.append('education', JSON.stringify(data.education));
    if (resume) formData.append('resume', resume);
    if (profileImage) formData.append('profileImage', profileImage);

    const res = await axios.put(
      `http://localhost:6102/api/user/update-profile/${userId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    // ✅ UPDATE LOCAL STORAGE
    localStorage.setItem('userName', res.data.user.name);
    localStorage.setItem('userProfile', res.data.user.profileImage);

    alert('Profile updated successfully');

    // OPTIONAL: reload header instantly
    window.dispatchEvent(new Event('profileUpdated'));

  } catch (err) {
    console.error('Update failed', err);
    alert('Error updating profile');
  }
};


  const userToken = localStorage.getItem('userToken');

useEffect(() => {
  if (!userToken) {
    alert('You need to be logged in to view this job.');
    navigate('/login');
    return;
  }},[]);
  return (
    <div className="dashboard-area pt-120 mb-120">
      <ChatWidget/>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="edit-profile-inner">
              <div className="form-wrapper">
                <form className="edit-profile-form profile-form mb-60" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">

                  {/* Basic Info */}
                  <div className="row">
                    <div className="col-md-12 mb-25">
                      <div className="form-inner">
                        <label>Name*</label>
                        <div className="input-area">
                          <img src="assets/images/icon/user-2.svg" alt="" />
                          <input {...register('name')} placeholder="Your Name" />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-25">
                      <div className="form-inner">
                        <label>Email*</label>
                        <div className="input-area">
                          <img src="assets/images/icon/email-2.svg" alt="" />
                          <input {...register('email')} placeholder="Your Email" />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-25">
                      <div className="form-inner">
                        <label>Phone*</label>
                        <div className="input-area">
                          <img src="assets/images/icon/phone-2.svg" alt="" />
                          <input {...register('phone')} placeholder="Phone Number" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-50">
                    <h4>Skills</h4>
                    {skillFields.map((item, index) => (
                      <div key={item.id} className="mb-3 d-flex gap-2 align-items-center">
                        <input {...register(`skills.${index}.name`)} placeholder="Skill Name" className="form-control" />
                        <select {...register(`skills.${index}.level`)} className="form-control">
                          <option value="">Level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Expert">Expert</option>
                        </select>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSkill(index)}>Remove</button>
                      </div>
                    ))}
                    <button style={{backgroundColor:"#00a7ac",color:"white"}} type="button" className="btn btn-sm"  onClick={() => appendSkill({ name: '', level: '' })}>+ Add Skill</button>
                  </div>

                  {/* Experience */}
                  <div className="mb-50">
                    <h4>Experience</h4>
                    {expFields.map((item, index) => (
                      <div key={item.id} className="mb-3">
                        <input {...register(`experience.${index}.company`)} placeholder="Company" className="form-control mb-2" />
                        <input {...register(`experience.${index}.role`)} placeholder="Role" className="form-control mb-2" />
                        <input {...register(`experience.${index}.duration`)} placeholder="Duration" className="form-control mb-2" />
                        <textarea {...register(`experience.${index}.description`)} placeholder="Description" className="form-control mb-2" />
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeExp(index)}>Remove</button>
                        <hr />
                      </div>
                    ))}
                    <button type="button" style={{backgroundColor:"#00a7ac",color:"white"}} className="btn btn-sm" onClick={() => appendExp({})}>+ Add Experience</button>
                  </div>

                  {/* Education */}
                  <div className="mb-50">
                    <h4>Education</h4>
                    {eduFields.map((item, index) => (
                      <div key={item.id} className="mb-3">
                        <input {...register(`education.${index}.degree`)} placeholder="Degree" className="form-control mb-2" />
                        <input {...register(`education.${index}.institution`)} placeholder="Institution" className="form-control mb-2" />
                        <input {...register(`education.${index}.yearOfPassing`)} placeholder="Year of Passing" className="form-control mb-2" />
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeEdu(index)}>Remove</button>
                        <hr />
                      </div>
                    ))}
                    <button type="button" style={{backgroundColor:"#00a7ac",color:"white"}} className="btn btn-sm" onClick={() => appendEdu({})}>+ Add Education</button>
                  </div>

                  {/* Files */}
                  <div className="mb-50">
                    <label>Upload Resume</label>
                    <input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} className="form-control mb-3" />
                    <label>Profile Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} className="form-control" />
                  </div>

                  <div className="text-center">
                    <button type="submit" className="primry-btn-2 lg-btn w-unset">Update Profile</button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
