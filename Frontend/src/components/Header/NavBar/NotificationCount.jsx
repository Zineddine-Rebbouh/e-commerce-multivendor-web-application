import React, { useState, useRef, useEffect } from 'react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import {
    Bell,
    CheckCheck,
    Trash2,
    X,
    ShoppingBag,
    Tag,
    ShieldAlert,
    User,
    Check,
    Clock,
    ChevronRight
} from 'lucide-react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import * as apiClient from '../../../api/api-Client';

const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        title: 'Order Delivered!',
        message: 'Your order #ORD-8492 has been successfully delivered to your shipping address.',
        time: '5m ago',
        type: 'order',
        isRead: false,
        link: '/profile/orders'
    },
    {
        id: 2,
        title: 'Special Discount 20% Off',
        message: 'Use code TECH20 at checkout to get 20% off on electronics and accessories.',
        time: '1h ago',
        type: 'promo',
        isRead: false,
        link: '/products'
    },
    {
        id: 3,
        title: 'Security Alert',
        message: 'Your account was logged in from a new device.',
        time: '3h ago',
        type: 'system',
        isRead: true,
        link: '/profile'
    },
    {
        id: 4,
        title: 'Welcome to TechHub!',
        message: 'Thank you for joining our platform. Complete your profile to get personalized recommendations.',
        time: '1d ago',
        type: 'account',
        isRead: true,
        link: '/profile'
    }
];

