'use client';

import { useState } from 'react';
import {
  useAdminStats,
  useAdminPendingCampaigns,
  useApproveCampaign,
  useRejectCampaign,
} from '@/hooks/useAdmin';
import { formatCurrency, formatDate } from '@/utils/formatters';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { motion } from 'framer-motion';

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, accent, isCurrency, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 * index, ease: 'easeOut' }}
      style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e5e0d8', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '18px', transition: 'transform 0.25s, box-shadow 0.25s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.10)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; }}
    >
      <div
        style={{ width: 56, height: 56, borderRadius: 14, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 13, color: '#888', margin: 0, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', margin: 0, lineHeight: 1 }}>
          {isCurrency ? formatCurrency(value) : Number(value).toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Campaign Status Badge ────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    pending: { bg: '#fff7e6', color: '#d97706', label: 'Pending' },
    approved: { bg: '#ecfdf5', color: '#059669', label: 'Approved' },
    rejected: { bg: '#fef2f2', color: '#dc2626', label: 'Rejected' },
    active: { bg: '#eff6ff', color: '#2563eb', label: 'Active' },
  };
  const s = map[status] || { bg: '#f3f4f6', color: '#6b7280', label: status };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 8, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>
      {s.label}
    </span>
  );
}

// ─── Reject Modal ─────────────────────────────────────────────────────────────

