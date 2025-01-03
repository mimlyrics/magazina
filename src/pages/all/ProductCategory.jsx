import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import BASE_URL, { SUBCATEGORY_URL } from "../../routes/serverRoutes";
import { PRODUCTS_URL } from "../../routes/clientRoutes";
import defaultImage from "../../../public/vite.svg"; // Path to your default image
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../slices/auth/authSlice";
import { motion } from "framer-motion";

const ProductCategory = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const token = useSelector(selectCurrentToken());

  // Parse the hash manually to extract the query parameters
  const hashParams = location.hash.split('?')[1]; // Get everything after '?'
  const { category } = queryString.parse(hashParams || ''); // Parse the category from the hash query string

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!category) {
        setErrMsg("No category specified.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(SUBCATEGORY_URL, {
          params: { categoryName: category },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setSubcategories(res?.data[0].productCategories || []);
        setErrMsg("");
      } catch (err) {
        setErrMsg(err?.response?.data?.error || "Failed to fetch subcategories");
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [category, token]); // Include token in dependencies to ensure it is available

  return (
    <div className="bg-indigo-100 min-h-screen p-6">
      {/* Parent Category Title */}
      <div className="text-center text-white bg-indigo-500 p-4 rounded-lg mb-6">
        <h1 className="text-2xl md:text-4xl font-bold">
          {category ? `${category.toUpperCase()}` : "Select a Category"}
        </h1>
      </div>

      {loading ? (
        // Loading State
        <div className="text-center text-indigo-800 font-bold">
          <p>Loading...</p>
        </div>
      ) : errMsg ? (
        // Error Message
        <div className="text-red-500 text-center mb-4">
          <p>{errMsg}</p>
        </div>
      ) : (
        // Subcategories Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subcategories.map((subcategory, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white shadow-lg rounded-lg cursor-pointer hover:bg-indigo-600 p-4 flex flex-col items-center transition hover:shadow-xl"
            >
              <Link
                to={`${PRODUCTS_URL}?categoryx=${subcategory.name}`}
                className="flex flex-col items-center"
              >
                <img
                  src={
                    subcategory.imageUrl
                      ? `${BASE_URL}/${subcategory.imageUrl}`
                      : defaultImage
                  }
                  className="w-32 h-32 object-cover rounded-full border-4 border-indigo-200"
                />
                <h2 className="text-lg font-semibold text-indigo-800 mt-4 text-center">
                  {subcategory.name || "Unnamed Subcategory"}
                </h2>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
