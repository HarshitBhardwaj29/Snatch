import React from 'react';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar({ search, setSearch, category, setCategory }) {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/logout`, {}, { withCredentials: true });
      console.log("done");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to log out. Please try again.");
    }
  };

  const showcart = () => {
    try {
      navigate("/cart");
    } catch (error) {
      console.log("can't show cart", error);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-xl rounded-2xl w-full flex-wrap gap-2" data-theme="cupcake">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">Snatch</a>
  </div>

  <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-end w-full md:w-auto">
    <input
      type="text"
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="input input-bordered w-28 md:w-40"
    />

    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="select select-bordered w-28 md:w-40"
    >
      <option value="">All Categories</option>
      <option value="electronics">Electronics</option>
      <option value="clothing">Clothing</option>
      <option value="sports">Sports</option>
    </select>


    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        🛒
      </div>
      <div tabIndex={0} className="card card-compact dropdown-content bg-base-100 z-10 mt-3 w-52 shadow">
        <div className="card-body">
          <span className="text-lg font-bold">Items: {cartItems.length}</span>
          <span className="text-info">Subtotal: ₹
            {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}
          </span>
          <div className="card-actions">
            <button onClick={showcart} className="btn btn-primary btn-block">View cart</button>
          </div>
        </div>
      </div>
    </div>
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Profile avatar"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          />
        </div>
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li onClick={logout}><a>Logout</a></li>
      </ul>
    </div>
  </div>
</div>

  );
}

export default Navbar;
