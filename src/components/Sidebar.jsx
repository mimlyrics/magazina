import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import { MdShop } from 'react-icons/md';
import {MdOutlineCancel} from 'react-icons/md';
import { MdApps, MdContacts} from 'react-icons/md';
import { links } from '../data/dummy.jsx';
import { FiHome, FiScissors } from 'react-icons/fi';
import { useStateContext } from '../contexts/ContextProvider.jsx';

const Sidebar = () => {
  const {activeMenu, setActiveMenu, screenSize} = useStateContext();


  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';
  const handleCloseSidebar = () => {
    if(activeMenu && screenSize <=900 ) {
      setActiveMenu(false);
    } 
  }
  return (
    <div className='ml-3 bg-indigo-100 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10'>
    
      {activeMenu && (
        <>
        <div className='flex justify-between items-center'>
          <Link onClick={handleCloseSidebar} to='/' className='items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900'>
            <MdShop/> <span>Magazina</span>

            <button
              onClick={()=>setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
              className='' type='button'><MdOutlineCancel/></button>
          </Link>
        </div> 

        <div className='mt-10'>

          <div className='flex space-x-6'>
            <FiHome/>
            <Link to="/">Home</Link>
          </div>
          {links.map((item) => (
            <div key={item.title} >
              <p className='text-gray-400 m-3 mt-4 uppercase'>{item.title}</p>
              {item.links.map(link => (
                <NavLink 
                  to={`${link.baseUrl}/${link.name}`} key={link.name} 
                  onClick={handleCloseSidebar}
                  className={({isActive}) => isActive ? activeLink : normalLink}>
                    {link.icon}
                    <span className='capitalize'>{link.name}</span>
                  </NavLink>
              ))}
              
            
            </div>
          ))}
        </div>


        </>
      )}
    </div>
  )
}

export default Sidebar
