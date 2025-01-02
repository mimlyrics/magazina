import { useState, useEffect } from "react";
import { selectCurrentToken } from "../../slices/auth/authSlice";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import axios from "../../api/axios";
import BASE_URL from "../../routes/serverRoutes";
import ErrorMiddleware from "./ErrorMiddleware";

// Define the endpoint to get user role
const PROTECT_MANAGER_URL = `${BASE_URL}/api/v1/protected/get-role`;

const RequireManager = () => {
  const token = useSelector(selectCurrentToken);  // Get token from Redux store
  const [errMsg, setErrMsg] = useState("");  // To store error message
  const [isManager, setIsManager] = useState(null);  // To store role status (null initially)
  const [statusCode, setStatusCode] = useState(null);  // To store HTTP status code

  useEffect(() => {
    const detectRole = async () => {
      try {
        const res = await axios.get(PROTECT_MANAGER_URL, {
          headers: { withCredentials: true, Authorization: `Bearer ${token}` }
        });

        setIsManager(res.data);  // Assuming res.data is the role (e.g., "MANAGER")
      } catch (err) {
        // Handling error, set status code and error message
        setStatusCode(err?.response?.status || 500);  // Set error status code
        setErrMsg(err?.response?.data?.error || "Not connected to the internet");
      }
    };

    if (token) {
      detectRole();  // Call function to check role if token exists
    }
  }, [token]);  // Dependency on token, run again if token changes

  // If role check is still in progress, show loading state
  if (isManager === null) {
    return <div>Loading...</div>;
  }

  // Render protected content if the user is a manager
  if (isManager === "MANAGER") {
    return <Outlet />;
  }

  // Show Unauthorized error if the user is not a manager
  return (
    <ErrorMiddleware
      statusCode={statusCode || 401}  // Default to 401 if status code is not set
      key={errMsg}
      errMsg={errMsg || "Unauthorized"}
    />
  );
};

export default RequireManager;