const NotificationCount = ( { iconColor = 'white', iconSize = 32 } ) => {
    const [ showNotifications, setShowNotifications ] = useState( false );
    const [ notifications, setNotifications ] = useState( INITIAL_NOTIFICATIONS );
    const [ filter, setFilter ] = useState( 'all' ); // 'all' | 'unread'
    const popoverRef = useRef( null );

    // Fetch server notifications if available
    const { data: notificationsData } = useQuery(
        "notifications",
        apiClient.getNotifications,
        {
            enabled: false,
            onError: () => { }
        }
    );

    useEffect( () => {
        if ( notificationsData && Array.isArray( notificationsData ) && notificationsData.length > 0 ) {
            setNotifications( notificationsData );
        }
    }, [ notificationsData ] );

    // Close popover when clicking outside
    useEffect( () => {
        const handleClickOutside = ( event ) => {
            if ( popoverRef.current && !popoverRef.current.contains( event.target ) ) {
                setShowNotifications( false );
            }
        };

        if ( showNotifications ) {
            document.addEventListener( 'mousedown', handleClickOutside );
            document.addEventListener( 'touchstart', handleClickOutside );
        }

        return () => {
            document.removeEventListener( 'mousedown', handleClickOutside );
            document.removeEventListener( 'touchstart', handleClickOutside );
        };
    }, [ showNotifications ] );

    const unreadCount = notifications.filter( n => !n.isRead ).length;

    const handleNotificationClick = () => {
        setShowNotifications( prev => !prev );
    };

    const markAllAsRead = () => {
        setNotifications( prev => prev.map( n => ( { ...n, isRead: true } ) ) );
    };

    const clearAllNotifications = () => {
        setNotifications( [] );
    };

    const toggleReadStatus = ( id, e ) => {
        e.stopPropagation();
        setNotifications( prev =>
            prev.map( n => ( n.id === id ? { ...n, isRead: !n.isRead } : n ) )
        );
    };

    const deleteNotification = ( id, e ) => {
        e.stopPropagation();
        setNotifications( prev => prev.filter( n => n.id !== id ) );
    };

    const filteredNotifications = notifications.filter( n => {
        if ( filter === 'unread' ) return !n.isRead;
        return true;
    } );

    const getNotificationIcon = ( type ) => {
        switch ( type ) {
            case 'order':
                return (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <ShoppingBag size={ 18 } />
                    </div>
                );
            case 'promo':
                return (
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                        <Tag size={ 18 } />
                    </div>
                );
            case 'system':
                return (
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                        <ShieldAlert size={ 18 } />
                    </div>
                );
            case 'account':
            default:
                return (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <User size={ 18 } />
                    </div>
                );
        }
    };

    return (
        <div className="relative inline-block text-left z-50" ref={ popoverRef }>
            {/* Bell Trigger Button */ }
            <button
                type="button"
                onClick={ handleNotificationClick }
                className="relative p-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none flex items-center justify-center"
                aria-label="Open notifications"
            >
                <IoIosNotificationsOutline
                    size={ iconSize }
                    color={ iconColor }
                />

                { unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md ring-2 ring-white transform translate-x-1/4 -translate-y-1/4 animate-pulse">
                        { unreadCount > 9 ? '9+' : unreadCount }
                    </span>
                ) }
            </button>

            {/* Notification Pop Up Card */ }
            { showNotifications && (
                <div className="absolute right-0 top-12 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-200 ease-out z-50 text-gray-800">

                    {/* Card Header */ }
                    <div className="p-4 border-b border-gray-100 bg-slate-50/80">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                                { unreadCount > 0 && (
                                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                        { unreadCount } New
                                    </span>
                                ) }
                            </div>

                            <div className="flex items-center gap-1">
                                { unreadCount > 0 && (
                                    <button
                                        onClick={ markAllAsRead }
                                        title="Mark all as read"
                                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs flex items-center gap-1"
                                    >
                                        <CheckCheck size={ 16 } />
                                    </button>
                                ) }
                                { notifications.length > 0 && (
                                    <button
                                        onClick={ clearAllNotifications }
                                        title="Clear all"
                                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={ 16 } />
                                    </button>
                                ) }
                                <button
                                    onClick={ () => setShowNotifications( false ) }
                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-lg transition-colors ml-1"
                                >
                                    <X size={ 18 } />
                                </button>
                            </div>
                        </div>

                        {/* Filter Tabs */ }
                        <div className="flex gap-2">
                            <button
                                onClick={ () => setFilter( 'all' ) }
                                className={ `px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                    filter === 'all'
                                        ? 'bg-gray-900 text-white shadow-sm'
                                        : 'bg-white text-gray-600 hover:bg-gray-200/60 border border-gray-200'
                                }` }
                            >
                                All ({ notifications.length })
                            </button>
                            <button
                                onClick={ () => setFilter( 'unread' ) }
                                className={ `px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                    filter === 'unread'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-white text-gray-600 hover:bg-gray-200/60 border border-gray-200'
                                }` }
                            >
                                Unread ({ unreadCount })
                            </button>
                        </div>
                    </div>

                    {/* Notification Items List */ }
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100">
                        { filteredNotifications.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center justify-center">
                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                                    <Bell size={ 26 } />
                                </div>
                                <p className="text-sm font-semibold text-gray-700">No notifications found</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    { filter === 'unread'
                                        ? "You've read all your notifications!"
                                        : "When you get notifications, they'll show up here." }
                                </p>
                            </div>
                        ) : (
                            filteredNotifications.map( ( notification ) => (
                                <div
                                    key={ notification.id }
                                    className={ `group relative p-4 flex gap-3 transition-colors hover:bg-gray-50/80 cursor-pointer ${
                                        !notification.isRead ? 'bg-blue-50/30' : 'bg-white'
                                    }` }
                                    onClick={ () => {
                                        setNotifications( prev =>
                                            prev.map( n =>
                                                n.id === notification.id ? { ...n, isRead: true } : n
                                            )
                                        );
                                        setShowNotifications( false );
                                    } }
                                >
                                    {/* Unread Indicator Dot */ }
                                    { !notification.isRead && (
                                        <span className="absolute top-4 left-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
                                    ) }

                                    {/* Icon */ }
                                    { getNotificationIcon( notification.type ) }

                                    {/* Content */ }
                                    <div className="flex-1 min-w-0 pr-6">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className={ `text-xs font-semibold truncate ${
                                                !notification.isRead ? 'text-gray-900 font-bold' : 'text-gray-700'
                                            }` }>
                                                { notification.title }
                                            </p>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1 shrink-0 ml-2">
                                                <Clock size={ 10 } />
                                                { notification.time }
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                            { notification.message }
                                        </p>
                                    </div>

                                    {/* Quick Actions overlay on hover */ }
                                    <div className="absolute right-3 top-4 hidden group-hover:flex items-center gap-1 bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-gray-200 shadow-sm">
                                        <button
                                            onClick={ ( e ) => toggleReadStatus( notification.id, e ) }
                                            title={ notification.isRead ? 'Mark as unread' : 'Mark as read' }
                                            className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-gray-100 transition-colors"
                                        >
                                            <Check size={ 14 } />
                                        </button>
                                        <button
                                            onClick={ ( e ) => deleteNotification( notification.id, e ) }
                                            title="Delete"
                                            className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100 transition-colors"
                                        >
                                            <Trash2 size={ 14 } />
                                        </button>
                                    </div>
                                </div>
                            ) )
                        ) }
                    </div>

                    {/* Card Footer */ }
                    { notifications.length > 0 && (
                        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                            <button
                                onClick={ markAllAsRead }
                                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                            >
                                Mark all as read
                            </button>
                            <Link
                                to="/profile"
                                onClick={ () => setShowNotifications( false ) }
                                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors"
                            >
                                View settings <ChevronRight size={ 14 } />
                            </Link>
                        </div>
                    ) }
                </div>
            ) }
        </div>
    );
};

export default NotificationCount;
