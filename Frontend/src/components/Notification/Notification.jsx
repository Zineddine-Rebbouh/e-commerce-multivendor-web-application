import React, { useState } from 'react';
import {
    Bell,
    CheckCheck,
    Trash2,
    ShoppingBag,
    Tag,
    ShieldAlert,
    User,
    Check,
    Clock
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        title: 'Order Delivered!',
        message: 'Your order #ORD-8492 has been successfully delivered to your shipping address.',
        time: '5m ago',
        type: 'order',
        isRead: false
    },
    {
        id: 2,
        title: 'Special Discount 20% Off',
        message: 'Use code TECH20 at checkout to get 20% off on electronics and accessories.',
        time: '1h ago',
        type: 'promo',
        isRead: false
    },
    {
        id: 3,
        title: 'Security Alert',
        message: 'Your account was logged in from a new device.',
        time: '3h ago',
        type: 'system',
        isRead: true
    },
    {
        id: 4,
        title: 'Welcome to TechHub!',
        message: 'Thank you for joining our platform. Complete your profile to get personalized recommendations.',
        time: '1d ago',
        type: 'account',
        isRead: true
    }
];

const Notification = () => {
    const [ notifications, setNotifications ] = useState( INITIAL_NOTIFICATIONS );
    const [ filter, setFilter ] = useState( 'all' );

    const unreadCount = notifications.filter( n => !n.isRead ).length;

    const markAllAsRead = () => {
        setNotifications( prev => prev.map( n => ( { ...n, isRead: true } ) ) );
    };

    const clearAll = () => {
        setNotifications( [] );
    };

    const toggleReadStatus = ( id ) => {
        setNotifications( prev =>
            prev.map( n => ( n.id === id ? { ...n, isRead: !n.isRead } : n ) )
        );
    };

    const deleteNotification = ( id ) => {
        setNotifications( prev => prev.filter( n => n.id !== id ) );
    };

    const filtered = notifications.filter( n => {
        if ( filter === 'unread' ) return !n.isRead;
        return true;
    } );

    const getIcon = ( type ) => {
        switch ( type ) {
            case 'order':
                return (
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <ShoppingBag size={ 20 } />
                    </div>
                );
            case 'promo':
                return (
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                        <Tag size={ 20 } />
                    </div>
                );
            case 'system':
                return (
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                        <ShieldAlert size={ 20 } />
                    </div>
                );
            case 'account':
            default:
                return (
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <User size={ 20 } />
                    </div>
                );
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                        <Bell size={ 22 } />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                        <p className="text-xs text-gray-500">Stay updated with your latest activity</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    { unreadCount > 0 && (
                        <button
                            onClick={ markAllAsRead }
                            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                            <CheckCheck size={ 16 } />
                            Mark all read
                        </button>
                    ) }
                    { notifications.length > 0 && (
                        <button
                            onClick={ clearAll }
                            className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                            <Trash2 size={ 16 } />
                            Clear all
                        </button>
                    ) }
                </div>
            </div>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={ () => setFilter( 'all' ) }
                    className={ `px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        filter === 'all'
                            ? 'bg-gray-900 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }` }
                >
                    All ({ notifications.length })
                </button>
                <button
                    onClick={ () => setFilter( 'unread' ) }
                    className={ `px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        filter === 'unread'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }` }
                >
                    Unread ({ unreadCount })
                </button>
            </div>

            <div className="space-y-3">
                { filtered.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">
                        <Bell size={ 36 } className="mx-auto mb-2 text-gray-300" />
                        <p className="font-semibold text-sm">No notifications</p>
                        <p className="text-xs text-gray-400 mt-0.5">You're all caught up!</p>
                    </div>
                ) : (
                    filtered.map( ( item ) => (
                        <div
                            key={ item.id }
                            className={ `p-4 rounded-xl border transition-all flex items-start gap-4 ${
                                !item.isRead
                                    ? 'bg-blue-50/40 border-blue-100 shadow-sm'
                                    : 'bg-white border-gray-100 hover:border-gray-200'
                            }` }
                        >
                            { getIcon( item.type ) }
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className={ `text-sm font-semibold ${!item.isRead ? 'text-gray-900' : 'text-gray-700'}` }>
                                        { item.title }
                                    </h4>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Clock size={ 12 } />
                                        { item.time }
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">{ item.message }</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={ () => toggleReadStatus( item.id ) }
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title={ item.isRead ? "Mark as unread" : "Mark as read" }
                                >
                                    <Check size={ 16 } />
                                </button>
                                <button
                                    onClick={ () => deleteNotification( item.id ) }
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={ 16 } />
                                </button>
                            </div>
                        </div>
                    ) )
                ) }
            </div>
        </div>
    );
};

export default Notification;
