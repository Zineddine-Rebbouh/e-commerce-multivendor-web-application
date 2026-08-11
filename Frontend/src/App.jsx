import Home from "./components/Home/Home";
import Layout from "./layout/Layout";
import { Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import SignUp from "./page/SignUp";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Store from "./redux/store";
import { LoadUser } from "./redux/actions/user";
import Products from "./components/Home/Products";
import Events from "./components/Home/Events";
import EventsAdmin from './sections/Events'
import FAQ from "./components/Home/FAQ";
import SellerForm from "./page/SellerForm";
import ProductDetails from "./components/Product/ProductDetails/ProductDetails";
import ShoppingCart from "./components/ShoppingCart/ShoppingCart";
import ProfileCustomer from "./components/Customer/ProfileCustomer";
import Whishlist from "./components/whishlist/Whishlist";
import Shop from "./components/Shop/Shop";
import ShopProfile from "./components/Shop/sections/ShopProfile"
import { Success } from "./components/stripe/Success";
import { Cancel } from "./components/stripe/Cancel";
import Admin from "./page/Dashboard/AdminDashboard/Admin";
import Dashboard from "./sections/Dashboard";
import User from "./sections/User";
import Revenue from "./sections/Revenue";
import Transactions from "./sections/Transactions";
import Reports from "./sections/Reports";
import Shops from "./sections/Shops";
import Settings from "./sections/Settings";
import Help from "./sections/Help";
import SingleUserPage from "./sections/SingleUserPage";
import ProductsPage from "./sections/ProductsPage";
import ProtectRoute from "./utils/ProtectRoute";
import NotFound from "./page/NotFound";
import OrderDetails from "./components/Customer/sections/OrderDetails";
import { getAllProducts } from "./redux/actions/product";
import Orders from "./components/Shop/sections/Orders"
import CustomerProfile from "./components/Customer/sections/CustomerProfile";
import UserShopProfile from "./components/ShopProfile/UserShopProfile";
import SellerDashboard from "./components/Shop/sections/SellerDashboard";
import ShopProducts from './components/Shop/sections/Products'
import CusomterOrders from './components/Customer/sections/Orders'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Requests from "./sections/Requests";
import Refund from "./components/Customer/sections/Refund";
import Refunds from "./components/Shop/sections/Refunds";
import { getUserWhilistItems } from "./redux/actions/wishlist";
import { getAllOrdersOfUser } from "./redux/actions/order";
import { getUserCartItems } from "./redux/actions/cart";
import Categories from "./sections/Categories";
import Notification from "./components/Notification/Notification";

// import 'swiper/swiper-bundle.min.css';

function App () {

  const isAuthenticated = useSelector( state => state.user.isAuthenticated )

  useEffect( () => {
    Store.dispatch( LoadUser() )
    Store.dispatch( getAllProducts() )
  }, [] );

  useEffect( () => {
    if ( !isAuthenticated ) return
    Store.dispatch( getUserCartItems() )
    Store.dispatch( getUserWhilistItems() )
  }, [ isAuthenticated ] );


  return (
    <div>
      <ToastContainer position="top-center" autoClose={ 2100 } />
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path="/sign-up" element={ <SignUp /> } />
        <Route path="/sign-in" element={ <Login /> } />
        <Route path="/create-shop" element={ <SellerForm /> } />
        <Route
          path="/products"
          element={
            <Layout>
              <Products />
            </Layout>
          }
        />
        <Route
          path="/events"
          element={
            <Layout>
              <Events />
            </Layout>
          }
        />
        <Route
          path="/faq"
          element={
            <Layout>
              <FAQ />
            </Layout>
          }
        />
        <Route
          path="/product-details/:id"
          element={
            <Layout>
              <ProductDetails />
            </Layout>
          }
        />
        <Route
          path="/add-to-cart"
          element={
            <Layout>
              <ShoppingCart />
            </Layout>
          }
        />
        <Route
          path="/whishlist"
          element={
            <Layout>
              <Whishlist />
            </Layout>
          }
        />


        <Route path="/success" element={ <Success /> } />
        <Route path="/cancel" element={ <Cancel /> } />




        {/* Admin Dashboard */}
        <Route path="/dashboard" element={ <ProtectRoute role="admin"><Admin><Dashboard /></Admin></ProtectRoute> } />
        <Route path="/dashboard/users" element={ <ProtectRoute role="admin"><Admin><User /></Admin></ProtectRoute> } />
        <Route path="/dashboard/users/:id" element={ <ProtectRoute role="admin"><Admin><SingleUserPage /></Admin></ProtectRoute> } />
        <Route path="/dashboard/products" element={ <ProtectRoute role="admin"><Admin><ProductsPage /></Admin></ProtectRoute> } />
        <Route path="/dashboard/categories" element={ <ProtectRoute role="admin"><Admin><Categories /></Admin></ProtectRoute> } />
        <Route path="/dashboard/revenue" element={ <ProtectRoute role="admin"><Admin><Revenue /></Admin></ProtectRoute> } />
        <Route path="/dashboard/transactions" element={ <ProtectRoute role="admin"><Admin><Transactions /></Admin></ProtectRoute> } />
        <Route path="/dashboard/events" element={ <ProtectRoute role="admin"><Admin><EventsAdmin /></Admin></ProtectRoute> } />
        <Route path="/dashboard/reports" element={ <ProtectRoute role="admin"><Admin><Reports /></Admin></ProtectRoute> } />
        <Route path="/dashboard/requests" element={ <ProtectRoute role="admin"><Admin><Requests /></Admin></ProtectRoute> } />
        <Route path="/dashboard/shops" element={ <ProtectRoute role="admin"><Admin><Shops /></Admin></ProtectRoute> } />
        <Route path="/dashboard/settings" element={ <ProtectRoute role="admin"><Admin><Settings /></Admin></ProtectRoute> } />
        <Route path="/dashboard/help" element={ <ProtectRoute role="admin"><Admin><Help /></Admin></ProtectRoute> } />
        <Route path="*" element={ <Layout><NotFound /></Layout> } />



        <Route
          path="/profile"
          element={
            <ProtectRoute>
              <Layout>
                <ProfileCustomer>
                  <div className="flex justify-center items-center h-full p-4 w-full shadow-md">
                    <CustomerProfile />
                  </div>
                </ProfileCustomer>
              </Layout>
            </ProtectRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectRoute>
              <Layout>
                <ProfileCustomer>
                  <div className="flex justify-center items-center h-full p-4 w-full border border-gray-200">
                    <CusomterOrders />
                  </div>
                </ProfileCustomer>
              </Layout>
            </ProtectRoute>
          }
        />
        <Route
          path="/profile/refunds"
          element={
            <ProtectRoute>
              <Layout>
                <ProfileCustomer>
                  <div className="flex justify-center items-center h-full p-4 w-full border border-gray-200">
                    <Refund />
                  </div>
                </ProfileCustomer>
              </Layout>
            </ProtectRoute>
          }
        />
        <Route
          path="/profile/track-order"
          element={
            <ProtectRoute>
              <Layout>
                <ProfileCustomer>
                  <div>track-order</div>
                </ProfileCustomer>
              </Layout>
            </ProtectRoute>
          }
        />
        <Route
          path="/profile/messages"
          element={
            <ProtectRoute>
              <Layout>
                <ProfileCustomer>
                  <div>Inbox</div>
                </ProfileCustomer>
              </Layout>
            </ProtectRoute>
          }
        />

        <Route path="/profile/order/:id" element={ <OrderDetails /> } />



        <Route
          path="/shop"
          element={
            <ProtectRoute role="seller">

              <Shop>
                <SellerDashboard />
              </Shop>

            </ProtectRoute>
          }
        />
        <Route
          path="/shop/profile"
          element={
            <ProtectRoute role="seller">

              <Shop>
                <ShopProfile />
              </Shop>

            </ProtectRoute>
          }
        />
        <Route
          path="/shop/orders"
          element={
            <ProtectRoute role="seller">
              <Shop>
                <Orders />
              </Shop>
            </ProtectRoute>
          }
        />
        <Route
          path="/shop/products"
          element={
            <ProtectRoute role="seller">
              <Shop>
                <ShopProducts />
              </Shop>
            </ProtectRoute>
          }
        />
        <Route
          path="/shop/refunds"
          element={
            <ProtectRoute role="seller">
              <Shop>
                <Refunds />
              </Shop>
            </ProtectRoute>
          }
        />
        <Route
          path="/shop/events"
          element={
            <ProtectRoute role="seller">
              <Shop>
                <div>Events</div>
              </Shop>
            </ProtectRoute>
          }
        />

        <Route path="/shop/:id" element={ <Layout> <UserShopProfile /></Layout> } />

      </Routes>
    </div>
  );
}

export default App;
