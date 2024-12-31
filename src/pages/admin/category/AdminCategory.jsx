import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { PRODUCT_CATEGORY_URL } from "../../../routes/serverRoutes";
import { MANAGER_ADD_CATEGORY_URL } from "../../../routes/clientRoutes";
const AdminCategory = () => {
  const [name, setName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [categories, setCategories] = useState(null);
  const [fromSearch, setFromSearch] = useState(false);
 
  const token = useSelector(selectCurrentToken)
  useEffect(() => {
    const getProductCategory = async () => {
        try {
            const res = await axios.get(PRODUCT_CATEGORY_URL, {headers: {Authorization: `Bearer ${token}`},withCredentials: true});
            console.log(res?.data);
            setCategories(res?.data);
            setFromSearch(false);
        }catch(err) {
            console.log(err);
        }
    }
    getProductCategory();
  }, [])

  const searchProductCategory = async (e, name) => {
    try { 
        const res = await axios.get(`${PRODUCT_CATEGORY_URL}`, {headers: {Authorization: `Bearer ${token}`}, withCredentials: true});
        
        name ? setCategories(res?.data.filter(el => el.name.toLowerCase().includes(name.toLowerCase()))) : setCategories(res?.data);
        setFromSearch(true);
    }catch(err) {
        console.log(err?.data?.message);
        setErrMsg(err?.data?.message);
    }
  }

  const deleteCategory = async (categoryId) => {    
    try {
        await axios.delete(`${PRODUCT_CATEGORY_URL}/${categoryId}`, {headers: {Authorization: `Bearer ${token}`,withCredentials: true}});
        setCategories(categories.filter(category => category.id !== categoryId));
    }catch(err) {
        console.log(err);
    }
  }

  return (
    <>
    { categories ?

    <section className=" md:ml-[20%] w-[80vw] md:absolute md:left-1/2 md:-translate-x-1/2 mt-28">
        {fromSearch ?  <h1 className=" text-center font-bold py-3 text-white bg-indigo-600 font-mono "> {categories.length} records found </h1>: null}
        
        <div className="mx-1">
            <input onKeyDown={(e)=>(e.key === "Enter" ? searchProductCategory(e,searchId) : null)} placeholder="name" className="w-96 text-lg p-2 h-11 bg-indigo-200 text-gray-700" type="text" value={searchId} onChange={e=>setSearchId(e.target.value)}/>
            <button  onClick={(e) => searchProductCategory(e, searchId)} className="h-11 w-20 p-2 ml-1 text-lg bg-indigo-300 rounded-md text-gray-700 hover:bg-indigo-500 hover:translate-y-[1px] ">Search</button>
            <button className=" m-1 p-3 bg-indigo-300 rounded-md" onClick={(e) => searchProductCategory(e, name)}>Show All</button>
        </div>

        <div className="my-3">
            <Link  to= {MANAGER_ADD_CATEGORY_URL} className=" w-11 h-4 p-2 border text-white shadow rounded-lg bg-indigo-500" >Add a category</Link>
        </div>
        <ul className="md:hidden">
            {categories.map((category,i) => {
                return (
                    <div key={i} className="border-b-2 text-[17px] font-medium py-3">
                        <p className="flex text-gray-800">Name: <span className="ml-2 text-blue-900">{category.name}</span></p>
                        <div className="mt-3">
                            <button ><Link  to= {`/admin/category/edit?categoryId=${category.id}`}  className=" p-3 border shadow rounded-lg bg-green-300" >Modifier</Link> </button>
                            <button onClick={()=>deleteCategory(category.id)} className=" ml-4 p-3 border shadow rounded-lg bg-red-400" >Supprimer</button>
                        </div>                        
                    </div>
                )
            })}          
        </ul>

        <table className=" mx-1 overflow-hidden hidden md:inline  bg-zinc-100 my-3">
            <thead className=" flex border-b-2 border-indigo-200">
                <tr className=" mx-1 flex space-x-40">
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody className="">
             {categories.map((category,i)=> {
                return (
              
                <tr key={i} className=" mx-1 flex space-x-28 my-2 mb-6 border-b-2 ">
                    <td>{category.name}</td>
                    <td><Link  to= {`/admin/category/edit?cooperativeId=${category.id}`}  className=" w-6 h-2 p-2 border shadow rounded-lg bg-green-300" >Edit</Link> </td>
                    <td><button onClick={()=>deleteCategory(category.id)} className=" ml-4 p-3 border shadow rounded-lg bg-red-400" >Delete</button> </td>             
                </tr>
                )
             })}
            </tbody>
        </table>    
    </section>

  : 
  
  <div>
    <h1>No Category Exist yet</h1>
  </div>
  
  }
    </>
  )
}

export default AdminCategory