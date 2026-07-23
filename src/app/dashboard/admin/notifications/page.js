'use client';

import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import { formatRelativeTime } from '@/utils/formatters';
import { Button, Card, CardContent } from '@heroui/react';
import Pagination from '@/components/shared/Pagination';
import { useState } from 'react';

const typeIcon = {
  contribution: '💰',
  campaign_update: '📋',
  withdrawal: '💸',
  system: '🔔',
  report: '⚠️',
};

export default function AdminNotifications() {
  const [page, setPage] = useState(1);
  const { data } = useNotifications({ page, limit: 20 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const notifications = data?.notifications || [];
  const pagination = data?.pagination || { pages: 1, page: 1 };
  const unread = data?.unread || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unread > 0 && <p className="text-sm text-gray-500">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <Button variant="bordered" onPress={() => markAllRead.mutate()}>
            Mark All Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No notifications</p>
      ) : (
        <>
          <div className="space-y-3">
            {notifications.map((n) => (
              <Card key={n._id}>
                <CardContent
                  className={`flex items-start gap-3 p-4 cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}
                  onClick={() => !n.read && markRead.mutate(n._id)}
                >
                  <span className="text-2xl">{typeIcon[n.type] || '🔔'}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(n.createdAt)}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />}
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
