import { MdSupervisedUserCircle } from "react-icons/md";

const Card = ( { type, amount, parcentage } ) => {
    return (
        <div className={ "bg-white p-5 rounded-lg flex gap-5 cursor-pointer w-full hover:bg-gray-300" }>
            < MdSupervisedUserCircle size={ 24 } />
            <div className={ "flex flex-col gap-5 " }>
                < span className={ "" }> { type } :  </span>
                < span className={ "text-xl font-[500]  " }>{ amount }</span>
                < span className={ "text-sm font-[300]" }>
                    < span className={
                        // item?.change > 0 ? "text-lime-300" :
                        "text-lg font-bold text-[#31fa3e]" }>
                        { parcentage }%
                    </span>{ " " }
                    {/* { item?.change > 0 ? "more" : "less" } */ }
                    less than previous week
                </span >
            </div >
        </div >
    );
};

export default Card;