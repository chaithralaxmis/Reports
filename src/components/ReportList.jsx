import { useEffect, useReducer, useState } from "react"
import Modal from "./fixedcomponents/Modal"
import Pagination from "./fixedcomponents/Pagination";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

let initialForm = {
    title: "",
    subTitle: ""
}

function reducer(state, action) {
    switch (action.type) {
        case "SET_TITLE":
            return { ...state, title: action.payload }
        case "SET_SUBTITLE":
            return { ...state, subTitle: action.payload }
        case "RESET":
            return initialForm
        default:
            return state
    }
}



function ReportList({ handleReportSelection, addReport, reports, selectedReports }) {
    const [modal, setModal] = useState(false)
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [visibleReports, setVisibleReports] = useState([]);
    const [state, dispatch] = useReducer(reducer, initialForm);
    const [search, setSearch] = useState("");
    const COUNT = 12;
    const [show, setShow] = useState(true);
    const [errors, setErrors] = useState({})



    useEffect(() => {
        const filteredReports = reports.filter((report) => report.title.toLowerCase().includes(search.toLowerCase()));
        const totalPages = Math.ceil(filteredReports.length / COUNT);
        setTotalPages(totalPages);
        setVisibleReports(filteredReports.slice((page - 1) * COUNT, page * COUNT));
    }, [reports, page, search]);

    const handleAddReport = () => {
        if (!validateReport()) return;
        addReport(state.title, state.subTitle)
        closeModal()
    }

    const closeModal = () => {
        dispatch({ type: "RESET" })
        setModal(false)
        setErrors({})
    }

    const validateReport = () => {
        const errors = {}
        if (!state.title) {
            errors.title = "Title is required"
        }
        else if (state.title.length < 3) {
            errors.title = "Title must be at least 3 characters long"
        }
        if (!state.subTitle) {
            errors.subTitle = "Sub Title is required"
        }
        else if (state.subTitle.length < 3) {
            errors.subTitle = "Sub Title must be at least 3 characters long"
        }
        setErrors(errors)
        return Object.keys(errors).length === 0
    }
    
    const validateTitle = () =>{
        const errors = {}
         if (!state.title) {
            errors.title = "Title is required"
        }
        else if (state.title.length < 3) {
            errors.title = "Title must be at least 3 characters long"
        }else{
            errors.title = ""
        }
        setErrors((prev) => ({ ...prev, ...errors }))
    }

     const validateSubTitle = () =>{
        const errors = {}
         if (!state.subTitle) {
            errors.subTitle = "Sub Title is required"
        }
        else if (state.subTitle.length < 3) {
            errors.subTitle = "Sub Title must be at least 3 characters long"
        }else{
            errors.subTitle = ""
        }
        setErrors((prev) => ({ ...prev, ...errors }))
    }


    const handleSearch = (search) => {
        setSearch(search);
        setPage(1);
    }


    const isChecked = (report) =>{
        let index = selectedReports.findIndex((data)=>data.id === report.id)
        console.log(index,"index")
        return index == -1 ? false: true
    }


    return (
        <div className={`w-full md:w-[300px] bg-white flex flex-col rounded-sm p-2 ${show ? "h-[calc(100vh-215px)]" : "h-[50px]"}`} >
            <div className={`flex justify-between ${show ? "" : "p-2"}`}>
                <h3 className="text-sm font-bold">Select Report Dashboard</h3>

                <div className="cursor-pointer md:hidden">
                    {show ? <FaAngleDown onClick={() => setShow(false)} /> : <FaAngleUp onClick={() => setShow(true)} />}
                </div>
            </div>

            {show &&
                <>
                    <hr className="text-gray mt-3" />
                    <div className="flex gap-2 mt-3">
                        <input type="text" name="search" placeholder="Search" className="bg-gray-100 rounded-sm w-[80%] p-1" value={search} onChange={(e) => handleSearch(e.target.value)} />
                        <button className="bg-blue-800 text-white rounded-sm w-[20%] cursor-pointer" onClick={() => setModal(true)}>Add</button>
                    </div>
                    <div className="overflow-auto flex-1 min-h-0 mt-1">
                        {
                            visibleReports.length > 0 ? visibleReports.map((report) => (
                                <div key={report.id} className="flex gap-2 mt-3 justify-between rounded-sm bg-gray-100 px-2 py-1">
                                    <label htmlFor="">{report.title}</label>
                                    <input type="checkbox" className="cursor-pointer" checked={isChecked(report)} onChange={() => handleReportSelection(report)} />
                                </div>
                            )) : <div className="text-center mt-3">No reports found</div>
                        }
                    </div>
                    <Pagination page={page} setPage={setPage} totalPages={totalPages} />
                </>
            }


            {modal &&
                <Modal setModal={() => closeModal()} > <div className="flex justify-between">
                    <h3 className='font-semibold text-sm'>Add Report Dashboard</h3>
                    <button className='font-semibold cursor-pointer text-md' onClick={() => closeModal()}>x</button>
                </div>
                    <div className='mt-3'>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-semibold text-sm'>Title<span className="text-red-500">*</span></label>
                            <input type="text" name="title" placeholder="Enter" className={`border ${errors.title ? "border-red-500" : "border-gray-300"} rounded-sm  p-1`} value={state.title} onChange={(e) => dispatch({ type: "SET_TITLE", payload: e.target.value })} onBlur={validateTitle} />
                            {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                        </div>
                        <div className='flex flex-col gap-1 mt-2'>
                            <label htmlFor="" className='font-semibold text-sm'>Sub Title<span className="text-red-500">*</span></label>
                            <input type="text" name="subTitle" placeholder="Enter" className={`border ${errors.subTitle ? "border-red-500" : "border-gray-300"} rounded-sm  p-1`} value={state.subTitle} onChange={(e) => dispatch({ type: "SET_SUBTITLE", payload: e.target.value })} onBlur={validateSubTitle} />
                            {errors.subTitle && <p className="text-red-500 text-xs">{errors.subTitle}</p>}
                        </div>
                    </div>
                    <div className='mt-4 flex gap-2 justify-end'>
                        <button className='bg-gray-200 text-black px-4 py-1 rounded-sm font-semibold text-sm cursor-pointer' onClick={() => closeModal()}>Cancel</button>
                        <button className='bg-blue-500 text-white px-4 py-1 rounded-sm font-semibold text-sm cursor-pointer' onClick={() => handleAddReport()}>Submit</button>
                    </div>
                </Modal>}
        </div>
    )
}
export default ReportList