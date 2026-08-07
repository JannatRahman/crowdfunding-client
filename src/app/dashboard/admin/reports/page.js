'use client';

import { useState } from 'react';
import { useAdminReports, useUpdateReport, useAdminDeleteCampaign, useSuspendCampaign } from '@/hooks/useAdmin';
import { formatDate, formatRelativeTime } from '@/utils/formatters';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

// ─── Report status badge ──────────────────────────────────────────────────────

const REPORT_STATUS = {
  pending:   { bg: '#fff7ed', color: '#d97706', label: '⏳ Pending'   },
  reviewed:  { bg: '#eff6ff', color: '#2563eb', label: '👁 Reviewed'  },
  resolved:  { bg: '#f0fdf4', color: '#16a34a', label: '✅ Resolved'  },
  dismissed: { bg: '#f3f4f6', color: '#6b7280', label: '🚫 Dismissed' },
};

function ReportBadge({ status }) {
  const s = REPORT_STATUS[status] || { bg: '#f3f4f6', color: '#6b7280', label: status };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 8, padding: '3px 10px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

// ─── Reason badge ─────────────────────────────────────────────────────────────

const REASON_ICONS = { fraud: '💰', inappropriate: '🔞', spam: '📧', other: '⚠️' };

function ReasonBadge({ reason }) {
  const icon = REASON_ICONS[reason?.toLowerCase()] || '⚠️';
  return (
    <span style={{ background: '#fef9ec', color: '#b45309', borderRadius: 8, padding: '3px 10px', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, textTransform: 'capitalize' }}>
      {icon} {reason || 'Other'}
    </span>
  );
}

// ─── Action Modal ─────────────────────────────────────────────────────────────

function ActionModal({ report, onClose, onSuspend, onDelete, onDismiss, isSuspending, isDeleting, isDismissing }) {
  if (!report) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '90%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}>Take Action on Report</h3>
        <p style={{ fontSize: 13, color: '#888', margin: '0 0 20px', lineHeight: 1.6 }}>
          Reporter: <strong>{report.reporterName || report.reporterEmail || 'Anonymous'}</strong> reported campaign:
        </p>
        <div style={{ background: '#f8f6f2', borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#1a1a1a', fontSize: 15 }}>{report.campaignTitle || 'Untitled Campaign'}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
            <ReasonBadge reason={report.reason} />
            <span style={{ fontSize: 12, color: '#aaa', display: 'flex', alignItems: 'center' }}>
              {formatDate(report.createdAt)}
            </span>
          </div>
          {report.description && (
            <p style={{ margin: '10px 0 0', fontSize: 13, color: '#666', lineHeight: 1.6, fontStyle: 'italic' }}>
              &quot;{report.description}&quot;
            </p>
          )}
        </div>

        <p style={{ fontSize: 13, fontWeight: 600, color: '#444', margin: '0 0 12px' }}>Choose an action:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Suspend */}
          <button
            onClick={onSuspend}
            disabled={isSuspending}
            style={{ padding: '12px 20px', borderRadius: 11, border: 'none', background: 'linear-gradient(135deg,#9333ea,#7c3aed)', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', textAlign: 'left', opacity: isSuspending ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span style={{ fontSize: 20 }}>⏸️</span>
            <div>
              <div>{isSuspending ? 'Suspending…' : 'Suspend Campaign'}</div>
              <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 400 }}>Hides the campaign from supporters pending review</div>
            </div>
          </button>

          {/* Delete */}
          <button
            onClick={onDelete}
            disabled={isDeleting}
            style={{ padding: '12px 20px', borderRadius: 11, border: 'none', background: 'linear-gradient(135deg,#dc2626,#b91c1c)', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', textAlign: 'left', opacity: isDeleting ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span style={{ fontSize: 20 }}>🗑️</span>
            <div>
              <div>{isDeleting ? 'Deleting…' : 'Delete Campaign'}</div>
              <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 400 }}>Permanently removes the campaign and refunds backers</div>
            </div>
          </button>

          {/* Dismiss */}
          <button
            onClick={onDismiss}
            disabled={isDismissing}
            style={{ padding: '12px 20px', borderRadius: 11, border: '1.5px solid #d5cfc7', background: 'white', color: '#555', fontWeight: 700, fontSize: 14, cursor: 'pointer', textAlign: 'left', opacity: isDismissing ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span style={{ fontSize: 20 }}>🚫</span>
            <div>
              <div>{isDismissing ? 'Dismissing…' : 'Dismiss Report'}</div>
              <div style={{ fontSize: 12, color: '#aaa', fontWeight: 400 }}>Mark as reviewed with no action needed</div>
            </div>
          </button>
        </div>

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: 10, border: '1px solid #d5cfc7', background: 'white', color: '#555', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Table styles ─────────────────────────────────────────────────────────────

const th = { padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' };
const td = { padding: '14px 16px', verticalAlign: 'middle', color: '#444' };

// ─── Pager ────────────────────────────────────────────────────────────────────

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

const STATUS_FILTERS = [
  { value: '',          label: '📋 All Statuses' },
  { value: 'pending',   label: '⏳ Pending'       },
  { value: 'reviewed',  label: '👁 Reviewed'      },
  { value: 'resolved',  label: '✅ Resolved'      },
  { value: 'dismissed', label: '🚫 Dismissed'     },
];

export default function AdminReports() {
  const [page, setPage]               = useState(1);
  const [statusFilter, setFilter]     = useState('');
  const [activeReport, setActiveReport] = useState(null);

  const { data, isLoading }  = useAdminReports({ page, limit: 20, status: statusFilter });
  const updateReport         = useUpdateReport();
  const deleteCampaign       = useAdminDeleteCampaign();
  const suspendCampaign      = useSuspendCampaign();

  const reports    = data?.reports    || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  const closeModal = () => setActiveReport(null);

  const handleSuspend = () => {
    if (!activeReport?.campaignId) return;
    suspendCampaign.mutate(activeReport.campaignId, {
      onSuccess: () => {
        updateReport.mutate({ id: activeReport._id, status: 'resolved', adminNote: 'Campaign suspended.' });
        closeModal();
      },
    });
  };

  const handleDelete = () => {
    if (!activeReport?.campaignId) return;
    deleteCampaign.mutate(activeReport.campaignId, {
      onSuccess: () => {
        updateReport.mutate({ id: activeReport._id, status: 'resolved', adminNote: 'Campaign deleted.' });
        closeModal();
      },
    });
  };

  const handleDismiss = () => {
    if (!activeReport) return;
    updateReport.mutate({ id: activeReport._id, status: 'dismissed', adminNote: 'Report dismissed — no action needed.' }, {
      onSuccess: closeModal,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <ActionModal
        report={activeReport}
        onClose={closeModal}
        onSuspend={handleSuspend}
        onDelete={handleDelete}
        onDismiss={handleDismiss}
        isSuspending={suspendCampaign.isPending}
        isDeleting={deleteCampaign.isPending}
        isDismissing={updateReport.isPending}
      />

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a1a', margin: 0, marginBottom: 4 }}>Campaign Reports</h1>
        <p style={{ fontSize: 14, color: '#888', margin: 0 }}>Campaigns reported as suspicious or fraudulent by supporters</p>
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <select value={statusFilter} onChange={e => { setFilter(e.target.value); setPage(1); }}
            style={{ appearance: 'none', WebkitAppearance: 'none', padding: '10px 36px 10px 14px', borderRadius: 10, border: '1.5px solid #d5cfc7', background: 'white', fontSize: 14, fontWeight: 600, color: '#333', cursor: 'pointer', outline: 'none', minWidth: 165 }}
            onFocus={e => (e.currentTarget.style.borderColor = '#6366f1')}
            onBlur={e => (e.currentTarget.style.borderColor = '#d5cfc7')}
          >
            {STATUS_FILTERS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#999', fontSize: 11 }}>▼</span>
        </div>
        <span style={{ marginLeft: 'auto', background: '#fef3c7', color: '#d97706', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
          {pagination.total} report{pagination.total !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table card */}
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e5e0d8', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 64, display: 'flex', justifyContent: 'center' }}><LoadingSpinner /></div>
        ) : reports.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🛡️</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#888', margin: 0 }}>No reports found</p>
            <p style={{ fontSize: 13, color: '#bbb', margin: '4px 0 0' }}>No suspicious activity has been flagged.</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f8f6f2', borderBottom: '2px solid #e5e0d8' }}>
                    <th style={th}>#</th>
                    <th style={th}>Reporter</th>
                    <th style={th}>Campaign</th>
                    <th style={th}>Reason</th>
                    <th style={th}>Description</th>
                    <th style={th}>Date</th>
                    <th style={th}>Status</th>
                    <th style={{ ...th, textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, idx) => (
                    <tr key={r._id}
                      style={{ borderBottom: '1px solid #ede9e2', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#faf8f5')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* # */}
                      <td style={{ ...td, color: '#bbb', fontWeight: 600, fontSize: 13 }}>{(page - 1) * 20 + idx + 1}</td>

                      {/* Reporter */}
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                            {(r.reporterName || r.reporterEmail || '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap' }}>{r.reporterName || '—'}</p>
                            <p style={{ margin: 0, fontSize: 12, color: '#aaa' }}>{r.reporterEmail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Campaign */}
                      <td style={td}>
                        <p style={{ margin: 0, fontWeight: 600, color: '#1a1a1a', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.campaignTitle || <span style={{ color: '#aaa', fontStyle: 'italic' }}>Campaign deleted</span>}
                        </p>
                      </td>

                      {/* Reason */}
                      <td style={td}><ReasonBadge reason={r.reason} /></td>

                      {/* Description */}
                      <td style={{ ...td, maxWidth: 220 }}>
                        {r.description ? (
                          <p style={{ margin: 0, color: '#666', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                            {r.description}
                          </p>
                        ) : (
                          <span style={{ color: '#ccc', fontSize: 13 }}>—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td style={{ ...td, whiteSpace: 'nowrap' }}>
                        <p style={{ margin: 0, fontSize: 13, color: '#666' }}>{formatDate(r.createdAt)}</p>
                        <p style={{ margin: 0, fontSize: 11, color: '#aaa' }}>{formatRelativeTime(r.createdAt)}</p>
                      </td>

                      {/* Status */}
                      <td style={td}><ReportBadge status={r.status} /></td>

                      {/* Action */}
                      <td style={{ ...td, textAlign: 'center' }}>
                        {r.status === 'pending' || r.status === 'reviewed' ? (
                          <button
                            onClick={() => setActiveReport(r)}
                            style={{
                              padding: '7px 16px', borderRadius: 9, border: 'none',
                              background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                              color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                              whiteSpace: 'nowrap', transition: 'transform 0.1s, box-shadow 0.15s',
                              boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                          >
                            ⚡ Take Action
                          </button>
                        ) : (
                          <span style={{ fontSize: 13, color: '#bbb', fontStyle: 'italic' }}>
                            {r.adminNote || 'Closed'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
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
