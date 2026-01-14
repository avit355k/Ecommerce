import React, { useContext, useState } from 'react'
import Button from '@mui/material/Button';
import { MdDashboard, MdOutlineMessage, MdNotifications, MdOutlineSettings, MdLogout } from "react-icons/md";
import { FaAngleRight, FaAngleDown } from "react-icons/fa6";
import { AiFillProduct } from "react-icons/ai";
import { FaCartArrowDown, FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { Mycontext } from '../../App';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const context = useContext(Mycontext);

  const toggleSubmenu = (index) => {
    setActiveTab(activeTab === index ? null : index);
  };


  return (
    <>
      <div className='sidebar'>
        <ul>
          <li>
            <Link to="/" >
              <Button className='w-100'>
                <span className='icon'><MdDashboard /></span>
                Dashboard
                <span className='arrow'><FaAngleRight /></span>
              </Button>
            </Link>
          </li>
          <li>

            <Button className={`w-100 ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => toggleSubmenu(1)}>
              <span className='icon'><AiFillProduct /></span>
              Products
              <span className='arrow'><FaAngleRight /></span>
            </Button>
            <div className={`submenuWrapper ${activeTab === 1 ? 'colapse' : 'colapsed'}`}>
              <ul className='submenu'>
                <li><Link to="#">Product List</Link></li>
                <li><Link to="#">Product View</Link></li>
                <li><Link to="#">Product Upload</Link></li>
              </ul>
            </div>
          </li>
          <li>
            <Button className='w-100'>
              <span className='icon'><FaCartArrowDown /></span>
              Orders
              <span className='arrow'><FaAngleRight /></span>
            </Button>
          </li>
          <li>
            <Button className='w-100'>
              <span className='icon'><MdOutlineMessage /></span>
              Messages
              <span className='arrow'><FaAngleRight /></span>
            </Button>
          </li>
          <li>
            <Button className='w-100'>
              <span className='icon'><MdNotifications /></span>
              Notifications
              <span className='arrow'><FaAngleRight /></span>
            </Button>
          </li>
          <li>
            <Button className='w-100'>
              <span className='icon'><MdOutlineSettings /></span>
              Settings
              <span className='arrow'><FaAngleRight /></span>
            </Button>
          </li>
          <li>
            <Button className='w-100'>
              <span className='icon'><FaUser /></span>
              Log In
              <span className='arrow'><FaAngleRight /></span>
            </Button>
          </li>
          <li>
            <Button className='w-100'>
              <span className='icon'><FaUser /></span>
              Sign Up
              <span className='arrow'><FaAngleRight /></span>
            </Button>
          </li>
          <li>
            <Button className='w-100'>
              <span className='icon'><MdLogout /></span>
              Dashboard
              <span className='arrow'><FaAngleRight /></span>
            </Button>
          </li>
          <li>
            <Button className='w-100'>
              <span className='icon'><MdDashboard /></span>
              Dashboard
              <span className='arrow'><FaAngleRight /></span>
            </Button>
          </li>
          <li>
            <Button className='w-100'>
              <span className='icon'><MdDashboard /></span>
              Dashboard
              <span className='arrow'><FaAngleRight /></span>
            </Button>
          </li>
          <li>
            <Button className='w-100'>
              <span className='icon'><MdDashboard /></span>
              Dashboard
              <span className='arrow'><FaAngleRight /></span>
            </Button>
          </li>
          <li>
            <Button className='w-100'>
              <span className='icon'><MdDashboard /></span>
              Dashboard
              <span className='arrow'><FaAngleRight /></span>
            </Button>
          </li>
        </ul>
        <div className='logoutWrapper'>
          <div className='logoutBox'>
            <Button className='w-100'>
              <span className='icon'><MdLogout /></span>
              Logout
              <span className='arrow'><FaAngleRight /></span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar