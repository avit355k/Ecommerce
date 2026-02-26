import React, {useContext, useEffect, useRef, useState} from 'react';
import {RiShutDownLine} from "react-icons/ri";
import Button from "@mui/material/Button";
import {Link, useNavigate} from "react-router-dom";
import API from "../../Services/api";
import {mycontext} from "../../App";

const MyAccount = () => {

    const {setIsLogin} = useContext(mycontext);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        avatar: {}
    });
    const [originalUser, setOriginalUser] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("_id");

    // fetch user
    const fetchUser = async () => {
        try {
            const res = await API.get(`/api/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUser(res.data.user);
            setOriginalUser(res.data.user);
        } catch (error) {
            console.log("Fetch user error:", error);
        }
    };

    useEffect(() => {
        if (token && userId) {
            fetchUser();
        }
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    // Update user
    const handleUpdate = async () => {
        try {
            setLoading(true);

            const res = await API.put(
                `/api/user/${userId}`,
                {
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUser(res.data.user);
            setEditMode(false);
            setLoading(false);

            alert("Profile updated successfully ");

        } catch (error) {
            console.log("Update error:", error);
            setLoading(false);
        }
    };

    //avatar change
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        setUser(prev => ({
            ...prev,
            avatar: {
                ...prev.avatar,
                url: previewUrl
            }
        }));

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await API.put(
                `/api/user/${userId}/avatar`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            const newAvatar = res.data.avatar;

            setUser(prev => ({
                ...prev,
                avatar: res.data.avatar
            }));

            console.log("New avatar:", newAvatar);

        } catch (error) {
            console.log("Avatar update error:", error);
        }
    };

    //Log out
    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("_id");

        setIsLogin(false);
        navigate("/signIn");
    };
    
    return (
        <section className="MyAccountPage py-4">

            {/* LEFT SIDE */}
            <div className="AccountNavigation">

                <div className="userBox d-flex align-items-center p-3">
                    <div className="avatar" style={{cursor: "pointer"}}>
                        <img
                            src={
                                user?.avatar?.url ||
                                "https://res.cloudinary.com/dw2gks8uv/image/upload/v1771607674/user-png_vhg2dz.png"
                            }
                            alt="user"
                            onClick={() => fileInputRef.current.click()}
                        />

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{display: "none"}}
                            onChange={handleAvatarChange}
                        />
                    </div>

                    <div className="userInfo">
                        <p>Hello,</p>
                        <h6>{user.name}</h6>
                    </div>
                </div>

                <div className="navSection mt-3">
                    <h6>ACCOUNT SETTINGS</h6>

                    <ul>
                        <li>
                            <Link to={"/my-account"}>Profile Information</Link>
                        </li>

                        <li>
                            <Link to={"/my-account/orders"}>My Orders</Link>
                        </li>

                        <li>
                            <Link to={"/my-account/wishlist"}>My Wishlists</Link>
                        </li>

                        <li>
                            <Link to={"/my-account/addresses"}>Manage Address</Link>
                        </li>
                    </ul>

                    <div className="log-out d-flex align-items-center"
                         onClick={handleLogout}
                         style={{cursor: "pointer"}}>
                        <RiShutDownLine className="icon"/>
                        Logout
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="AccountDetails">

                <div className="d-flex justify-content-between align-items-center">
                    <h6>Personal Information</h6>

                    {!editMode ? (
                        <Button onClick={() => setEditMode(true)} className="btn-red">
                            Edit
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => {
                                setUser(originalUser);
                                setEditMode(false);
                            }}
                            className="btn-red"
                        >
                            Cancel
                        </Button>
                    )}
                </div>

                <div className="formRow mt-3">
                    <input
                        type="text"
                        name="name"
                        className="userName"
                        value={user.name}
                        disabled={!editMode}
                        onChange={handleChange}
                    />
                </div>

                <div className="formGroup">
                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        disabled={!editMode}
                        onChange={handleChange}
                    />
                </div>

                <div className="formGroup">
                    <label>Mobile Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={user.phone}
                        disabled={!editMode}
                        onChange={handleChange}
                    />
                </div>

                {editMode && (
                    <Button variant={"contained"} onClick={handleUpdate} className="btn-red">
                        Save
                    </Button>
                )}

            </div>
        </section>
    );
};

export default MyAccount;