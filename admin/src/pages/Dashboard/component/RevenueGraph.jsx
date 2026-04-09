import React, { useState ,useEffect } from "react";
import Chart from "react-apexcharts";
import API from "../../../services/api";

const RevenueGraph = () => {
    const [chartData, setChartData] = useState({
        series: [],
        categories: [],
        totalRevenue: 0,
        avgRevenue: 0
    });

    useEffect(() => {
        const handleResize = () => {
            window.dispatchEvent(new Event("resize"));
        };

        // Trigger resize after sidebar animation
        const timeout = setTimeout(handleResize, 300);

        return () => clearTimeout(timeout);
    }, []); useEffect(() => {
        const handleResize = () => {
            window.dispatchEvent(new Event("resize"));
        };

        // Trigger resize after sidebar animation
        const timeout = setTimeout(handleResize, 300);

        return () => clearTimeout(timeout);
    }, []);

    // Fetch API
    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                const res = await API.get("/api/dashboard/monthly-revenue");

                if (res.data.status === "success") {
                    const data = res.data.data;

                    const months = data.monthlyRevenue.map(item => item.month);

                    const revenueSeries = data.monthlyRevenue.map(item => item.revenue);

                    const avgSeries = data.monthlyAvgRevenue.map(item => item.revenue);

                    setChartData({
                        categories: months,
                        series: [
                            { name: "Revenue", data: revenueSeries },
                            { name: "Avg Revenue", data: avgSeries }
                        ],
                        totalRevenue: data.totalRevenue,
                        avgRevenue: data.avgRevenue
                    });
                }

            } catch (error) {
                console.error("Revenue API Error:", error);
            }
        };

        fetchRevenueData();
    }, []);

    const options = {
        chart: {
            type: "area",
            height: 300,
            toolbar: { show: false }
        },

        stroke: {
            curve: "smooth",
            width: 3
        },

        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1
            }
        },

        dataLabels: {
            enabled: false
        },

        xaxis: {
            categories: chartData.categories
        },

        tooltip: {
            theme: "dark"
        },

        colors: ["#4CAF50", "#2196F3"],

        legend: {
            position: "top",
            fontWeight: 600
        },
        responsive: [
            {
                breakpoint: 768,
                options: {
                    chart: {
                        height: 220
                    }
                }
            }
        ]
    };

    return (
        <div className="revenueCard card shadow border-0 p-3">
            <h4 className="mb-3">Monthly Revenue</h4>

            <Chart
                options={options}
                series={chartData.series}
                type="area"
                height={250}
                width="100%"
            />

            <div className="revenueData d-flex flex-row mt-4">
                <p style={{ color: "#4cb04f" }}>
                    Total: <b style={{ color: "black" }}>₹{chartData.totalRevenue}</b>
                </p>
                <p style={{ color: "#2294f2" }}>
                    Avg / month: <b style={{ color: "black" }}> ₹{chartData.avgRevenue}</b>
                </p>
            </div>
        </div>
    );
};

export default RevenueGraph;