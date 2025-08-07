import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(userCred.user, { displayName: form.name });
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-lg p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" type="text" onChange={handleChange} value={form.name} placeholder="Full Name" className="w-full px-4 py-2 border rounded-md" required />
          <input name="email" type="email" onChange={handleChange} value={form.email} placeholder="Email" className="w-full px-4 py-2 border rounded-md" required />
          <input name="password" type="password" onChange={handleChange} value={form.password} placeholder="Password" className="w-full px-4 py-2 border rounded-md" required />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Sign Up</button>
        </form>
        <p className="text-center text-sm mt-4">
          Already have an account? <a href="/login" className="text-blue-600">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
