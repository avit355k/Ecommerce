import React, {useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import {mycontext} from "../../App";

const AccountDropdown = () => {
    const {setIsLogin} = useContext(mycontext);
    const navigate = useNavigate();

    const handleLogout = () => {
        // remove auth data
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user"); // if you store user info

        // update context
        setIsLogin(false);

        // redirect
        navigate("/");
    };

    return (
        <div className="account-dropdown">
            <div className="account-header">
                <Link to="/account">
                    <h6 className="account-title">My Account</h6>
                </Link>
                <p>9641404096</p>
            </div>

            <ul className="account-links">
                <li><Link to="/orders">My Orders</Link></li>
                <li><Link to="/addresses">Saved Addresses</Link></li>
                <li><Link to="/wishlist">My Wishlist</Link></li>
                <li>E-Gift Cards</li>
                <li>Notifications</li>
                <li>FAQ’s</li>
                <li className="logout" onClick={handleLogout}>
                    Log Out
                </li>
            </ul>
        </div>
    );
};

export default AccountDropdown;
