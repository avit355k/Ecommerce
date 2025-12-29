import React from 'react'
import DashboardBox from './component/DashboardBox';
import { FaUserCircle, FaShoppingBag } from "react-icons/fa";
import { MdShoppingCart } from "react-icons/md";
import { TbStars } from "react-icons/tb";

const Dashboard = () => {
  return (
    <div className='right-content w-100'>
      <div className='row dashboardBoxWrapperRow'>
        <div className='col-md-8'>

          <div className='dashboardBoxWrapper d-flex '>
            <DashboardBox color={['#4CAF50', '#8BC34A']} icon={<FaUserCircle />} />
            <DashboardBox color={['#9C27B0', '#E91E63']} icon={<MdShoppingCart />} />
            <DashboardBox color={['#2196F3', '#64B5F6']} icon={<FaShoppingBag />} />
            <DashboardBox color={['#FFC107', '#FF9800']} icon={<TbStars />} />
          </div>

        </div>

        <div className='col-md-4 pl-0'>
          <div className='box graphBox'>
            <h3>Sales</h3>
          </div>
        </div>


        <div className='card shadow border-0 p-3 mt-4'>
          <h3 className='hd'>Best Selling Products</h3>
          <div className='row cardFilters'>
            <div className='col'>
              <h4>Show By</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard