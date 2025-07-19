import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../Firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";

function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const toggleLove = async (id, currentValue) => {
    try {
      await updateDoc(doc(db, "posts", id), {
        liked: !currentValue,
      });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, liked: !post.liked } : post
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "posts", id));
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Posts</h1>
          {user && (
            <Link
              to="/add"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              Add New Post
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-300">No posts found.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 rounded-lg p-6 mb-6 shadow-md transition-transform transform hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={post.userPhoto || "https://via.placeholder.com/40"}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{post.userName}</h3>
                    <p className="text-xs text-gray-400">
                      {post.createdAt?.toDate().toLocaleString()}
                    </p>
                  </div>
                </div>
                {user?.uid === post.userId && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-400 hover:text-red-600 font-semibold"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-200 mb-4">{post.content}</p>
              <button
                onClick={() => toggleLove(post.id, post.liked)}
                className={`${
                  post.liked ? "text-red-500" : "text-gray-400"
                } hover:text-red-600 transition`}
              >
                ❤️ {post.liked ? "Liked" : "Like"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
