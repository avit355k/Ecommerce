import React from "react";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

const MobileMenu = ({ open, setOpen, categories }) => {

    return (

        <div className={`mobileMenu ${open ? "active" : ""}`}>

            <div className="mobileMenuHeader">

                <h4>Categories</h4>

                <button onClick={() => setOpen(false)}>
                    <IoMdClose />
                </button>

            </div>



            <ul>

                {categories.map((cat) => (

                    <li key={cat.slug}>

                        <Link
                            to={cat.path}
                            onClick={() => setOpen(false)}
                        >
                            {cat.category}
                        </Link>

                    </li>

                ))}

            </ul>

        </div>

    );

};

export default MobileMenu;