import { useEffect } from "react";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";

function Pagination({ page, setPage, totalPages }) {

    const getPagination = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (page <= 3) {
            return [1, 2, 3, "...", totalPages];
        }

        if (page >= totalPages - 2) {
            return [1, "...", totalPages - 2, totalPages - 1, totalPages];
        }

        return [1, "...", page - 1, page, page + 1, "...", totalPages];
    };

    const pagination = getPagination();

    useEffect(() => {
        console.log("Current page:", page);
        console.log("Pagination:", pagination);
    }, [page, totalPages]);

    return (
        <div className="flex gap-2 mt-3 justify-between items-center">
            <CiCircleChevLeft
                className={page > 1 ? "cursor-pointer" : "cursor-not-allowed text-gray-400"}
                onClick={() => page > 1 && setPage(page - 1)}
            />

            {pagination.map((curPage, index) =>
                curPage === "..." ? (
                    <span key={`ellipsis-${index}`} className="text-xs w-[20px] text-center">
                        ...
                    </span>
                ) : (
                    <button
                        key={curPage}
                        className={
                            curPage === page
                                ? "cursor-pointer text-xs text-white h-[20px] w-[20px] rounded-full font-semibold bg-blue-800"
                                : "cursor-pointer text-xs border border-gray-200 h-[20px] w-[20px] rounded-full"
                        }
                        onClick={() => setPage(curPage)}
                    >
                        {curPage}
                    </button>
                )
            )}

            <CiCircleChevRight
                className={page < totalPages ? "cursor-pointer" : "cursor-not-allowed text-gray-400"}
                onClick={() => page < totalPages && setPage(page + 1)}
            />
        </div>
    );
}

export default Pagination;