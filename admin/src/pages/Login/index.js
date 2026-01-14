import React, {useContext, useEffect, useState} from "react";
import {Mycontext} from "../../App";
import {MdEmail, MdLock} from "react-icons/md";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";

const Login = () => {
    const context = useContext(Mycontext);
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        context.setisHideSidebarHeader(true);
    }, [context]);

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
                        <form>

                            {/* Email */}
                            <div className="form-group mb-3 inputBox">
                                <span className="icon"><MdEmail/></span>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
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
                                />

                                <span
                                    className="eyeIcon"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                {showPassword ? <AiOutlineEyeInvisible/> : <AiOutlineEye/>}
                       </span>
                            </div>


                            {/* Sign In */}
                            <Button
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

                        {/* Footer */}
                        <div className="footer mt-3 p-3 text-center">
            <span>
              Don’t have an account?
              <Link to="/sign-up" className="ms-1">
                Register
              </Link>
            </span>
                        </div>

                    </div>
                </div>
            </section>
        </>

    );
};

export default Login;
