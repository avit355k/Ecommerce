import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const Navigation = () => {
    const [isOpenSidebarValue, setIsOpenSidebarValue] = useState(false);
    const [categories, setCategories] = useState([]);

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const {data} = await axios.get('http://localhost:5000/api/category/tree/all');
                if (data.success) setCategories(data.data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Convert backend tree to NAV_CATEGORIES format
    const mapCategories = (cats) => {
        return cats.map(cat => ({
            category: cat.name,
            slug: cat.slug,
            path: `/category/${cat.slug}`,
            subcategories: cat.children?.map(sub => ({
                name: sub.name,
                path: `/category/${sub.slug}`,
                items: sub.children?.map(item => ({
                    name: item.name,
                    path: `/category/${item.slug}`
                })) || []
            })) || []
        }));
    };

    const NAV_CATEGORIES = mapCategories(categories);

    return (
        <nav>
            <div className='container'>
                <div className="row">

                    {/* Navbar Part 2 */}
                    <div className='col-12 navPart d-flex align-items-center'>
                        <ul className='list list-inline ml-auto'>
                            {NAV_CATEGORIES.map((nav) => (
                                <li key={nav.slug} className="list-inline-item megaParent">
                                    {/* Main Category */}
                                    <Link to={nav.path}>{nav.category}</Link>

                                    {/* Mega Menu */}
                                    {nav.subcategories && nav.subcategories.length > 0 && (
                                        <div className="megaMenu shadow">

                                            {nav.subcategories.map((sub, i) => (
                                                <div key={i} className="megaColumn">
                                                    <div className="subSection">
                                                        <h4 className='heading'>
                                                            <Link to={sub.path}>{sub.name}</Link>
                                                        </h4>

                                                        {/* Sub-items like tshirt,Dslr,shampoos */}
                                                        {sub.items?.length > 0 && (

                                                            sub.items.map((item, idx) => (
                                                                <li key={idx}>
                                                                    <Link to={item.path}>{item.name}</Link>
                                                                </li>
                                                            ))

                                                        )}
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
    );
};

export default Navigation;
