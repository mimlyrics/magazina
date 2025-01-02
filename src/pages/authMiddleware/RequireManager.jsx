import {useState, useEffect} from "react";
import { selectCurrentToken } from "../../slices/auth/authSlice";
import { useSelector } from "react-redux";
import { Navigate, useLocation, Link } from "react-router-dom";
import { Outlet } from "react-router";
import axios from "../../api/axios";
const PROTECT_MANAGER_URL = `${BASE_URL}/api/v1/protected/get-role`;
import ErrorMiddleware from "./ErrorMiddleware";
import BASE_URL from "../../routes/serverRoutes";
const RequireManager = () => {
  const token = useSelector(selectCurrentToken);
  const [errMsg, setErrMsg] = useState("");
  const [isManager, setIsManager] = useState(false);
  const [statusCode, setStatusCode] = useState("404");
  console.log(token);
  console.log(JSON.parse(localStorage.getItem('userInfo')))
  useEffect(() => {
    const detAdmin = async  () => {
        try {
            const res = await axios.get(PROTECT_MANAGER_URL, 
                {headers: {withCredentials: true, Authorization: `Bearer ${token}`}});
            console.log(res.data);
            setIsManager(res.data);
        }catch(err) {
            //console.log(err);
            setStatusCode(404)
            setErrMsg("Not connected to the internet");
        }
    }
    detAdmin();
  }, [])
  return (
    <div>
        {isManager === "MANAGER" || isManager === "ADMIN" ? 
            <Outlet/> :
            <ErrorMiddleware key={errMsg} statusCode={statusCode} errMsg={errMsg} />
        }  
    </div>
  )
}

export default RequireManager