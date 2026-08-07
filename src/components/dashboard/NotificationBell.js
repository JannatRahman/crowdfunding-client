'use client';

import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import { formatRelativeTime } from '@/utils/formatters';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ─── Icon map by keyword in message ──────────────────────────────────────────

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

// ─── Bell SVG ─────────────────────────────────────────────────────────────────

function BellIcon({ hasUnread }) {
  return (
    <svg
      width="22" height="22"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      style={{ color: hasUnread ? '#1a1a1a' : '#6b7280', display: 'block' }}
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NotificationBell() {
  const { data } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const router = useRouter();

  const unread = data?.unread || 0;
  const notifications = data?.notifications || [];

  // Close pop-up on any click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleNotificationClick = (n) => {
    if (!n.read) {
      markRead.mutate(n._id);
    }
    if (n.actionRoute) {
      setIsOpen(false);
      router.push(n.actionRoute);
    }
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    markAllRead.mutate();
  };

  return (
    <div ref={popupRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* ── Bell Button ── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: 'none',
          background: isOpen ? '#f0ece4' : 'transparent',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.background = '#f5f3ee'; }}
        onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.background = 'transparent'; }}
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
      >
        <BellIcon hasUnread={unread > 0} />

        {/* Unread badge */}
        {unread > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 3,
              right: 3,
              minWidth: 18,
              height: 18,
              borderRadius: 99,
              background: '#ef4444',
              color: 'white',
              fontSize: 10,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              border: '2px solid #fdf8f0',
              lineHeight: 1,
              fontFamily: 'inherit',
            }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* ── Floating Pop-up ── */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 10px)',
            width: 380,
            maxWidth: 'calc(100vw - 24px)',
            background: 'white',
            borderRadius: 18,
            boxShadow: '0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid #e5e0d8',
            zIndex: 9999,
            overflow: 'hidden',
            animation: 'notifSlideIn 0.18s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 18px 14px',
              borderBottom: '1px solid #f0ece4',
              background: '#faf8f4',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a', fontFamily: 'inherit' }}>
                Notifications
              </span>
              {unread > 0 && (
                <span
                  style={{
                    background: '#fef3c7',
                    color: '#d97706',
                    borderRadius: 99,
                    padding: '1px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {unread} new
                </span>
              )}
            </div>

            {unread > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markAllRead.isPending}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#6366f1',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 8,
                  transition: 'background 0.15s',
                  fontFamily: 'inherit',
                  opacity: markAllRead.isPending ? 0.5 : 1,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#eef2ff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🔔</div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#888', margin: 0 }}>
                  You're all caught up!
                </p>
                <p style={{ fontSize: 12, color: '#bbb', margin: '4px 0 0' }}>
                  No notifications yet.
                </p>
              </div>
            ) : (
              notifications.map((n, idx) => {
                const icon = getIcon(n.message);
                const isUnread = !n.read;
                const isLast = idx === notifications.length - 1;

                return (
                  <div
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '13px 18px',
                      cursor: n.actionRoute ? 'pointer' : 'default',
                      background: isUnread ? '#fffbeb' : 'white',
                      borderBottom: isLast ? 'none' : '1px solid #f5f2ec',
                      transition: 'background 0.12s',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isUnread ? '#fef9e0' : '#faf8f5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isUnread ? '#fffbeb' : 'white';
                    }}
                  >
                    {/* Icon */}
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: isUnread ? '#fef3c7' : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {icon}
                    </div>

                    {/* Body */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          lineHeight: 1.5,
                          color: '#1a1a1a',
                          fontWeight: isUnread ? 600 : 400,
                          wordBreak: 'break-word',
                        }}
                      >
                        {n.message}
                      </p>
                      <p style={{ margin: '4px 0 0', fontSize: 11, color: '#aaa' }}>
                        {formatRelativeTime(n.time || n.createdAt)}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {isUnread && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#f59e0b',
                          flexShrink: 0,
                          marginTop: 6,
                        }}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div
              style={{
                padding: '10px 18px',
                borderTop: '1px solid #f0ece4',
                background: '#faf8f4',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 12, color: '#bbb', fontStyle: 'italic' }}>
                Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Slide-in animation */}
      <style>{`
        @keyframes notifSlideIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1);    }
        }
      `}</style>
    </div>
  );
}
