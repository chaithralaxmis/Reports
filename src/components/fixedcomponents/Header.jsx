import { CiCircleQuestion } from "react-icons/ci"
import { HiOutlineInboxArrowDown } from "react-icons/hi2"

function Header() {
    return (
        <div className="header bg-gray-900 p-2 h-[64px] flex justify-between items-center text-white">
            <li className="text-sm font-bold">Dashboard</li>
            <div className="flex gap-3 items-center">
                <li className="bg-gray-600 rounded-full p-1">
                    <HiOutlineInboxArrowDown />
                </li>
                <li className="bg-gray-600 rounded-full p-1">
                    <CiCircleQuestion />
                </li>
                <li className="bg-gray-600 rounded-full p-1 h-[25px] w-[25px] text-sm font-bold flex items-center justify-center">C</li>
            </div>
        </div>
    )
}
export default Header