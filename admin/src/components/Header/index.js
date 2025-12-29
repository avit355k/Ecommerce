import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { MdOutlineMenu, MdMenuOpen, MdLightMode, MdNotifications } from "react-icons/md";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FaShieldAlt } from "react-icons/fa";
import Logout from '@mui/icons-material/Logout';
import SearchBox from '../SearchBox';
import Divider from '@mui/material/Divider';

const Header = () => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const notificationOpen = Boolean(notificationAnchorEl);
  const openNotificationbar = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  const closeNotificationbar = () => {
    setNotificationAnchorEl(null);
  };

  return (
    <header className="header d-flex align-items-center">
      <div className="container-fluid w-100">
        <div className="row align-items-center w-100">

          {/* Logo */}
          <div className="col-md-2 col-sm-3 part1 d-flex align-items-center">
            <Link to="/" className="d-flex align-items-center">
              <img src="./logo/Logo.jpg" className="logo" alt="Logo" />
            </Link>
          </div>

          {/* Menu + Search */}
          <div className="col-md-5 col-sm-6 d-flex align-items-center part2 gap-3">
            <Button className="rounded-circle menu-btn" aria-label="Open menu">
              <MdMenuOpen />
            </Button>
            <SearchBox />
          </div>

          {/* Right Section */}
          <div className="col-md-5 col-sm-3 d-flex align-items-center justify-content-end part3 gap-3">
            <Button className="rounded-circle icon-btn"><MdLightMode /></Button>

            <div className="notificationWrapper position-relative">
              <Button
                className="rounded-circle icon-btn"
                onClick={openNotificationbar}
              >
                <MdNotifications />
              </Button>

              <Menu
                anchorEl={notificationAnchorEl}
                className="notifications dropdown-list"
                id="notifications"
                open={notificationOpen}
                onClose={closeNotificationbar}
                onClick={closeNotificationbar}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.15))',
                      mt: 1.5,
                      borderRadius: 2,
                      '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 18,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <div className="dropdown-header">
                  <h4>Notifications (12)</h4>
                  <span className="viewAll">View All</span>
                </div>
                <Divider className="mb-1" />

                <MenuItem onClick={closeNotificationbar} className="notification-item">
                  <div className="d-flex align-items-center gap-2">
                    <Avatar
                      alt="Anand Bagchi"
                      src="./i_passport.jpg"
                    />
                    <div className="notificationText">
                      <p className="mb-0">
                        <strong>Anand Bagchi</strong> registered
                      </p>
                      <span>5 min ago</span>
                    </div>
                  </div>
                </MenuItem>

                <MenuItem onClick={closeNotificationbar} className="notification-item">
                  <div className="d-flex align-items-center gap-2">
                    <Avatar
                      alt="Rinku Verma"
                      src="./i_passport.jpg"
                    />
                    <div className="notificationText">
                      <p className="mb-0">
                        <strong>Rinku Verma</strong> placed an order
                      </p>
                      <span>10 min ago</span>
                    </div>
                  </div>
                </MenuItem>
                <MenuItem onClick={closeNotificationbar} className="notification-item">
                  <div className="d-flex align-items-center gap-2">
                    <Avatar
                      alt="Anand Bagchi"
                      src="./i_passport.jpg"
                    />
                    <div className="notificationText">
                      <p className="mb-0">
                        <strong>Anand Bagchi</strong> registered
                      </p>
                      <span>5 min ago</span>
                    </div>
                  </div>
                </MenuItem>
              </Menu>
            </div>


            <div className="myAccWrapper d-flex align-items-center">
              <Button className="myAcc d-flex align-items-center p-0" style={{ gap: '0.5rem' }}
                onClick={handleClick}
              >
                <div className="userImg">
                  <span className="rounded-circle">
                    <img
                      src="./i_passport.jpg"
                      className="rounded-circle"
                      alt="User"
                    />
                  </span>
                </div>

                <div className="userInfo">
                  <h5>Anand Bagchi</h5>
                  <p>@anand007</p>
                </div>

              </Button>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleClose}>
                  <Avatar /> My account
                </MenuItem>

                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <FaShieldAlt />
                  </ListItemIcon>
                  Reset Password
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
