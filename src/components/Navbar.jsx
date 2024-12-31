import React, { useEffect } from 'react';
import { MdCalendarViewDay, MdCancel, MdOutlineMenu, MdSettingsApplications } from 'react-icons/md';
import { FiShoppingCart } from 'react-icons/fi';
import { MdChat, MdKeyboardArrowDown } from 'react-icons/md';
import { MdNotificationsActive } from 'react-icons/md';
import { useStateContext } from '../contexts/ContextProvider';
import { Cart, Chat, Map, Notification, Settings, UserProfile } from './';
import { selectCurrentUser } from '../slices/auth/authSlice.js';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/auth/authSlice.js'; // Import the logout action
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ViewCart from './ViewCart.jsx';

import { clearLocation, selectCurrentLocation} from '../slices/location/locationSlice.js';

const NavButton = ({ title, customFunc, icon, color, dotColor, value }) => (
  <div>
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex text-2xl rounded-full h-2 w-2 right-2 top-2"
      ></span>
      {icon}
      {value}
    </button>
  </div>
);

const Navbar = () => {
  const location = useSelector(selectCurrentLocation);
  console.log(location);
  const { cart } = useStateContext();
  const { activeMenu, setActiveMenu, isClicked, handleClick, screenSize } = useStateContext();
  const userInfo = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Dispatch logout action
    dispatch(logout());
    dispatch(clearLocation());
    //dispatch({type: 'CLEAR_CART'});
  };

  return (
    <>
    <div className="flex justify-between p-4 mb-3 md:mx-6 relative bg-indigo-900 text-white shadow-lg rounded-xl">
      {/* Menu Button */}
      <NavButton
        className="flex"
        dotColor="#03C9D7"
        title="Menu"
        color="white"
        value={0}
        customFunc={() => setActiveMenu(!activeMenu)}
        icon={activeMenu ? <MdCancel /> : <MdOutlineMenu />}
      />

      <div className="flex space-x-4">
        {/* Cart, Chat, Notifications */}
        <NavButton
          className="flex"
          dotColor="#03C9D7"
          title="Cart"
          color="white"
          value={cart.items.length}
          icon={<FiShoppingCart />}
          customFunc={() => handleClick('cart')}
        />
        <NavButton
          className="flex"
          dotColor="#03C9D7"
          title="Chat"
          color="white"
          value={0}
          icon={<MdChat />}
          customFunc={() => handleClick('chat')}
        />
        <NavButton
          className="flex"
          dotColor="#03C9D7"
          title="Notifications"
          color="white"
          value={0}
          icon={<MdNotificationsActive />}
          customFunc={() => handleClick('notification')}
        />
        <NavButton
          className="flex"
          dotColor="red"
          title="settings"
          color="white"
          icon={<MdSettingsApplications/>}
          customFunc={()=> handleClick('settings')}
        />
      </div>

      {/* User Profile Section */}
      <div className="flex items-center space-x-4">
        {userInfo ? (
          <div className="flex items-center space-x-3">
            <motion.div
              className="bg-indigo-500 p-2 rounded-full cursor-pointer hover:bg-indigo-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link to={`/profile`} className="text-white font-semibold">
                {userInfo.firstname.substring(0, 2)} {/* Showing first 2 characters of first name */}
              </Link>
            </motion.div>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="bg-indigo-500 px-4 py-2 rounded-lg text-white hover:bg-indigo-600 transition duration-300">
            Login
          </Link>
        )}
      </div>


    </div>
    {location ? null: <Map/>}

    <div className='flex flex-row-reverse fixed top-0 right-2 z-50'>
      {/** Modals for Cart, Chat, Notification, User Profile */}
      {isClicked.cart && <ViewCart />}
      {isClicked.settings && <Settings/>}
      {isClicked.notification && <Notification />}
      {isClicked.userProfile && <UserProfile />}


    </div>
    </>
  );
};

export default Navbar;
