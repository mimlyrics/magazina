import { useParams } from "react-router-dom"; // Import useParams
import { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { STOCK_URL, STATUS_URL, PRODUCT_URL } from "../../../routes/serverRoutes";
import { MANAGER_PRODUCTS_URL } from "../../../routes/clientRoutes";

const AdminEditStock = () => {
  const { stockId } = useParams(); // Get productId and stockId from URL params
  const [stock, setStock] = useState({
    quantity: "",
    reorderLevel: "",
    status: "",
    sku: "",
    stockId: stockId, // Initialize with the productId from the URL
  });
  const [statuses, setStatuses] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const token = useSelector(selectCurrentToken);

  // Fetch the product details

  // Fetch the existing stock details
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get(`${STOCK_URL}/${stockId}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setStock(response.data); // Set the stock data to prepopulate the form
      } catch (error) {
        setErrMsg("Failed to load stock details");
      }
    };

    if (stockId) {
      fetchStock();
    }
  }, [stockId, token]);

  // Fetching statuses for the stock
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axios.get(STATUS_URL, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setStatuses(response.data || []);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    fetchStatuses();
  }, [token]);

  // Handling input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStock((prev) => ({ ...prev, [name]: value }));
  };

  // Handling form submission for updating stock
  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 5);
    try {
      const response = await axios.put(`${STOCK_URL}/${stockId}`, {
        quantity: stock.quantity,
        reorderLevel: stock.reorderLevel,
        status: stock.status,
        sku: stock.sku,
        stock: { id: stock.stockId },
      }, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response) {
        setSuccess("Stock updated successfully");
        setErrMsg(false);
        setTimeout(() => {
          setSuccess(false);
          window.location.href = `${MANAGER_PRODUCTS_URL}`;
        }, 2000);
      }
    } catch (err) {
      setErrMsg(err?.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <section className="mx-2">
      <div className="text-2xl text-center mb-4">Edit Stock for Stock ID: {stockId}</div>

      {errMsg && <div className="animate-bounce text-red-600 font-semibold mb-4">{errMsg}</div>}
      {success && <div className="animate-bounce text-indigo-600 font-semibold mb-4">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Stock Fields */}
        <div className="my-3">
          <label htmlFor="quantity" className="block text-lg">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={stock.quantity}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="my-3">
          <label htmlFor="reorderLevel" className="block text-lg">Reorder Level</label>
          <input
            type="number"
            id="reorderLevel"
            name="reorderLevel"
            value={stock.reorderLevel}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="my-3">
          <label htmlFor="status" className="block text-lg">Status</label>
          <select
            name="status"
            id="status"
            value={stock.status}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Status</option>
            {statuses.map((status) => (
              <option key={status.name} value={status.name}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="my-3">
          <label htmlFor="sku" className="block text-lg">SKU</label>
          <input
            type="text"
            id="sku"
            name="sku"
            autoComplete="off"
            value={stock.sku}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Read-Only Product Details 
        {product && (
          <div className="mt-6 border-t pt-4">
            <div className="my-3">
              <label className="block text-lg">Product Name</label>
              <input
                type="text"
                value={product.name}
                className="w-full p-2 border rounded-md bg-gray-200"
                readOnly
              />
            </div>

            <div className="my-3">
              <label className="block text-lg">Product Price</label>
              <input
                type="text"
                value={product.price}
                className="w-full p-2 border rounded-md bg-gray-200"
                readOnly
              />
            </div>

            <div className="my-3">
              <label className="block text-lg">Product Description</label>
              <textarea
                value={product.description}
                className="w-full p-2 border rounded-md bg-gray-200"
                readOnly
              />
            </div>

            <div className="my-3">
              <label className="block text-lg">Product Category</label>
              <input
                type="text"
                value={product.productCategory?.name || "No Category"}
                className="w-full p-2 border rounded-md bg-gray-200"
                readOnly
              />
            </div>
          </div>
        )}*/}

        {/* Submit Button */}
        <div className="my-4 text-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md"
          >
            Update Stock
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminEditStock;