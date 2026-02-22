import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

import Button from '@mui/material/Button';
import {FaSearch} from "react-icons/fa";

import API from "../../../Services/api";


const SearchBox = () => {
    const [keyword, setKeyword] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();
    const wrapperRef = useRef();

    //Debounce Search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (keyword.trim().length >= 2) {
                fetchSuggestions();
            } else {
                setSuggestions([]);
                setShowDropdown(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [keyword]);

    //get suggestions
    const fetchSuggestions = async () => {
        try {
            setLoading(true);
            const {data} = await API.get(`/api/search/suggestions?keyword=${keyword}`);

            if (data.success) {
                setSuggestions(data.suggestions);
                setShowDropdown(true);
            }
            console.log(data);
        } catch (error) {
            console.error("Suggestion error", error);
        } finally {
            setLoading(false);
        }
    }
    //Click Outside to Close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleRedirect = (_id) => {
        setShowDropdown(false);
        setKeyword("");
        navigate(`/product/${_id}`);
    };
    //handle submit
    const handleSearchSubmit = () => {
        if (keyword.trim()) {
            navigate(`/search?keyword=${keyword}`);
            setShowDropdown(false);
        }
    };

    return (
        <>
            <div className='headerSearch ml-3 mr-3 position-relative' ref={wrapperRef}>
                <input
                    type='text'
                    placeholder='Search for products'
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onFocus={() => keyword.length >= 2 && setShowDropdown(true)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearchSubmit();
                        }
                    }}
                />

                <Button onClick={handleSearchSubmit}> <FaSearch/></Button>

                {/* Suggestions dropdown */}
                {showDropdown && suggestions.length > 0 && (
                    <div className="search-dropdown shadow">
                        {suggestions.map((item) => (
                            <div
                                key={item._id}
                                className="search-item d-flex align-items-center"
                                onClick={() => handleRedirect(item._id)}
                            >
                                <img
                                    src={item.images?.[0]?.url}
                                    alt={item.name}
                                    width="45"
                                    height="45"
                                />

                                <div className="info">
                                    <h6>{item.name}</h6>
                                    <span className="text-muted">
                                    in {item.category?.name}
                                </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default SearchBox;