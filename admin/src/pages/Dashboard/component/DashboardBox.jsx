import React, { useEffect, useState } from 'react'
import { HiDotsVertical } from "react-icons/hi";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const options = [
    'Last Day',
    'Last Week',
    'Last Month',
    'Last Year',
];

const ITEM_HEIGHT = 48;

const DashboardBox = (props) => {
    useEffect(() => {
        console.log(props.color);
    }, [props.color]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOption, setSelectedOption] = useState('Last Month');

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (option) => {
        setSelectedOption(option);
        handleClose();
    };
    return (
        <>
            <div className='dashboardBox' style={{
                backgroundImage: `linear-gradient(to right, ${props.color[0]}, ${props.color[1]})`,
            }}>
                <div className='d-flex justify-content-between w-100 align-items-center'>
                    <div className='col1'>
                        <h4 className='text-white'>Total Users</h4>
                        <span className='text-white'>277</span>
                    </div>
                    <div className='ml-auto'>
                        <span className='icon'>
                            {props.icon}
                        </span>
                    </div>
                </div>

                <div className='mt-3 d-flex w-100 align-items-center justify-content-between'>
                    <h6 className='text-white mb-0 mt-0'>Last Month</h6>
                    <Button className='ml-auto toogleIcon'
                        onClick={handleClick}
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true">
                        <HiDotsVertical />
                    </Button>
                    <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                            paper: {
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '20ch',
                                },
                            },
                            list: {
                                'aria-labelledby': 'long-button',
                            },
                        }}
                    >
                        {options.map((option) => (
                            <MenuItem
                                key={option}
                                selected={option === selectedOption}
                                onClick={() => handleMenuItemClick(option)}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            </div>
        </>
    )
}

export default DashboardBox