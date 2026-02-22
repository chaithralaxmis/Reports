import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

// Register required components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function BarChart({ consolidatedReport }) {
   console.log(consolidatedReport)
    const data = {
        labels: consolidatedReport?.unitAlerts?.map((alert) => alert.unit),
        datasets: [
            {
                label: "In Process",
                data: consolidatedReport?.unitAlerts?.map((alert) => alert.inProcess),
                backgroundColor: "rgba(58, 49, 220, 0.6)",
                borderRadius: 5,
            },
            {
                label: "Unacknowledged",
                data: consolidatedReport?.unitAlerts?.map((alert) => alert.unacknowledged),
                backgroundColor: "rgba(167, 132, 210, 0.6)",
                borderRadius: 5,

            },
            {
                label: "On Watch",
                data: consolidatedReport?.unitAlerts?.map((alert) => alert.onWatch),
                backgroundColor: "rgba(126, 75, 192, 0.6)",
                borderRadius: 5,

            }
        ],
    };
    const options = {
        // responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: { stacked: true },
            y: { stacked: true }
        }
    };

    return (
        <>
            <div className="h-[220px]">
                <Bar data={data} options={options}  />
            </div>
            <div className="flex gap-2 text-xs">
                <div className="flex items-center gap-2"><div className="bg-blue-500 h-[10px] w-[10px] rounded-full"></div>In Process</div>
                <div className="flex items-center gap-2"><div className="bg-purple-300 h-[10px] w-[10px] rounded-full"></div>Unacknowledged</div>
                <div className="flex items-center gap-2"><div className="bg-purple-500 h-[10px] w-[10px] rounded-full"></div>On Watch</div>
            </div>
        </>
    );
}

export default BarChart;