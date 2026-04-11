import React, {useContext, useEffect, useState} from 'react';

import DashboardBox from './component/DashboardBox';
import Graphbox from './component/Graphbox';
import RevenueGraph from "./component/RevenueGraph";
import LowStockProduct from "./component/LowStockProduct";
import RecentOrder from "./component/RecentOrder";
import OrderStatus from "./component/OrderStatus";

import { FaShoppingBag, FaUserCircle} from "react-icons/fa";
import { MdShoppingCart} from "react-icons/md";
import {TbStars} from "react-icons/tb";

import {Mycontext} from "../../App";
import API from "../../services/api";


const Dashboard = () => {
    const context = useContext(Mycontext);

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
    });
    const [topSales, setTopSales] = useState([]);

    // Fetch Dashboard Data
    const fetchDashboardData = async () => {
        try {
            const res = await API.get("/api/dashboard/");
            if (res.data.status === "success") {
                setStats(res.data.data);
            }
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        }
    };

    //Fetch TopSales Data
    const fetchTopSales = async () => {
        try {
            const res = await API.get("/api/dashboard/top-sales/");
            if (res.data.status === "success") {
                setTopSales(res.data.data.topProducts);
            }
        }catch (error) {
            console.error("Dashboard fetch error:", error);
        }
    };

    useEffect(() => {
        context.setisHideSidebarHeader(false);
        fetchDashboardData();
        fetchTopSales();
    }, [context]);

    return (
        <div className="right-content w-100">

            {/* DASHBOARD BOXES */}
            <div className="row dashboardBoxWrapperRow align-items-stretch">
                <div className="col-md-7">
                    <div className="dashboardBoxWrapper d-flex">
                        <DashboardBox
                            title="Total Users"
                            value={stats.totalUsers}
                            color={['#4CAF50', '#8BC34A']}
                            icon={<FaUserCircle/>}
                        />
                        <DashboardBox
                            title="Total Orders"
                            value={stats.totalOrders}
                            color={['#9C27B0', '#E91E63']}
                            icon={<MdShoppingCart/>}
                        />
                        <DashboardBox
                            title="Total Products"
                            value={stats.totalProducts}
                            color={['#2196F3', '#64B5F6']}
                            icon={<FaShoppingBag/>}
                        />

                        <DashboardBox
                            title="Total Revenue"
                            value={`₹${stats.totalRevenue}`}
                            color={['#FFC107', '#FF9800']}
                            icon={<TbStars/>}
                        />
                    </div>
                </div>

                <div className="col-md-5 pl-0 d-flex">
                    <div className="dashboardBoxWrapper w-100">
                            <Graphbox />
                    </div>
                </div>
            </div>

            {/* REVENUE + LOW STOCK */}
            <div className="row dashboardBoxWrapperRow align-items-stretch mt-3">
                <div className="col-md-7">
                    <RevenueGraph />
                </div>

                <div className="col-md-5">
                    <LowStockProduct lowStockProducts={stats.lowStockProducts || []}  />
                </div>
            </div>

            {/* Order Stats */}
            <div className="row dashboardBoxWrapperRow align-items-stretch mt-3">
                  <div className="col-md-7">
                      <RecentOrder recentOrders={stats.recentOrders || []}/>
                  </div>

                <div className="col-md-5">
                    <OrderStatus orderStatus={stats.ordersByStatus}/>
                </div>
            </div>
            {/* PRODUCT TABLE */}
            <div className="card shadow border-0 p-3 mt-4">
                <h3 className="hd">Best Selling Products</h3>

                {/* TABLE */}
                <div className="table-responsive mt-4">
                    <table className="table table-bordered align-middle">
                        <thead className="thead-dark">
                        <tr>
                            <th>UID</th>
                            <th style={{width: '300px'}}>PRODUCT</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>PRICE</th>
                            <th>STOCK</th>
                            <th>RATING</th>
                            <th>ORDERS</th>
                            <th>SALES</th>
                        </tr>
                        </thead>

                        <tbody>
                        {topSales.map((item, index) => (
                            <tr key={item.product._id}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="d-flex productBox align-items-center">
                                        <div className="imgWrapper">
                                            <img
                                                src={item.product.images?.[0]?.url}
                                                alt="Product"
                                                className="w-100"
                                            />
                                        </div>
                                        <div className="info ms-2">
                                            <h6>{item.product.name}</h6>
                                            <p>{item.product.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>{item.product.category}</td>
                                <td>{item.product.brand}</td>
                                <td>
                                    <div style={{width: '80px'}}>
                                        <del className="old">₹{item.variant.price}</del>
                                        <span className="new text-danger ms-2">₹{item.variant.discountedPrice}</span>
                                    </div>
                                </td>
                                <td>1</td>
                                <td>{item.product.rating}</td>
                                <td>{item.totalSold}</td>
                                <td>₹{item.totalSold * item.variant.discountedPrice}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
