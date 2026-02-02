import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/home`, {
        params: { search, category, page },
        withCredentials: true,
      });
      setProducts(response.data.data.products);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, category, page]);

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <div data-theme="cupcake" className="min-h-screen">
      <Navbar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      <div className="p-4">
        {user?.role === "admin" && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300"
            >
            👑 Admin Dashboard
            </button>
          </div>
        )}

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="btn btn-outline"
              >
                ⬅️ Prev
              </button>

              <span className="self-center">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={handleNext}
                disabled={page === totalPages}
                className="btn btn-outline"
              >
                Next ➡️
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-lg mt-10">No products found.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
