import {
    MdOutlineChat,
    MdPublic,
    MdSearch,
} from "react-icons/md";
import NotificationCount from "../../../components/Header/NavBar/NotificationCount";

const Navigation = ( { activeSection } ) => {

    return (
        <div className={ 'p-5 rounded-lg bg-white flex items-center justify-between shadow-sm border border-gray-100' }>
            <div className={ 'text-black font-bold capitalize text-xl' }>{ activeSection.split( "/" ).pop() }</div>
            <div className={ 'flex items-center gap-5 ' }>
                <div className={ 'flex items-center gap-2.5 p-2.5 rounded-md bg-[#2e374a] ' }>
                    <MdSearch color="white" />
                    <input type="text" placeholder="Search..." className={ 'bg-transparent border-none text-white focus:outline-none' } />
                </div>
                <div className={ 'flex items-center gap-5' }>
                    <MdOutlineChat size={ 20 } className="text-gray-700 cursor-pointer" />
                    <NotificationCount iconColor="#374151" iconSize={ 24 } />
                    <MdPublic size={ 20 } className="text-gray-700 cursor-pointer" />
                </div>
            </div>
        </div>
    );
};

export default Navigation;