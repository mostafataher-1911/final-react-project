import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/config"; 

export default function EditPost() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [imageData, setImageData] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id); 
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setText(data.text || "");
          setImageData(data.image || "");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        navigate("/");
      }
    };

    fetchPost();
  }, [id, navigate]);


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
    try {
      const docRef = doc(db, "posts", id);
      await updateDoc(docRef, {
        text,
        image: imageData,
      });
      navigate("/");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Edit your post..."
          className="w-full border p-3 rounded"
          rows={4}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imageData && (
          <img
            src={imageData}
            alt="preview"
            className="rounded-lg max-h-64 w-auto"
          />
        )}
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
