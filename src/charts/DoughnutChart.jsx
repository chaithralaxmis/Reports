import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);
import { Doughnut } from "react-chartjs-2";

function DoughnutChart({ consolidatedReport }) {
    console.log(consolidatedReport)
    if (consolidatedReport === null) return null;
    const data = {
        labels: Object.keys(consolidatedReport?.alertDistribution),
        datasets: [{
            data: Object.values(consolidatedReport?.alertDistribution),
            backgroundColor: [
                'rgba(25, 124, 191, 1)',
                'rgba(58, 49, 220, 0.6)',
                'rgba(167, 132, 210, 0.6)',
                'rgba(126, 75, 192, 0.6)'
            ],
            hoverOffset: 4
        }]
    };
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false }
        }
    }
    return (
        <>
            <div className="flex flex-wrap md:flex-nowrap justify-between gap-3">

                <div className="w-full md:h-[220px] md:w-[220px]">
                    <Doughnut data={data} options={options} />
                </div>
                <div className="flex-1 flex-row md:flex-col flex-wrap md:flex-nowrap flex gap-2 text-xs ">
                    <div className="flex items-center gap-2"><div className="bg-blue-700 h-[10px] w-[10px] rounded-full"></div>Open</div>
                    <div className="flex items-center gap-2"><div className="bg-blue-500 h-[10px] w-[10px] rounded-full"></div>In Process</div>
                    <div className="flex items-center gap-2"><div className="bg-purple-300 h-[10px] w-[10px] rounded-full"></div>Unacknowledged</div>
                    <div className="flex items-center gap-2"><div className="bg-purple-500 h-[10px] w-[10px] rounded-full"></div>On Watch</div>
                </div>
            </div >
        </>

    );
}

export default DoughnutChart;