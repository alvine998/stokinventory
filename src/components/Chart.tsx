import dynamic from 'next/dynamic'
import React, { useState } from 'react'
// import Chart from 'react-apexcharts'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function ApexChart() {
    const startYear = 2020;
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let year = startYear; year <= currentYear; year++) {
        years.push(year);
    }
    const [chart, setChart] = useState<any>({
        options: {
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                categories: years
            }
        },
        series: [
            {
                name: "series-1",
                data: [30, 40, 45, 50, 49]
            }
        ]
    })
    return (
        <div>
            <Chart
                options={chart?.options}
                series={chart?.series}
                type="bar"
                width="100%"
                height={300}
            />
        </div>
    )
}
