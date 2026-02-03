import Button from '@mui/material/Button';
import { IoMdMenu } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useState } from 'react';


const NAV_CATEGORIES = [
    {
        category: "Fashion",
        slug: "fashion",
        path: "/fashion",
        subcategories: [
            {
                name: "Men", path: "/fashion/men",
                items: [
                    { name: "T-Shirts", path: "/fashion/men/tshirts" },
                    { name: "Casual Shirts", path: "/fashion/men/casual-shirts" },
                    { name: "Formal Shirts", path: "/fashion/men/formal-shirts" },
                    { name: "Sweatshirts", path: "/fashion/men/sweatshirts" },
                    { name: "Jackets", path: "/fashion/men/jackets" },

                ]
            },
            {
                name: "Women", path: "/fashion/women",
                items: [
                    { name: "Dresses", path: "/fashion/women/dresses" },
                    { name: "Tops", path: "/fashion/women/tops" },
                    { name: "Jeans", path: "/fashion/women/jeans" },
                    { name: "Skirts", path: "/fashion/women/skirts" },
                    { name: "Jumpsuits", path: "/fashion/women/jumpsuits" },
                ]
            },
            { name: "Kids", path: "/fashion/kids" },
            {
                name: "Accessories", path: "/fashion/accessories",
                items: [
                    { name: "Watches", path: "/fashion/accessories/watches" },
                    { name: "Bags", path: "/fashion/accessories/bags" },
                    { name: "Jewellery", path: "/fashion/accessories/jewellery" },
                    { name: "Sunglasses", path: "/fashion/accessories/sunglasses" }
                ]
            }
        ]
    },
    {
        category: "Mobiles & Tablets",
        slug: "mobiles-tablets",
        path: "/mobiles-tablets",
        subcategories: [
            { name: "Smartphones", path: "/mobiles-tablets/smartphones" },
            { name: "Tablets", path: "/mobiles-tablets/tablets" },
        ]
    },
    {
        category: "Electronics",
        slug: "electronics",
        path: "/electronics",
        subcategories: [
            { name: "Computers", path: "/electronics/computers" },
            {
                name: "Cameras", path: "/electronics/cameras",
                items: [
                    { name: "DSLR", path: "/electronics/cameras/dslr" },
                    { name: "Mirrorless", path: "/electronics/cameras/mirrorless" },
                    { name: "Point & Shoot", path: "/electronics/cameras/point-shoot" }
                ]
            },
            { name: "Headphones", path: "/electronics/headphones" },
        ]
    },
    {
        category: "Kitchen & Furniture",
        slug: "kitchen-furniture",
        path: "/kitchen-furniture",
        subcategories: [
            {
                name: "Cookware", path: "/kitchen-furniture/cookware",
                items: [
                    { name: "Pots & Pans", path: "/kitchen-furniture/cookware/pots-pans" },
                    { name: "Utensils", path: "/kitchen-furniture/cookware/utensils" },
                    { name: "Bakeware", path: "/kitchen-furniture/cookware/bakeware" }
                ]
            },
            { name: "Furniture Sets", path: "/kitchen-furniture/furniture-sets" },
            {
                name: "Decor", path: "/kitchen-furniture/decor",
                items: [
                    { name: "Wall Art", path: "/kitchen-furniture/decor/wall-art" },
                    { name: "Vases", path: "/kitchen-furniture/decor/vases" },
                    { name: "Clocks", path: "/kitchen-furniture/decor/clocks" }
                ]
            },
        ]
    },
    {
        category: "TVs & Appliances",
        slug: "tvs-appliances",
        path: "/tvs-appliances"
    },
    {
        category: "Beauty & Health",
        slug: "beauty-health",
        path: "/beauty-health",
        subcategories: [
            {
                name: "Skincare", path: "/beauty-health/skincare",
                items: [
                    { name: "Cleansers", path: "/beauty-health/skincare/cleansers" },
                    { name: "Moisturizers", path: "/beauty-health/skincare/moisturizers" },
                    { name: "Serums", path: "/beauty-health/skincare/serums" }
                ]
            },
            {
                name: "Makeup", path: "/beauty-health/makeup",
                items: [
                    { name: "Lipsticks", path: "/beauty-health/makeup/lipsticks" },
                    { name: "Foundations", path: "/beauty-health/makeup/foundations" },
                    { name: "Mascaras", path: "/beauty-health/makeup/mascaras" }
                ]
            },
            {
                name: "Personal Care", path: "/beauty-health/personal-care",
                items: [
                    { name: "Shampoos", path: "/beauty-health/personal-care/shampoos" },
                    { name: "Conditioners", path: "/beauty-health/personal-care/conditioners" },
                    { name: "Body Wash", path: "/beauty-health/personal-care/body-wash" }
                ]
            }
        ]
    },
    {
        category: "Grocery",
        slug: "grocery",
        path: "/grocery"
    }
];

const Navigation = () => {
    const [isOpenSidebarValue, setIsOpenSidebarValue] = useState(false);


    return (
        <nav>
            <div className='container'>
                <div className="row " >
                    <div className='col-sm-1 col-md-2 navPart1'>
                        <div className='categoryWrapper mb-2'>
                            <Button className='allcatTab align-items-center' onClick={() => setIsOpenSidebarValue(!isOpenSidebarValue)}>
                                <span className='icon1 mr-2'><IoMdMenu /></span>
                                <span className='text'>All Categories</span>
                                <span className='icon2 ml-2'><FaAngleDown /></span>
                            </Button>

                            <div className={` sidebarNav ${isOpenSidebarValue === true ? "open" : ""}`}>
                                <ul>
                                    <li className=''><Link to="/">Fashion</Link></li>
                                    <li className=''><Link to="/">Electronics</Link></li>
                                    <li className=''><Link to="/">Kitchen & Furnichers</Link></li>
                                    <li className=''><Link to="/">Tvs & Appliances</Link></li>
                                    <li className=''><Link to="/">Beauty & Health</Link></li>
                                    <li className=''><Link to="/">Grocery</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* navbar part 2 */}
                    <div className='col-sm-11 col-md-10 navPart2 d-flex align-items-center'>
                        <ul className='list list-inline ml-auto'>

                            {NAV_CATEGORIES.map((nav) => (
                                <li key={nav.slug} className="list-inline-item megaParent">

                                    {/* Main Category */}
                                    <Link to={nav.path}>{nav.category}</Link>

                                    {/* Mega Menu */}
                                    {nav.subcategories && (
                                        <div className="megaMenu shadow">
                                            {nav.subcategories.map((sub, i) => (
                                                <div key={i} className="megaColumn">
                                                    <div className="subSection">
                                                        <h4 className='heading'>
                                                            <Link to={sub.path}>{sub.name}</Link>
                                                        </h4>

                                                        {/* Sub-items like tshirt,Dslr,shampoos */}
                                                        {sub.items?.map((item, idx) => (

                                                           <li key={idx}><Link to={item.path}>{item.name}</Link></li>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    )}

                                </li>
                            ))}

                        </ul>
                    </div>


                </div>

            </div>

        </nav>
    )
}

export default Navigation;