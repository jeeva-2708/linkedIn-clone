import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchUserPosts(currentUser.uid);
    });
  }, []);

  const fetchUserPosts = async (uid) => {
    console.log("Fetching posts for UID:", uid);
    const q = query(collection(db, "posts"), where("uid", "==", uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Fetched user posts:", data); // 🔍
    setPosts(data);
  };

  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="">
      {/* ✅ Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="flex items-center space-x-2">
          <Link to="/">
           <h1 className="text-xl font-bold text-gray-700">LinkedHub</h1>
          </Link>
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
      <div className="max-w-2xl mx-auto p-4 ">
        {user && (
          <div className="flex flex-col items-center text-center my-6">
            {/* Profile Image */}
            <img
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt="Profile"
              className="w-28 h-28 rounded-full mb-4 object-cover border"
            />
            {/* Name */}
            <h1 className="text-2xl font-bold mb-1">
              {user.displayName || "Anonymous"}
            </h1>
            {/* Email */}
            <p className="text-gray-600 mb-1">{user.email}</p>
            {/* Bio */}
            <p className="text-gray-500 text-sm">
              Bio:{" "}
              {user.displayName
                ? `Hi, I'm ${user.displayName}! Welcome to my profile.`
                : "This user hasn't added a bio yet."}
            </p>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded mb-2">
            <p>{post.content}</p>
            <p className="text-xs text-gray-400 mt-2">
              {post.createdAt?.toDate?.().toLocaleString?.() || "No timestamp"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
