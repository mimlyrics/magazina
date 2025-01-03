import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { SUPPLIER_URL } from "../../../routes/serverRoutes";
import {useParams} from "react-router-dom";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { useSelector } from "react-redux";
const AdminAddSupplier = () => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [taxId, setTaxId] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState("");

    /*const location = useLocation();
    console.log(location.state)
  const { user, token } = location.state || {}; // Destructure user and token from location.state
  const userid = user?.id; 
    console.log(token, user, userid);*/
    const {id} = useParams();
    const token = useSelector(selectCurrentToken());

    const handlePromotion = async () => {
        console.log(name, address, taxId);
        try {
            const response = await axios.put(
                `${SUPPLIER_URL}/promote/${userid}`,
                { name, address, taxId },
                { headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true }
            );
            console.log(response);
            alert(response.data);
        } catch (err) {
            console.error(err);
            alert(err.response.data || "Error promoting user to supplier");
        }
    };

    return (
        <div>
            <h2 className="text-center text-lg p-2">Promote User to Supplier</h2>
    {/** Get videos to post */}
            <div className=" p-2 mx-1 my-2 bg-gradient-to-r from-[rgba(0,120,120,0.1)] to-[rgba(0,100,150,0.3)] "
                >
          
                  {errMsg ? <div className="font-serif text-xl text-red-800 font-semibold"><h1>{errMsg}</h1></div> : null}
                  {success ? <div className=" animate-bounce font-serif text-xl text-teal-800 font-semibold"><h1>{success}</h1></div> : null}
                  
              <div className="my-2 md:my-3 ">
                  <label htmlFor="title">Name</label>
                  <input className=" rounded-md shadow-sm px-2 py-2
                  md:py-3  w-[80%] block focus:outline 
                  focus:outline-[0.16rem] outline-sky-300
                  border-sky-300 " type="text" value={name} 
                  onChange={e=> setName(e.target.value)}  
                  />
              </div>

              <div className="my-2 md:my-3 ">
                  <label htmlFor="title">Address</label>
                  <input className=" rounded-md shadow-sm px-2 py-2
                  md:py-3  w-[80%] block focus:outline 
                  focus:outline-[0.16rem] outline-sky-300
                  border-sky-300 " type="text" value={address} 
                  onChange={e=> setAddress(e.target.value)}  
                  />
              </div>


              <div className="my-2 md:my-3 ">
                  <label htmlFor="title">Tax Id</label>
                  <input className=" rounded-md shadow-sm px-2 py-2
                  md:py-3  w-[80%] block focus:outline 
                  focus:outline-[0.16rem] outline-sky-300
                  border-sky-300 " type="text" value={taxId} 
                  onChange={e=> setTaxId(e.target.value)}  
                  />
              </div>


              <div className="my-2 md:my-3 ">
                  <label htmlFor="title">Email</label>
                  <input className=" rounded-md shadow-sm px-2 py-2
                  md:py-3  w-[80%] block focus:outline 
                  focus:outline-[0.16rem] outline-sky-300
                  border-sky-300 " type="text" value={user.email} 
                  readOnly
                  />
              </div>


              <div className="my-2 md:my-3 ">
                  <label htmlFor="title">Full name</label>
                  <input className=" rounded-md shadow-sm px-2 py-2
                  md:py-3  w-[80%] block focus:outline 
                  focus:outline-[0.16rem] outline-sky-300
                  border-sky-300 " type="text" value={`${user.firstname} ${user.lastname}`}  
                  onChange={e=> setTaxId(e.target.value)}  
                  readOnly
                  />
              </div>


              <div className="my-2 md:my-3 ">
                  <label htmlFor="title">Phone</label>
                  <input className=" rounded-md shadow-sm px-2 py-2
                  md:py-3  w-[80%] block focus:outline 
                  focus:outline-[0.16rem] outline-sky-300
                  border-sky-300 " type="text" value={user.phone} 
                  readOnly
                  />

          
              </div>


              <div onClick={(e) => handlePromotion(e)} className="w-48 my-2 md:my-1 ">
                <button className=" p-2 w-40 text-lg animation delay-150 duration-300 
                  border rounded-md shadow-sm bg-slate-100 hover:bg-slate-400 
                  hover:translate-y-[2px]" 
                  type="submit">Promote
                </button>
              </div>



      </div>   
        </div>
    );
};

export default AdminAddSupplier;

