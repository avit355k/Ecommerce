import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import Pagination from "@mui/material/Pagination";

import API from "../../Services/api";
import FilterTab from "./FilterTab";
import ProductItem from "../../components/ProductItem";

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || "";

    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [filtersData, setFiltersData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);

    const [filters, setFilters] = useState({
        category: [],
        brand: [],
        minPrice: "",
        maxPrice: "",
        rating: [],
        includeOutOfStock: false,
        sortBy: ""
    });

    // Reset page when keyword or filters change
    useEffect(() => {
        setPage(1);
    }, [keyword, filters]);

    //fetch filters
    useEffect(() => {
        if (!keyword) return;

        const fetchFilters = async () => {
            try {
                const {data} = await API.get(
                    `/api/search/filters?keyword=${keyword}`
                );

                if (data.success) {
                    setFiltersData(data);
                }
            } catch (error) {
                console.error("Filters fetch error:", error);
            }
        };

        fetchFilters();
    }, [keyword]);

    //fetch search results
    useEffect(() => {
        if (!keyword) return;

        const fetchResults = async () => {
            try {
                setLoading(true);

                // Build params safely
                const params = {
                    keyword,
                    page
                };

                // Add filters only if they have values
                Object.entries(filters).forEach(([key, value]) => {

                    if (key === "includeOutOfStock") return;

                    if (Array.isArray(value) && value.length > 0) {
                        params[key] = value.join(",");
                    }

                    if (!Array.isArray(value) && value !== "" && value !== false) {
                        params[key] = value;
                    }
                });

                // Stock logic
                // If includeOutOfStock is false → only in stock
                if (!filters.includeOutOfStock) {
                    params.inStock = "true";
                }

                const query = new URLSearchParams(params).toString();

                const {data} = await API.get(
                    `/api/search/results?${query}`
                );

                setProducts(data.data || []);
                setTotalPages(data.pages || 0);
                console.log(data);

            } catch (error) {
                console.error("Search fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();

    }, [keyword, filters, page]);

    return (
        <section className="search-result-page">
            <div className="container">

                <div className="SearchListing d-flex">

                    <FilterTab
                        filters={filters}
                        setFilters={setFilters}
                        filtersData={filtersData}
                    />

                    <div className="content-right ">
                        {/* Product Grid */}
                        <div className="search-result">
                            {loading ? (
                                <p>Loading products...</p>
                            ) : products.length === 0 ? (
                                <p>No products found</p>
                            ) : (
                                <div className="row g-4">
                                    {products.map(product => (
                                        <div className="col-12 col-md-4 mb-4">
                                            <ProductItem
                                                key={product._id}
                                                product={product}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="d-flex align-items-center justify-content-center mt-4">
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={(e, value) => setPage(value)}
                                    color="primary"
                                />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
};

export default SearchResult;