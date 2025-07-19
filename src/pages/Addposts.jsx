import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../Firebase/config"; 
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

export default function AddPost() {
  const [text, setText] = useState("");
  const [imageData, setImageData] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({
            username: docSnap.data().username,
            photo: docSnap.data().photo,
          });
        }
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!text && !imageData) return;

  if (!user) {
    alert("User data not loaded yet");
    return;
  }

  try {
    await addDoc(collection(db, "posts"), {
      text,
      image: imageData,
      liked: false,
      createdAt: Timestamp.now(),
      uid: auth.currentUser.uid,
      username: user.username,
      photoURL: user.photo || "",
    });

    setText("");
    setImageData("");
    navigate("/");
  } catch (error) {
    console.error("Error adding post: ", error);
  }
};
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something..."
          className="w-full border p-3 rounded"
          rows={4}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
          {imageData && <img src={imageData} alt="preview" className="rounded-lg" />}
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Post
        </button>
      </form>
    </div>
  );
}
