import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../Firebase/config";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
      setLoading(false); 
    });

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribePosts();
      unsubscribeAuth();
    };
  }, []);

  const toggleLove = (id) => {
    const updated = posts.map((post) =>
      post.id === id ? { ...post, liked: !post.liked } : post
    );
    setPosts(updated);
   
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "posts", id));
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <>
      {loading ? (
       
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg text-black"></span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 mt-10">
          {posts.map((post) => (
            <div key={post.id} className="card bg-white text-black shadow-xl w-96">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-2">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={
                          post.photoURL?.trim()
                            ? post.photoURL
                            : "https://www.w3schools.com/howto/img_avatar.png"
                        }
                        alt="user"
                        style={{ width: 40, height: 40, borderRadius: "50%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="font-bold">{post.username}</h2>
                    {post.createdAt && (
                      <span className="text-gray-500 text-sm">
                        {post.createdAt.toDate().toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <p>{post.text}</p>

                {post.image && (
                  <figure className="mt-2">
                    <img src={post.image} alt="Post" className="rounded-lg" />
                  </figure>
                )}

                <div className="mt-4 flex justify-between items-center">
                  <button
                    className={`text-2xl ${
                      post.liked ? "text-red-600" : "text-gray-400"
                    }`}
                    onClick={() => toggleLove(post.id)}
                  >
                    
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                  </button>

                  {user && user.uid === post.uid && (
                    <div className="flex gap-2">
                      <Link
                        to={`/editpost/${post.id}`}
                        className="btn btn-sm text-blue-500 bg-white border-0"
                      >
                       
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                          <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                          <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                        </svg>
                      </Link>
                      <button
                        className="btn btn-sm bg-white border-0 text-red-700"
                        onClick={() => handleDelete(post.id)}
                      >
                   
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                          <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {user && (
        <div className="fixed bottom-4 right-4 z-50">
          <Link
            to="/addpost"
            className="btn btn-circle bg-black text-white shadow-lg text-xl p-8"
          >
            +
          </Link>
        </div>
      )}
    </>
  );
}
