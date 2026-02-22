import { CiCalendar } from "react-icons/ci"
import { FaRegClock, FaRegMessage } from "react-icons/fa6"
import { GoBellFill, GoCheckCircle } from "react-icons/go"
import ReportList from "./ReportList";
import BarChart from "../charts/BarChart";
import DoughnutChart from "../charts/DoughnutChart";
import { useEffect, useState } from "react";
import mockReports, { generateRealisticReport } from "../data/mockReport";


function Dashboard() {
    const [reports, setReports] = useState([]);
    const [selectedReports, setSelectedReports] = useState([]);
    const [consolidatedReport, setConsolidatedReport] = useState(null);
    const [openAlerts, setOpenALerts] = useState(0);
    const [closingRate, setClosingRate] = useState(0);
    const [oldestUnacknowledgedDays, setOldestUnacknowledgedDays] = useState(0);



    function handleReportSelection(report) {
        setSelectedReports(prevReports => {
            if (prevReports.some(item => item.id === report.id)) {
                return prevReports.filter(item => item.id !== report.id);
            } else {
                return [...prevReports, report];
            }
        });
    }


    useEffect(() => {
        if (localStorage.getItem("reports")) {
            setReports(JSON.parse(localStorage.getItem("reports")))
        } else {
            localStorage.setItem("reports", JSON.stringify(mockReports));
            setReports(mockReports)
        }
    }, []);

    useEffect(() => {
        if (selectedReports.length !== 0) {
            let reports = selectedReports;
            console.log(reports)
            const reportData = reports.reduce((acc, cur) => {
                console.log(acc)
                let total = parseFloat(cur.summary.closingRate) + parseFloat(acc?.summary.closingRate);
                const avgClosingRate = reports.length
                    ? (total / reports.length).toFixed(2)
                    : 0;
                let summary = {
                    openAlerts: parseInt(cur.summary.openAlerts) + parseInt(acc?.summary.openAlerts),
                    closingRate: avgClosingRate,
                    oldestUnacknowledgedDays: cur.summary.oldestUnacknowledgedDays > acc?.summary.oldestUnacknowledgedDays ? cur.summary.oldestUnacknowledgedDays : acc?.summary.oldestUnacknowledgedDays
                }
                summary.closingRate = parseFloat(summary.closingRate).toFixed(2)

                let alertDistribution = {}

                for (let i = 0; i < cur?.alertDistribution.length; i++) {
                    let curLabel = cur?.alertDistribution[i].status
                    let curValue = cur?.alertDistribution[i].value
                    for (let key of Object.keys(acc?.alertDistribution)) {
                        if (key === curLabel) {
                            alertDistribution[key] = curValue + acc?.alertDistribution[key]
                        }
                    }

                }

                let unitAlerts = [...acc.unitAlerts, ...cur.unitAlerts].reduce((map, item) => {
                    if (!map[item.unit]) {
                        map[item.unit] = {
                            unit: item.unit,
                            inProcess: 0,
                            unacknowledged: 0,
                            onWatch: 0
                        };
                    }

                    map[item.unit].inProcess += item.inProcess || 0;
                    map[item.unit].unacknowledged += item.unacknowledged || 0;
                    map[item.unit].onWatch += item.onWatch || 0;

                    return map;
                }, {});



                return {
                    summary: summary,
                    alertDistribution: alertDistribution,
                    unitAlerts: Object.values(unitAlerts)
                }
            }, {
                summary: {
                    openAlerts: 0,
                    closingRate: 0,
                    oldestUnacknowledgedDays: 0
                },
                alertDistribution: {
                    "Open": 0,
                    "In Process": 0,
                    "Acknowledged": 0,
                    "On Watch": 0
                },
                unitAlerts: []
            })
            console.log(reportData)
            setConsolidatedReport(reportData)
        } else {
            setConsolidatedReport(null)
        }

    }, [selectedReports])

    useEffect(() => {
        let open = reports.reduce((acc, cur) => acc + cur.summary.openAlerts, 0)
        setOpenALerts(open)
        const total = reports.reduce((acc, cur) => acc + cur.summary.closingRate, 0);

        const avgClosingRate = reports.length
            ? (total / reports.length).toFixed(2)
            : 0;

        setClosingRate(avgClosingRate);
        setOldestUnacknowledgedDays(reports.reduce((acc, cur) => acc > cur.summary.oldestUnacknowledgedDays ? acc : cur.summary.oldestUnacknowledgedDays, 0))

    }, [reports])


    const addReport = (title, subTitle) => {
        const newReport = generateRealisticReport(reports.length + 1, title, subTitle)
        setReports([...reports, newReport])
        localStorage.setItem("reports", JSON.stringify([...reports, newReport]));
    }

    return (
        <div className="p-3 bg-sky-50 h-[calc(100dvh-42px)] md:h-[calc(100vh-42px)] overflow-y-auto">

            <div className="flex gap-3">
                <div className="bg-blue-800 w-[40px] h-[25px] flex items-center justify-center text-white rounded-sm"><FaRegMessage /></div>
                <div className="font-bold ">
                    Take-Home
                </div>
            </div>

            <div className="flex gap-3 mt-3 flex-wrap md:flex-nowrap justify-between">
                <div className="w-full md:w-[22%] bg-white rounded-sm p-3">
                    <div className="flex gap-2 items-center"> <CiCalendar /> Last 7 Days</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-blue-700 h-2 rounded-full" style={{ width: `${closingRate}%` }}></div>
                    </div>
                </div>
                <div className="w-[30%] shrink-0 md:w-[28%] bg-white rounded-sm p-3 flex flex-col md:flex-row items-center gap-2">
                    <div className="bg-blue-100 w-[40px] h-[40px] flex items-center justify-center text-white rounded-full">
                        <GoBellFill className="text-blue-800" />
                    </div>
                    <div className="text-start">
                        <div className="font-bold text-md md:text-2xl">{openAlerts}</div>
                        <div>Open Alerts</div>
                    </div>
                </div>
                <div className="w-[30%] shrink-0 md:w-[28%] bg-white rounded-sm p-3 flex flex-col md:flex-row items-center gap-2">
                    <div className="bg-purple-100 w-[40px] h-[40px] flex items-center justify-center text-white rounded-full">
                        <GoCheckCircle className="bg-purple-400 rounded-full" />
                    </div>
                    <div>
                        <div className="font-bold text-md md:text-2xl">{closingRate}%</div>
                        <div>Closing Rate %</div>
                    </div>
                </div>
                <div className="w-[30%] shrink-0 md:w-[22%] bg-white rounded-sm p-3 flex flex-col md:flex-row items-center gap-2">
                    <div className="bg-blue-100 w-[40px] h-[40px] flex items-center justify-center text-white rounded-full">
                        <FaRegClock className="text-blue-800" />
                    </div>
                    <div>
                        <div className="font-bold text-md md:text-2xl">{oldestUnacknowledgedDays} days</div>
                        <div className="text-xs md:text-sm">Oldest Acknowledged alert</div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between gap-2 mt-3 rounded-sm flex-wrap md:flex-nowrap">
                <ReportList handleReportSelection={handleReportSelection} addReport={addReport} reports={reports} />
                <div className="w-full md:flex-1 bg-white rounded-sm p-3">
                    {
                        consolidatedReport == null ? <div className="flex justify-center items-center h-full">Please Choose a Report</div> :
                            <>

                                <div className="flex gap-3">

                                    <div className="w-[30%] md:w-[20%] p-2 border-gray-200 border flex flex-col justify-center items-center rounded-sm">
                                        <div className="text-xs font-semibold">Number Of Open Alerts</div>
                                        <div className="text-sm text-blue-400">{consolidatedReport?.summary.openAlerts} </div>
                                    </div>
                                    <div className="w-[30%] md:w-[20%] p-2 border-gray-200 border flex flex-col justify-center items-center rounded-sm">
                                        <div className="text-xs font-semibold">Closing rate %</div>
                                        <div className="text-sm text-blue-400">{consolidatedReport?.summary.closingRate} %</div>
                                    </div>
                                    <div className="w-[30%] md:w-[20%] p-2 border-gray-200 border flex flex-col text-center justify-center items-center rounded-sm">
                                        <div className="text-xs font-semibold">Oldest Unacknowledged alert</div>
                                        <div className="text-sm text-blue-400">{consolidatedReport?.summary.oldestUnacknowledgedDays} days</div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 p-3 w-[100%]">
                                    <div className="w-full md:w-[50%] shadow-md rounded-md p-3" >
                                        <h2 className="text-sm font-bold mb-1">Best Unit Operations with Latest Number of Alerts</h2>
                                        <BarChart consolidatedReport={consolidatedReport} />
                                    </div>
                                    <div className="w-full md:w-[50%] shadow-md rounded-md p-3" >
                                        <h2 className="text-sm font-bold mb-1">Alert rates Distribution</h2>
                                        <DoughnutChart consolidatedReport={consolidatedReport} />
                                    </div>
                                </div>
                            </>
                    }
                </div>
            </div>
        </div>

    )
}

export default Dashboard