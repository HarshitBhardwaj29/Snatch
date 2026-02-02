import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../assets/image.png';

function Admin() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category', category);
    formData.append('productimage', image);

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/admin`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      setMessage('✅ Product created successfully!');
      console.log(data);
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error(error);
      setMessage(`❌ ${error.response?.data?.message || 'Error creating product'}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 shadow-lg rounded-lg overflow-hidden bg-base-100" data-theme="cupcake">
      <div
        className="h-40 bg-cover bg-center"
        style={{
          height: "200px",
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="h-full bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white">Add New Product</h1>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
            required
          />

          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input input-bordered w-1/2"
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="input input-bordered w-1/2"
              required
            />
          </div>

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input input-bordered w-full"
            required
          />

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="file-input file-input-bordered"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2">
            Add Product
          </button>
        </form>

        {message && (
          <div className="mt-4 p-2 text-center font-semibold">
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/home')}
            className="btn btn-outline btn-accent"
          >
            🔙 Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
