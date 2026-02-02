import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { MdDashboard, MdLogout, MdNotifications, MdOutlineMessage, MdOutlineSettings } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { BsMenuButtonFill } from "react-icons/bs";
import { AiFillProduct } from "react-icons/ai";
import { FaCartArrowDown, FaUser } from "react-icons/fa";
import { SiSinglestore,SiRazorpay } from "react-icons/si";
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState(null);


    const toggleSubmenu = (index) => {
        setActiveTab(activeTab === index ? null : index);
    };


    return (
        <>
            <div className='sidebar'>
                <ul>
                    <li>
                        <Link to="/">
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
                            <span className='icon'><BsMenuButtonFill /></span>
                            Category
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 1 ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="/category/list">Category List</Link></li>
                                <li><Link to="/category/add">Category Add</Link></li>
                            </ul>
                        </div>
                    </li>

                    <li>
                        <Button className={`w-100 ${activeTab === 2 ? 'active' : ''}`}
                            onClick={() => toggleSubmenu(2)}>
                            <span className='icon'><AiFillProduct /></span>
                            Products
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 2 ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="/product/list">Product List</Link></li>
                                <li><Link to="/product/details">Product View</Link></li>
                                <li><Link to="/product/upload">Product Upload</Link></li>
                            </ul>
                        </div>
                    </li>

                    <li>
                        <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}`}
                            onClick={() => toggleSubmenu(3)}>
                            <span className='icon'><SiSinglestore /></span>
                            Products Varients
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 3 ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="/product/varient/list">Product varient List</Link></li>

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
                        <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}`}
                            onClick={() => toggleSubmenu(5)}>
                            <span className='icon'><SiRazorpay /></span>
                            Payments
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 5 ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="/payment-details">Payment Details</Link></li>

                            </ul>
                        </div>
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