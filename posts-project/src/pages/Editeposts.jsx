import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [imageData, setImageData] = useState("");

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const post = posts.find((p) => p.id === parseInt(id));

    if (post) {
      setText(post.text);
      setImageData(post.image);
    } else {
      navigate("/"); 
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const updatedPosts = posts.map((p) =>
      p.id === parseInt(id)
        ? { ...p, text, image: imageData }
        : p
    );
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    navigate("/");
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
        {imageData && <img src={imageData} alt="preview" className="rounded-lg" />}
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
