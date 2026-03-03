import React, {useContext, useEffect, useState} from "react";
import {Mycontext} from "../../App";
import {MdEmail, MdLock} from "react-icons/md";
import Button from "@mui/material/Button";
import {Link, useNavigate} from "react-router-dom";
import API from "../../services/api";


const Login = () => {
    const context = useContext(Mycontext);
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        context.setisHideSidebarHeader(true);
    }, [context]);

    const onChangeInput = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/api/user/signin", formData);

            console.log("Full response:", res.data);

            if (res.data.user?.isAdmin === true) {

                sessionStorage.setItem('token', res.data.token);
                sessionStorage.setItem('_id', res.data.user._id);
                sessionStorage.setItem('user', JSON.stringify(res.data.user));

                context.setisLogin(true);

                alert('Login successful');
                navigate("/");
            } else {
                alert("Access denied! Admin only.");
            }

        } catch (error) {
            console.log(error.response?.data);
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (

        <>
            <section className="loginSection">
                <div className="loginBox">

                    {/* Logo */}
                    <div className="logo text-center">
                        <img
                            src="/logo/Logo-removebg.png"
                            alt="App Logo"
                            className="loginLogo"
                        />
                        <h5 className="fw-bold mt-2 text-white">
                            Welcome to Click & Collect
                        </h5>
                    </div>

                    {/* Login Card */}
                    <div className="wrapper p-4 mt-3">
                        <form onSubmit={handleLogin}>

                            {/* Email */}
                            <div className="form-group mb-3 inputBox">
                                <span className="icon"><MdEmail/></span>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={onChangeInput}
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="form-group mb-3 inputBox">
                                <span className="icon">
                                      <MdLock/>
                                </span>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={onChangeInput}
                                    required
                                />
                            </div>


                            {/* Sign In */}
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                className="mb-3 loginBtn"
                            >
                                Sign In
                            </Button>

                            {/* Forgot password */}
                            <div className="text-center mb-3">
                                <Link to="/forgot-password" className="forgotLink">
                                    Forget Password?
                                </Link>
                            </div>

                            {/* OR Divider */}
                            <div className="orDivider">
                                <span></span>
                                <p>OR</p>
                                <span></span>
                            </div>

                            {/* Google Login */}
                            <Button
                                variant="outlined"
                                fullWidth
                                className="googleBtn"
                            >
                                <img src="/google-icon.png" width="22" alt="google"/>
                                <span className="ms-2">Sign in with Google</span>
                            </Button>

                        </form>

                    </div>
                </div>
            </section>
        </>

    );
};

export default Login;
