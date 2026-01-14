import React, {useContext, useEffect, useState} from 'react';

import DashboardBox from './component/DashboardBox';
import Graphbox from './component/Graphbox';

import {FaEdit, FaEye, FaShoppingBag, FaUserCircle} from "react-icons/fa";
import {MdDelete, MdShoppingCart} from "react-icons/md";
import {TbStars} from "react-icons/tb";

import {Button, FormControl, InputLabel, MenuItem, Pagination, Select} from '@mui/material';
import {Mycontext} from "../../App";

const Dashboard = () => {
    const [showBy, setShowBy] = useState('');
    const [categoryBy, setCategoryBy] = useState('');

    const context = useContext(Mycontext);

    useEffect(() => {
        context.setisHideSidebarHeader(false);
    }, []);

    return (
        <div className="right-content w-100">
            {/* DASHBOARD BOXES */}
            <div className="row dashboardBoxWrapperRow align-items-stretch">
                <div className="col-md-8">
                    <div className="dashboardBoxWrapper d-flex">
                        <DashboardBox color={['#4CAF50', '#8BC34A']} icon={<FaUserCircle/>}/>
                        <DashboardBox color={['#9C27B0', '#E91E63']} icon={<MdShoppingCart/>}/>
                        <DashboardBox color={['#2196F3', '#64B5F6']} icon={<FaShoppingBag/>}/>
                        <DashboardBox color={['#FFC107', '#FF9800']} icon={<TbStars/>}/>
                    </div>
                </div>

                <div className="col-md-4 pl-0 d-flex">
                    <div className="dashboardBoxWrapper w-100">
                        <Graphbox color={['#1E5BD7', '#2F7AF8']}/>
                    </div>
                </div>
            </div>

            {/* PRODUCT TABLE */}
            <div className="card shadow border-0 p-3 mt-4">
                <h3 className="hd">Best Selling Products</h3>

                {/* FILTERS */}
                <div className="row cardFilters mt-3">
                    <div className="col-md-3">
                        <h4>Show By</h4>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="showby-label">None</InputLabel>
                            <Select
                                labelId="showby-label"
                                value={showBy}
                                label="Show By"
                                onChange={(e) => setShowBy(e.target.value)}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className="col-md-3">
                        <h4>Category By</h4>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="categoryby-label">None</InputLabel>
                            <Select
                                labelId="categoryby-label"
                                value={categoryBy}
                                label="Category By"
                                onChange={(e) => setCategoryBy(e.target.value)}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>

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
                            <th>ACTION</th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr>
                            <td>1</td>
                            <td>
                                <div className="d-flex productBox align-items-center">
                                    <div className="imgWrapper">
                                        <img
                                            src="https://rukminim2.flixcart.com/image/612/612/xif0q/shopsy-gown/r/6/e/xl-sleeveless-stitched-1020-fabfinds-resized-2-original-imahf7bjtzgyz52j.jpeg?q=70"
                                            alt="Product"
                                            className="w-100"
                                        />
                                    </div>
                                    <div className="info ms-2">
                                        <h6>Tops and skirt set for Female</h6>
                                        <p>Women Printed Pure Cotton Anarkali Kurta</p>
                                    </div>
                                </div>
                            </td>
                            <td>Women</td>
                            <td>Richman</td>
                            <td>
                                <div style={{width: '80px'}}>
                                    <del className="old">₹220</del>
                                    <span className="new text-danger ms-2">₹180</span>
                                </div>
                            </td>
                            <td>1</td>
                            <td>4.9 (16)</td>
                            <td>380</td>
                            <td>38k</td>
                            <td>
                                <div className="actions d-flex gap-1">
                                    <Button size="small" color="secondary"><FaEye/></Button>
                                    <Button size="small" color="success"><FaEdit/></Button>
                                    <Button size="small" color="error"><MdDelete/></Button>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <div className="tableFooter">
                        <p>
                            Showing <b>12</b> of <b>60</b> results
                        </p>

                        <Pagination
                            count={10}
                            color="secondary"
                            showFirstButton
                            showLastButton
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
