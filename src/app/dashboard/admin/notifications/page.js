'use client';

import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import { formatDate, formatRelativeTime } from '@/utils/formatters';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Icon helper ──────────────────────────────────────────────────────────────

function getIcon(message = '') {
  const m = message.toLowerCase();
  if (m.includes('approved') && m.includes('contribution')) return '✅';
  if (m.includes('rejected') && m.includes('contribution')) return '❌';
  if (m.includes('new contribution') || m.includes('made a new')) return '💰';
  if (m.includes('withdrawal')) return '💸';
  if (m.includes('campaign') && m.includes('approved')) return '🎉';
  if (m.includes('campaign') && m.includes('rejected')) return '⛔';
  if (m.includes('suspended')) return '⏸️';
  if (m.includes('deleted') || m.includes('removed')) return '🗑️';
  return '🔔';
}

const th = { padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' };
const td = { padding: '14px 16px', verticalAlign: 'middle', color: '#444', fontSize: 14 };

export default function AdminNotifications() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { data } = useNotifications({ page, limit: 20 });
  const markRead    = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = data?.notifications || [];
  const unread = data?.unread || 0;

  // client-side pagination slice (server returns all, we page locally)
  const LIMIT = 20;
  const total = notifications.length;
  const pages = Math.ceil(total / LIMIT) || 1;
  const paged = notifications.slice((page - 1) * LIMIT, page * LIMIT);

  const handleClick = (n) => {
    if (!n.read) markRead.mutate(n._id);
    if (n.actionRoute) router.push(n.actionRoute);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a1a', margin: 0, marginBottom: 4 }}>Notifications</h1>
          <p style={{ fontSize: 14, color: '#888', margin: 0 }}>
            {unread > 0 ? `${unread} unread notification${unread !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            style={{
              padding: '9px 18px', borderRadius: 10, border: '1.5px solid #d5cfc7',
              background: 'white', color: '#555', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f8f6f2')}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}
          >
            ✓ Mark All Read
          </button>
        )}
      </div>

      {/* Table card */}
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e5e0d8', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🔔</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#888', margin: 0 }}>No notifications yet</p>
            <p style={{ fontSize: 13, color: '#bbb', margin: '6px 0 0' }}>System notifications will appear here.</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f6f2', borderBottom: '2px solid #e5e0d8' }}>
                    <th style={th}>#</th>
                    <th style={th}>Message</th>
                    <th style={th}>To</th>
                    <th style={th}>Time</th>
                    <th style={{ ...th, textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((n, idx) => (
                    <tr
                      key={n._id}
                      onClick={() => handleClick(n)}
                      style={{
                        borderBottom: '1px solid #ede9e2',
                        background: !n.read ? '#fffbeb' : 'white',
                        cursor: n.actionRoute ? 'pointer' : 'default',
                        transition: 'background 0.12s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = !n.read ? '#fef9e0' : '#faf8f5')}
                      onMouseLeave={e => (e.currentTarget.style.background = !n.read ? '#fffbeb' : 'white')}
                    >
                      <td style={{ ...td, color: '#bbb', fontWeight: 600, fontSize: 13 }}>
                        {(page - 1) * LIMIT + idx + 1}
                      </td>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <span style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: !n.read ? '#fef3c7' : '#f3f4f6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 15, flexShrink: 0,
                          }}>
                            {getIcon(n.message)}
                          </span>
                          <p style={{ margin: 0, fontSize: 13, color: '#1a1a1a', fontWeight: !n.read ? 600 : 400, lineHeight: 1.5, maxWidth: 420 }}>
                            {n.message}
                          </p>
                        </div>
                      </td>
                      <td style={{ ...td, whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: 12, color: '#555', background: '#f0ece4', padding: '3px 9px', borderRadius: 8, fontWeight: 500 }}>
                          {n.toEmail || '—'}
                        </span>
                      </td>
                      <td style={{ ...td, whiteSpace: 'nowrap' }}>
                        <p style={{ margin: 0, fontSize: 13, color: '#666' }}>{formatDate(n.time || n.createdAt)}</p>
                        <p style={{ margin: 0, fontSize: 11, color: '#aaa' }}>{formatRelativeTime(n.time || n.createdAt)}</p>
                      </td>
                      <td style={{ ...td, textAlign: 'center' }}>
                        {n.read ? (
                          <span style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic' }}>Read</span>
                        ) : (
                          <span style={{
                            background: '#fef3c7', color: '#d97706',
                            borderRadius: 99, padding: '3px 10px',
                            fontSize: 11, fontWeight: 700,
                          }}>
                            Unread
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px 0', borderTop: '1px solid #ede9e2' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #d5cfc7', background: 'white', color: page <= 1 ? '#ccc' : '#333', cursor: page <= 1 ? 'default' : 'pointer', fontWeight: 600, fontSize: 13 }}
                >
                  ← Prev
                </button>
                <span style={{ fontSize: 13, color: '#888', padding: '0 8px' }}>Page {page} of {pages}</span>
                <button
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  disabled={page >= pages}
                  style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #d5cfc7', background: 'white', color: page >= pages ? '#ccc' : '#333', cursor: page >= pages ? 'default' : 'pointer', fontWeight: 600, fontSize: 13 }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
