import React, {useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import {mycontext} from "../../App";

const AccountDropdown = () => {
    const {setIsLogin} = useContext(mycontext);
    const navigate = useNavigate();

    const storedUser = sessionStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const handleLogout = () => {
        // remove auth data
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        // update context
        setIsLogin(false);

        // redirect
        navigate("/");
    };

    return (
        <div className="account-dropdown">
            <div className="account-header">
                <Link to="/my-account">
                    <h6 className="account-title">My Account</h6>
                    <p>{user?.phone}</p>
                </Link>
            </div>

            <ul className="account-links">
                <li><Link to="/my-account/orders">My Orders</Link></li>
                <li><Link to="/my-account/addresses">Saved Addresses</Link></li>
                <li><Link to="/my-account/wishlist">My Wishlist</Link></li>
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
