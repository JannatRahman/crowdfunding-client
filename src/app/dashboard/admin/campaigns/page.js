'use client';

import { useState } from 'react';
import { useAdminAllCampaigns, useAdminDeleteCampaign } from '@/hooks/useAdmin';
import { formatCurrency, formatDate, getProgressPercent } from '@/utils/formatters';
import { useDebounce } from '@/hooks/useDebounce';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_MAP = {
  pending:   { bg: '#fff7ed', color: '#d97706', label: 'Pending'   },
  approved:  { bg: '#eff6ff', color: '#2563eb', label: 'Approved'  },
  active:    { bg: '#f0fdf4', color: '#16a34a', label: 'Active'    },
  funded:    { bg: '#ecfdf5', color: '#059669', label: 'Funded'    },
  rejected:  { bg: '#fef2f2', color: '#dc2626', label: 'Rejected'  },
  suspended: { bg: '#fdf4ff', color: '#9333ea', label: 'Suspended' },
  expired:   { bg: '#f3f4f6', color: '#6b7280', label: 'Expired'   },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { bg: '#f3f4f6', color: '#6b7280', label: status };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 8, padding: '3px 10px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

// ─── Progress mini bar ────────────────────────────────────────────────────────

function MiniProgress({ pct }) {
  return (
    <div style={{ width: '100%', height: 5, background: '#f0ece4', borderRadius: 99, overflow: 'hidden', minWidth: 80 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#10b981,#059669)', borderRadius: 99, transition: 'width 0.4s' }} />
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteModal({ campaign, onClose, onConfirm, isPending }) {
  if (!campaign) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '90%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 16px' }}>🗑️</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: '#1a1a1a', textAlign: 'center' }}>Delete Campaign</h3>
        <p style={{ fontSize: 13, color: '#888', textAlign: 'center', margin: '0 0 16px', lineHeight: 1.6 }}>
          You are about to permanently delete:
        </p>
        <div style={{ background: '#f8f6f2', borderRadius: 10, padding: '12px 16px', margin: '0 0 16px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#1a1a1a', fontSize: 15 }}>{campaign.title}</p>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: 13 }}>by {campaign.creatorName || campaign.creatorEmail}</p>
        </div>
        <ul style={{ fontSize: 12, color: '#888', margin: '0 0 20px', paddingLeft: 18, lineHeight: 2 }}>
          <li>All contributions will be marked <strong>refunded</strong></li>
          <li>Approved backers will have their credits restored</li>
          <li>This action <strong>cannot be undone</strong></li>
        </ul>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #d5cfc7', background: 'white', color: '#555', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#dc2626', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14, opacity: isPending ? 0.6 : 1 }}
          >
            {isPending ? 'Deleting…' : '🗑️ Delete Campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Table styles ─────────────────────────────────────────────────────────────

const th = { padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' };
const td = { padding: '14px 16px', verticalAlign: 'middle', color: '#444' };

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pager({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px 0' }}>
      <button onClick={() => onChange(page - 1)} disabled={page <= 1}
        style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #d5cfc7', background: 'white', color: page <= 1 ? '#ccc' : '#333', cursor: page <= 1 ? 'default' : 'pointer', fontWeight: 600, fontSize: 13 }}>
        ← Prev
      </button>
      <span style={{ fontSize: 13, color: '#888', padding: '0 8px' }}>Page {page} of {pages}</span>
      <button onClick={() => onChange(page + 1)} disabled={page >= pages}
        style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #d5cfc7', background: 'white', color: page >= pages ? '#ccc' : '#333', cursor: page >= pages ? 'default' : 'pointer', fontWeight: 600, fontSize: 13 }}>
        Next →
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ['', 'pending', 'approved', 'active', 'funded', 'rejected', 'suspended', 'expired'];

export default function AdminCampaigns() {
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('');
  const [deleteTarget, setDelete]   = useState(null);

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useAdminAllCampaigns({ page, limit: 15, search: debouncedSearch, status: statusFilter });
  const deleteMutation = useAdminDeleteCampaign();

  const campaigns  = data?.campaigns  || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget._id, { onSuccess: () => setDelete(null) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <DeleteModal campaign={deleteTarget} onClose={() => setDelete(null)} onConfirm={handleDelete} isPending={deleteMutation.isPending} />

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a1a', margin: 0, marginBottom: 4 }}>Manage Campaigns</h1>
        <p style={{ fontSize: 14, color: '#888', margin: 0 }}>View and manage all campaigns on the platform</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 400 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#aaa' }}>🔍</span>
          <input
            type="text" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title or creator…"
            style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 10, border: '1.5px solid #d5cfc7', fontSize: 14, outline: 'none', background: 'white', boxSizing: 'border-box' }}
            onFocus={e => (e.currentTarget.style.borderColor = '#6366f1')}
            onBlur={e => (e.currentTarget.style.borderColor = '#d5cfc7')}
          />
        </div>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <select value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1); }}
            style={{ appearance: 'none', WebkitAppearance: 'none', padding: '10px 36px 10px 14px', borderRadius: 10, border: '1.5px solid #d5cfc7', background: 'white', fontSize: 14, fontWeight: 600, color: '#333', cursor: 'pointer', outline: 'none', minWidth: 160 }}
            onFocus={e => (e.currentTarget.style.borderColor = '#6366f1')}
            onBlur={e => (e.currentTarget.style.borderColor = '#d5cfc7')}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s === '' ? '📋 All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#999', fontSize: 11 }}>▼</span>
        </div>
        <span style={{ marginLeft: 'auto', background: '#f0eee9', color: '#666', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
          {pagination.total.toLocaleString()} campaign{pagination.total !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table card */}
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e5e0d8', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 64, display: 'flex', justifyContent: 'center' }}><LoadingSpinner /></div>
        ) : campaigns.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📋</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#888', margin: 0 }}>No campaigns found</p>
            <p style={{ fontSize: 13, color: '#bbb', margin: '4px 0 0' }}>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f8f6f2', borderBottom: '2px solid #e5e0d8' }}>
                    <th style={th}>#</th>
                    <th style={th}>Campaign</th>
                    <th style={th}>Creator</th>
                    <th style={th}>Category</th>
                    <th style={th}>Goal</th>
                    <th style={th}>Raised</th>
                    <th style={th}>Progress</th>
                    <th style={th}>Status</th>
                    <th style={th}>Created</th>
                    <th style={{ ...th, textAlign: 'center' }}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {/* C7: Filter out any campaign docs with a missing _id before mapping */}
                  {campaigns.filter(c => c._id).map((c, idx) => {
                    const pct = getProgressPercent(c.currentAmount, c.goalAmount);
                    return (
                      <tr key={c._id} style={{ borderBottom: '1px solid #ede9e2', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#faf8f5')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ ...td, color: '#bbb', fontWeight: 600, fontSize: 13 }}>{(page - 1) * 15 + idx + 1}</td>

                        {/* Campaign */}
                        <td style={td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {c.images?.[0] ? (
                              <img src={c.images[0]} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg,#667eea,#764ba2)', flexShrink: 0 }} />
                            )}
                            <div style={{ minWidth: 0 }}>
                              <p style={{ margin: 0, fontWeight: 600, color: '#1a1a1a', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</p>
                            </div>
                          </div>
                        </td>

                        {/* Creator */}
                        <td style={td}>
                          <p style={{ margin: 0, fontWeight: 500, color: '#333', whiteSpace: 'nowrap' }}>{c.creatorName || '—'}</p>
                          <p style={{ margin: 0, fontSize: 12, color: '#aaa' }}>{c.creatorEmail}</p>
                        </td>

                        {/* Category */}
                        <td style={td}>
                          <span style={{ background: '#f0eee9', color: '#555', padding: '3px 9px', borderRadius: 8, fontSize: 12, fontWeight: 500, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                            {c.category || 'Other'}
                          </span>
                        </td>

                        {/* Goal */}
                        <td style={{ ...td, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap' }}>{formatCurrency(c.goalAmount)}</td>

                        {/* Raised */}
                        <td style={{ ...td, fontWeight: 600, color: '#059669', whiteSpace: 'nowrap' }}>{formatCurrency(c.currentAmount)}</td>

                        {/* Progress */}
                        <td style={{ ...td, minWidth: 100 }}>
                          <MiniProgress pct={pct} />
                          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#aaa' }}>{pct}%</p>
                        </td>

                        {/* Status */}
                        <td style={td}><StatusBadge status={c.status} /></td>

                        {/* Created */}
                        <td style={{ ...td, color: '#888', whiteSpace: 'nowrap', fontSize: 13 }}>{formatDate(c.createdAt)}</td>

                        {/* Delete */}
                        <td style={{ ...td, textAlign: 'center' }}>
                          <button
                            onClick={() => setDelete(c)}
                            style={{
                              padding: '7px 16px', borderRadius: 9, border: '1.5px solid #dc2626',
                              background: 'white', color: '#dc2626', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                              whiteSpace: 'nowrap', transition: 'background 0.15s, transform 0.1s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'scale(1)'; }}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ borderTop: '1px solid #ede9e2' }}>
              <Pager page={pagination.page} pages={pagination.pages} onChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
