import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { onSnapshot } from "firebase/firestore";
const Home = () => {
  const [post, setPost] = useState('');
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/'); // if not logged in, redirect to login
      } else {
        setUser(currentUser);
      }
    });

    fetchPosts();
    return () => unsubscribe();
  }, []);

 

useEffect(() => {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(data);
  });

  return () => unsubscribe(); // Clean up the listener when the component unmounts
}, []);


  const handlePost = async (e) => {
    e.preventDefault();
    if (!post.trim()) return;

    await addDoc(collection(db, 'posts'), {
      content: post,
      author: user.displayName,
      uid: user.uid,
      createdAt: serverTimestamp(),
    });

    setPost('');
    fetchPosts();
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="flex items-center space-x-2">
         <h1 className="text-xl font-bold text-gray-700">LinkedHub</h1>
          
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/profile">
          <img
            src="https://www.w3schools.com/howto/img_avatar.png"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ✅ Post Feed */}
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Home Feed</h2>
        <form onSubmit={handlePost} className="mb-6">
          <textarea
            value={post}
            onChange={(e) => setPost(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border p-2 rounded mb-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Post
          </button>
        </form>
        <div className="space-y-4">
          {posts.map((p) => (
            <div key={p.id} className="border p-4 rounded shadow bg-white">
              <p className="text-sm text-gray-500">{p.author}</p>
              <p className="mt-1">{p.content}</p>
              <p className="text-xs text-gray-400 mt-2">
                {p.createdAt?.toDate().toLocaleString() || 'Just now'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
