import React from 'react'
import axios from '../../../api/axios';
import { selectCurrentUser, selectCurrentToken } from '../../../slices/auth/authSlice';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { USERS_URL } from '../../../routes/serverRoutes';
import { Link } from 'react-router-dom';
import AdminAddSupplier from '../supplier/AdminAddSupplier';
const AdminUser = () => {

    const [users, setUsers] = useState(null);
    const token = useSelector(selectCurrentToken);
    const [errMsg, setErrMsg] = useState("");
    useEffect(() => {
        const getUsers = async () => {
            try {
            const res = await axios.get(USERS_URL, {headers: {Authorization: `Bearer ${token}`}});
            console.log(res?.data);
            setUsers(res?.data);
            }catch(err) {
                setErrMsg(err?.response?.data?.error);
            }
        }
        getUsers();
    }, [])

    const deleteUser = async (id) => {
        try {
            const res = await axios.delete(`${USERS_URL}/${id}`, {headers: {"Content-Type": "application/json", "Authorization": `Bearer: ${token}`}, withCredentials:true});
            setUsers(users.filter(user=> user.id !== id));
        }catch(err) {
            setErrMsg(err?.data);
        }

    }

    const promoteUser = (id) => {
        console.log("Yep");
        return <AdminAddSupplier token={token} userId={id}/>
    }



  return (
    <div className=' mx-1 md:ml-[20%] mr-[8%]  bg-slate-50'>

        <div className= ' bg-indigo-600 text-white p-3 text-xl text-center'>
            <p>Manage Users</p>
        </div>

        <div className='overflow-x-auto'>
            {users ?
            <table className='table-auto w-full'>
                <thead className='bg-gray-100'>
                    <tr>
                        <th className=''>firstname</th>
                        <th className='px-4 py-2'>lastname</th>
                        <th className='px-4 py-2'>Email</th>
                        <th className='px-4 py-2'> Phone</th> 
                    </tr>

                </thead>
                <tbody>
                    {users.map((user, i) => (
                        <tr className='border' key={user.id}>
                            <td className='px-4 py-2'>{user.firstname}</td>
                            <td className='px-4 py-2'>{user.lastname}</td>
                            <td className='px-4 py-2'>{user.email}</td>
                            <td className='px-4 py-2'>{user.phone}657899000</td>     
                            <td><Link  to= {`/admin/user/edit?userId=${user.id}`}  className=" w-6 h-2 p-2 border shadow rounded-lg bg-green-300" >Edit</Link> </td>
                            <td><button onClick={()=>deleteUser(user.id)} className=" ml-4 p-3 border shadow rounded-lg bg-red-400" >Delete</button> </td> 
                            <td><Link to={`/admin/suppliers/add?userId=${user?.id}`} state={{ user, token }}  className=" w-6 h-2 p-2 border shadow rounded-lg bg-indigo-300" >Promote</Link> </td>   
                        </tr>
                    ))}
                </tbody>
            </table>:
            
            <div className='h-40 bg-slate-100 text-xl text-center font-extralight font-sans'>
                <p>No User exist yet</p>
            </div>}
        </div>

    </div>
  )
}

export default AdminUser