function RejectModal({ campaign, onClose, onConfirm, isPending }) {
  const [reason, setReason] = useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '90%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}>Reject Campaign</h3>
        <p style={{ fontSize: 13, color: '#888', margin: '0 0 20px' }}>
          Rejecting <strong>&quot;{campaign.title}&quot;</strong>. The creator will be notified.
        </p>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 6 }}>Reason (optional)</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Insufficient information, policy violation…"
          rows={3}
          style={{ width: '100%', border: '1px solid #d5cfc7', borderRadius: 10, padding: '10px 12px', fontSize: 14, resize: 'none', outline: 'none', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '9px 20px', borderRadius: 10, border: '1px solid #d5cfc7', background: 'white', color: '#555', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={isPending}
            style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: '#dc2626', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 14, opacity: isPending ? 0.6 : 1 }}
          >
            {isPending ? 'Rejecting…' : 'Confirm Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Campaign Approvals Table ─────────────────────────────────────────────────

function CampaignApprovalsTable() {
  const { data, isLoading } = useAdminPendingCampaigns();
  const approveMutation = useApproveCampaign();
  const rejectMutation = useRejectCampaign();

  const [rejectTarget, setRejectTarget] = useState(null); // campaign object for reject modal
  const [actionId, setActionId] = useState(null); // id of campaign being acted upon (for approve spinner)

  const campaigns = data?.campaigns || [];

  const handleApprove = (id) => {
    setActionId(id);
    approveMutation.mutate(id, { onSettled: () => setActionId(null) });
  };

  const handleRejectConfirm = (reason) => {
    if (!rejectTarget) return;
    rejectMutation.mutate({ id: rejectTarget._id, reason }, {
      onSettled: () => setRejectTarget(null),
    });
  };

  if (isLoading) return <div style={{ padding: '32px 0', textAlign: 'center', color: '#888' }}>Loading pending campaigns…</div>;

  return (
    <>
      {rejectTarget && (
        <RejectModal
          campaign={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleRejectConfirm}
          isPending={rejectMutation.isPending}
        />
      )}

      {campaigns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#aaa' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#888', margin: 0 }}>No pending campaigns — you&apos;re all caught up!</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f8f6f2', borderBottom: '2px solid #e5e0d8' }}>
                <th style={th}>Campaign</th>
                <th style={th}>Creator</th>
                <th style={th}>Category</th>
                <th style={th}>Goal</th>
                <th style={th}>Submitted</th>
                <th style={th}>Status</th>
                <th style={{ ...th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid #ede9e2', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#faf8f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {c.images?.[0] ? (
                        <img src={c.images[0]} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg,#667eea,#764ba2)', flexShrink: 0 }} />
                      )}
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: '#1a1a1a', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#aaa', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.shortDescription || c.description}</p>
                      </div>
                    </div>
                  </td>
                  <td style={td}>
                    <p style={{ margin: 0, fontWeight: 500, color: '#333' }}>{c.creatorName || '—'}</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#aaa' }}>{c.creatorEmail || ''}</p>
                  </td>
                  <td style={td}>
                    <span style={{ background: '#f0eee9', color: '#555', padding: '3px 9px', borderRadius: 8, fontSize: 12, fontWeight: 500, textTransform: 'capitalize' }}>
                      {c.category || 'Other'}
                    </span>
                  </td>
                  <td style={td}>
                    <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{formatCurrency(c.goalAmount)}</span>
                  </td>
                  <td style={{ ...td, color: '#888', whiteSpace: 'nowrap' }}>{formatDate(c.createdAt)}</td>
                  <td style={td}><StatusBadge status={c.status} /></td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleApprove(c._id)}
                        disabled={approveMutation.isPending && actionId === c._id}
                        style={{
                          padding: '7px 16px', borderRadius: 9, border: 'none',
                          background: 'linear-gradient(135deg,#10b981,#059669)',
                          color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                          opacity: (approveMutation.isPending && actionId === c._id) ? 0.6 : 1,
                          transition: 'opacity 0.2s, transform 0.1s',
                          boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        {approveMutation.isPending && actionId === c._id ? '…' : '✓ Approve'}
                      </button>
                      <button
                        onClick={() => setRejectTarget(c)}
                        disabled={rejectMutation.isPending}
                        style={{
                          padding: '7px 16px', borderRadius: 9, border: '1.5px solid #dc2626',
                          background: 'white', color: '#dc2626', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                          opacity: rejectMutation.isPending ? 0.6 : 1,
                          transition: 'background 0.2s, transform 0.1s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

const th = { padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' };
const td = { padding: '14px 16px', verticalAlign: 'middle', color: '#444' };

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { data, isLoading } = useAdminStats();
  const stats = data?.stats || {};

  const statCards = [
    { icon: '🙋', label: 'Total Supporters', key: 'totalSupporters', accent: '#eff6ff' },
    { icon: '🎨', label: 'Total Creators', key: 'totalCreators', accent: '#faf5ff' },
    { icon: '💳', label: 'Available Credits', key: 'totalAvailableCredits', accent: '#fff7ed' },
    { icon: '💸', label: 'Total Payments Processed', key: 'totalPaymentsProcessed', accent: '#f0fdf4', isCurrency: true },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div style={{ background: 'linear-gradient(135deg,#8B4513,#B3572E)', borderRadius: 20, padding: '28px 32px', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', right: 40, bottom: -50, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, position: 'relative' }}>Admin Dashboard</h1>
          <p style={{ fontSize: 14, margin: '6px 0 0', opacity: 0.85, position: 'relative' }}>Platform overview and campaign moderation</p>
        </div>
      </motion.div>

      {/* Stat Cards */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {statCards.map((s, idx) => (
            <StatCard
              key={s.key}
              icon={s.icon}
              label={s.label}
              value={stats[s.key] ?? 0}
              accent={s.accent}
              isCurrency={!!s.isCurrency}
              index={idx}
            />
          ))}
        </div>
      )}

      {/* Campaign Approvals */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ background: 'white', borderRadius: 20, border: '1px solid #e5e0d8', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #ede9e2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a', margin: 0, marginBottom: 2 }}>Campaign Approvals</h2>
            <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>Review and action all newly submitted campaigns</p>
          </div>
          <span style={{ background: '#fef3c7', color: '#d97706', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 700 }}>
            Pending Review
          </span>
        </div>
        <div style={{ padding: '8px 0' }}>
          <CampaignApprovalsTable />
        </div>
      </motion.div>
    </div>
  );
}
