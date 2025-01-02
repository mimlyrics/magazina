import {useState, useEffect} from "react";
import { selectCurrentToken } from "../../slices/auth/authSlice";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import axios from "../../api/axios";
import ErrorMiddleware from "./ErrorMiddleware";
import BASE_URL from "../../routes/serverRoutes";
const PROTECT_ADMIN_URL = `${BASE_URL}/api/v1/protected/get-role`
const RequireAdmin = () => {
  const token = useSelector(selectCurrentToken);
  const [errMsg, setErrMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [statusCode, setStatusCode] = useState("404");
  //console.log("token: ", token);
  useEffect(() => {
    const detAdmin = async  () => {
        try {
            const res = await axios.get(PROTECT_ADMIN_URL, 
                {headers: {withCredentials: true, Authorization: `Bearer ${token}`}});
            console.log(res.data);
            setIsAdmin(res.data);
        }catch(err) {
            //console.log(err?.data);
            setErrMsg(err?.response?.data?.error);
        }
    }
    detAdmin();
  }, [token])
  return (
    <div>
        {isAdmin == "ADMIN" ? 
            <Outlet/> :
            <ErrorMiddleware  statusCode={statusCode} key={errMsg} errMsg={errMsg} />
        }  
    </div>
  )
}

export default RequireAdmin
