import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { clearCart } from "../../redux/actions/cart";
import { useDispatch } from "react-redux";
import { clearWishlist } from "../../redux/actions/wishlist";
import * as apiClient from "../../api/api-Client";
import { RxPerson } from "react-icons/rx";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { MdOutlineAdminPanelSettings, MdOutlineTrackChanges } from "react-icons/md";
import { BorderRight } from "@mui/icons-material";

const ProfileSideBar = ( { active, setActive } ) => {
  const user = useSelector( ( state ) => state.user );
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { mutate } = useMutation( apiClient.logout, {
    onError: ( error ) => {
      console.log( "error" );
      toast.error( error.message, {
        position: "top-center",
        autoClose: 1400,
      } );
    },
    onSuccess: async () => {
      console.log( "Logout success" );
      toast.success( "Logout success", {
        position: "top-center",
        autoClose: 1400,
      } );
      setTimeout( () => {
        navigate( "/" );
        window.location.reload();

      }, 2000 );
    },
  } );

  const handleLogOut = () => {
    dispatch( clearCart() );
    dispatch( clearWishlist() );
    mutate();
  };

  const activeLinkStyles = {
    color: "red", // Change to your desired color
    backgroundColor: "#f5f5f5",
    padding: "10px 0",
    BorderRight: "4px solid red", // Change to your desired border color
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 justify-center bg-white shadow-sm rounded-[10px] p-4 pt-8 border border-gray-100">
      <Link to="/profile">
        <div
          className={ `flex items-center cursor-pointer w-full mb-8 ${ location.pathname === "/profile" ? "active-link" : ""
            }` }
          style={ location.pathname === "/profile" ? activeLinkStyles : {} }

        >
          <RxPerson size={ 20 } />
          <span className={ `pl-3 hidden md:block` }>Profile</span>
        </div>
      </Link>
      <Link to="/profile/orders">
        <div
          className={ `flex items-center cursor-pointer w-full mb-8 ${ location.pathname === "/profile/orders" ? "active-link" : ""
            }` }
          style={ location.pathname === "/profile/orders" ? activeLinkStyles : {} }

        >
          <HiOutlineShoppingBag size={ 20 } />
          <span className={ `pl-3 hidden md:block` }>Orders</span>
        </div>
      </Link>
      <Link to="/profile/refunds">
        <div
          className={ `flex items-center cursor-pointer w-full mb-8 ${ location.pathname === "/profile/refunds" ? "active-link" : ""
            }` }
          style={ location.pathname === "/profile/refunds" ? activeLinkStyles : {} }

        >
          <HiOutlineReceiptRefund size={ 20 } />
          <span className={ `pl-3 hidden md:block` }>Refunds</span>
        </div>
      </Link>
      {/* <Link to="/profile/messages">
        <div
          className={ `flex items-center cursor-pointer w-full mb-8 ${ location.pathname === "/profile/messages" ? "active-link" : ""
            }` }
          style={ location.pathname === "/profile/messages" ? activeLinkStyles : {} }

        >
          <AiOutlineMessage size={ 20 } />
          <span className={ `pl-3 hidden md:block` }>Inbox</span>
        </div>
      </Link> */}
      {/* <Link to="/profile/track-order">
        <div
          className={ `flex items-center cursor-pointer w-full mb-8 ${ location.pathname === "/profile/track-order" ? "active-link" : ""
            }` }
          style={ location.pathname === "/profile/track-order" ? activeLinkStyles : {} }

        >
          <MdOutlineTrackChanges size={ 20 } />
          <span className={ `pl-3 hidden md:block` }>Track Order</span>
        </div>
      </Link> */}
      { user && user?.role === "Admin" && (
        <Link to="/profile/admin-dashboard">
          <div
            className={ `flex items-center cursor-pointer w-full mb-8 ${ location.pathname === "/profile/admin-dashboard"
              ? "active-link"
              : ""
              }` }
            style={ location.pathname === "/profile//admin-dashboard" ? activeLinkStyles : {} }

          >
            <MdOutlineAdminPanelSettings size={ 20 } />
            <span className={ `pl-3 hidden md:block` }>Admin Dashboard</span>
          </div>
        </Link>
      ) }
      <button
        onClick={ handleLogOut }
        className={ `single_item flex items-center cursor-pointer w-full mb-8 ${ active === 8 ? "active-link" : ""
          }` }
      >
        <AiOutlineLogin size={ 20 } />
        <span className={ `pl-3 hidden md:block` }>Log out</span>
      </button>
    </div>
  );
};

export default ProfileSideBar;
