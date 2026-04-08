import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

import API from "../../../services/api";

const Graphbox = () => {
    const [chartData, setChartData] = useState({
        series: [],
        labels: []
    });
    //fetch category sales data
    useEffect(() => {
        const fetchCategorySales = async () => {
            try {
                const res = await API.get("/api/dashboard/category-sales");

                if (res.data.status === "success") {
                    const data = res.data.data;

                    // Extract labels & percentages
                    const labels = data.map(item => item.name);
                    const series = data.map(item =>
                        parseFloat(item.percentage)
                    );

                    setChartData({ labels, series });
                }
            } catch (error) {
                console.error("Chart API Error:", error);
            }
        };

        fetchCategorySales();
    }, []);

    // Apex Chart Options
    const options = {
        chart: {
            type: "donut",
            background: "transparent"
        },
        labels: chartData.labels,
        legend: {
            position: "bottom",
            labels: {
                colors: "#333"
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ["#fff"],
                fontSize: "14px"
            }
        },
        tooltip: {
            theme: "dark"
        },
        stroke: {
            show: true
        },
        colors: [
            "#ff1751",
            "#834bd6",
            "#0088ff",
            "#00ed92",
            "#e64302",
            "#025863",
            "#ffae00",
        ],
        plotOptions: {
            pie: {
                donut: {
                    size: "55%",
                    labels: {
                        show: false
                    }
                }
            }
        }
    };

    return (
        <div  className="graphBox" >
            {/* Header */}
            <div className="graphBoxHeader">
                    <h4>Category Sales Mix</h4>
            </div>

            {/* Chart + Legend */}
            <div className="chartWrapper">
                <Chart
                    options={options}
                    series={chartData.series}
                    type="donut"
                    height={280}
                />
            </div>
        </div>
    );
};

export default Graphbox;
