import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, uploadProfileImage, uploadCoverImage } from "../api/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [expEntry, setExpEntry] = useState({ company: "", role: "", startDate: "", endDate: "", description: "" });
  const [eduEntry, setEduEntry] = useState({ school: "", degree: "", startDate: "", endDate: "", description: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await getUserProfile();
      setUser(data);
      setForm(data);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { data } = await updateUserProfile(form);
    setUser(data.user);
    setIsEditing(false);
  };

  /** ✅ Upload Profile Image */
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await uploadProfileImage(formData);
    await updateUserProfile({ profileImage: data.imageUrl });
    setUser({ ...user, profileImage: data.imageUrl });
  };

  /** ✅ Upload Cover Image */
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await uploadCoverImage(formData);
    await updateUserProfile({ coverImage: data.imageUrl });
    setUser({ ...user, coverImage: data.imageUrl });
  };

  /** ✅ Add Experience */
  const addExperience = () => {
    const updatedExp = [...(form.experience || []), expEntry];
    setForm({ ...form, experience: updatedExp });
    setExpEntry({ company: "", role: "", startDate: "", endDate: "", description: "" });
  };

  /** ✅ Add Education */
  const addEducation = () => {
    const updatedEdu = [...(form.education || []), eduEntry];
    setForm({ ...form, education: updatedEdu });
    setEduEntry({ school: "", degree: "", startDate: "", endDate: "", description: "" });
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto mt-6">
        
        {/* ✅ Cover Image */}
        <div className="relative h-48 bg-blue-700 rounded-t-lg">
          <img src={user.coverImage || "https://via.placeholder.com/1200x300"} className="h-48 w-full object-cover rounded-t-lg" />
          <label className="absolute top-2 right-2 bg-white px-2 py-1 rounded shadow cursor-pointer">
            Change Cover
            <input type="file" className="hidden" onChange={handleCoverUpload} />
          </label>

          {/* ✅ Profile Image */}
          <div className="absolute -bottom-16 left-6">
            <img src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
            <label className="absolute bottom-0 right-0 bg-white px-2 py-1 text-xs rounded cursor-pointer">
              Change
              <input type="file" className="hidden" onChange={handleProfileImageUpload} />
            </label>
          </div>
        </div>

        {/* ✅ Profile Info */}
        <div className="bg-white rounded-b-lg shadow-md pt-20 pb-6 px-6">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-lg text-gray-700">{user.headline || "Add a headline"}</p>
          <p className="text-gray-500">{user.location || "Set location"}</p>
          <p className="mt-2">{user.bio || "No bio provided"}</p>
          <p className="mt-1 text-blue-600">{user.email}</p>

          <div className="mt-4 flex gap-3">
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit Profile</button>
          </div>
        </div>

        {/* ✅ Skills */}
        <div className="mt-4 bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user.skills?.map((s, i) => <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{s}</span>)}
          </div>
        </div>

        {/* ✅ Experience */}
        <div className="mt-4 bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Experience</h2>
          {user.experience?.map((exp, i) => (
            <div key={i} className="border-b pb-2 mb-2">
              <p className="font-semibold">{exp.role} @ {exp.company}</p>
              <p className="text-xs text-gray-500">{exp.startDate?.substring(0,10)} - {exp.endDate?.substring(0,10) || "Present"}</p>
              <p className="text-sm">{exp.description}</p>
            </div>
          ))}

          {/* Add new experience */}
          <input placeholder="Job Title (e.g. Software Engineer)" value={expEntry.role} onChange={(e)=>setExpEntry({...expEntry,role:e.target.value})} className="border p-1 rounded w-full mb-1" />
          <input placeholder="Company Name (e.g. Google)" value={expEntry.company} onChange={(e)=>setExpEntry({...expEntry,company:e.target.value})} className="border p-1 rounded w-full mb-1" />
          <input placeholder="Start Date (YYYY-MM-DD)" value={expEntry.startDate} onChange={(e)=>setExpEntry({...expEntry,startDate:e.target.value})} className="border p-1 rounded w-full mb-1" />
          <input placeholder="End Date (YYYY-MM-DD or leave blank)" value={expEntry.endDate} onChange={(e)=>setExpEntry({...expEntry,endDate:e.target.value})} className="border p-1 rounded w-full mb-1" />
          <textarea placeholder="Describe your role and responsibilities" value={expEntry.description} onChange={(e)=>setExpEntry({...expEntry,description:e.target.value})} className="border p-1 rounded w-full mb-1" />
          <button onClick={addExperience} className="bg-green-600 text-white px-3 py-1 rounded">Add Experience</button>
        </div>

        {/* ✅ Education */}
        <div className="mt-4 bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Education</h2>
          {user.education?.map((edu, i) => (
            <div key={i} className="border-b pb-2 mb-2">
              <p className="font-semibold">{edu.degree} @ {edu.school}</p>
              <p className="text-xs text-gray-500">{edu.startDate?.substring(0,10)} - {edu.endDate?.substring(0,10)}</p>
              <p className="text-sm">{edu.description}</p>
            </div>
          ))}

          {/* Add new education */}
          <input placeholder="Degree (e.g. B.Sc. Computer Science)" value={eduEntry.degree} onChange={(e)=>setEduEntry({...eduEntry,degree:e.target.value})} className="border p-1 rounded w-full mb-1" />
          <input placeholder="School / University" value={eduEntry.school} onChange={(e)=>setEduEntry({...eduEntry,school:e.target.value})} className="border p-1 rounded w-full mb-1" />
          <input placeholder="Start Date (YYYY-MM-DD)" value={eduEntry.startDate} onChange={(e)=>setEduEntry({...eduEntry,startDate:e.target.value})} className="border p-1 rounded w-full mb-1" />
          <input placeholder="End Date (YYYY-MM-DD)" value={eduEntry.endDate} onChange={(e)=>setEduEntry({...eduEntry,endDate:e.target.value})} className="border p-1 rounded w-full mb-1" />
          <textarea placeholder="Describe your academic experience" value={eduEntry.description} onChange={(e)=>setEduEntry({...eduEntry,description:e.target.value})} className="border p-1 rounded w-full mb-1" />
          <button onClick={addEducation} className="bg-green-600 text-white px-3 py-1 rounded">Add Education</button>
        </div>

        {/* ✅ Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="border w-full p-2 mb-2 rounded" />
              <input name="headline" placeholder="Professional Headline (e.g. Frontend Developer at XYZ)" value={form.headline} onChange={handleChange} className="border w-full p-2 mb-2 rounded" />
              <input name="location" placeholder="Location (e.g. New York, USA)" value={form.location} onChange={handleChange} className="border w-full p-2 mb-2 rounded" />
              <textarea name="bio" placeholder="Write a short bio about yourself" value={form.bio} onChange={handleChange} className="border w-full p-2 mb-2 rounded" />
              <input name="skills" placeholder="Skills (comma-separated e.g. React, Node.js, MongoDB)" value={form.skills?.join(", ")} onChange={(e)=>setForm({...form,skills:e.target.value.split(",")})} className="border w-full p-2 mb-2 rounded" />

              <div className="flex justify-end gap-3">
                <button type="button" onClick={()=>setIsEditing(false)} className="px-3 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
