'use client';

import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import { Badge, Button } from '@heroui/react';
import { formatRelativeTime } from '@/utils/formatters';
import { useState, useRef, useEffect } from 'react';

export default function NotificationBell() {
  const { data } = useNotifications({ limit: 10 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unread = data?.unread || 0;
  const notifications = data?.notifications || [];

  const handleMarkRead = (id) => {
    markRead.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button isIconOnly variant="light" size="sm" onPress={() => setIsOpen(!isOpen)}>
        <Badge content={unread > 0 ? (unread > 9 ? '9+' : unread) : null} color="danger" size="sm">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </Badge>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unread > 0 && (
              <Button size="sm" variant="light" color="primary" onPress={handleMarkAllRead}>
                Mark all read
              </Button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-gray-500">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}
                  onClick={() => handleMarkRead(n._id)}
                >
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(n.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
