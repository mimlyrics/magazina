import React, {useState, useEffect } from 'react'
import { PRODUCT_CATEGORY_URL } from '../routes/serverRoutes'
import axios from '../api/axios';
import ELECTRONIC_PNG from '../assets/category/electronics.jpg';
import { Link } from 'react-router-dom';
const Home = () => {
    const [categories, setCategories] = useState(null);
    const [errMsg, setErrMsg] = useState();
    useEffect(() => {
        const getCategory = async () => {
            try {
                const res = await axios.get(PRODUCT_CATEGORY_URL, {headers: {"Content-Type": "application/json"}, withCredentials: true});
                setCategories(res?.data);
            }catch(err) {
                setErrMsg(err?.response?.data?.error);
            }
        }

        getCategory();
    }, [])


  return (
    <div className='md:ml-[32%] xl:ml-[23%]'>
        
        <div className=' mx-2 text-teal-800 text-lg md:text-2xl '>
            <input type="text" placeholder='search..' className='border rounded-lg  w-[75%] p-3 md:p-5 outline-2 outline-sky-300'/>
            <button className='shadow-sky-400 p-3 md:p-5 text-white border bg-sky-500 w-[20%] shadow-md rounded-lg px-7'>Search</button>
        </div>

        <div className='grid grid-cols-3 md:grid-cols-5 xl:grid-cols-7 w-full gap-4 p-5'>
            {
                categories ? categories.map(category => (
                    <div key={category.id}>
                        <div  className=' bg-slate-100 h-40 text-center cursor-pointer hover:bg-slate-300 '>
                            <div>
                                <img src={ELECTRONIC_PNG}/>
                                <Link to={`/products?categoryx=${category.id}`} >{category.name}</Link>
                            </div>
                        </div>
                    </div>
                )) : null
            }
        </div>
    </div>
  )
}

export default Home
