'use client';

import { useState } from 'react';
import { usePendingWithdrawals, useApproveWithdrawal } from '@/hooks/useWithdrawals';
import { formatCurrency, formatDate } from '@/utils/formatters';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

// ─── Payment Method Badge ─────────────────────────────────────────────────────

function PaymentBadge({ method }) {
  const map = {
    stripe: { bg: '#eff6ff', color: '#1d4ed8', label: '💳 Stripe' },
    bkash: { bg: '#fdf4ff', color: '#9333ea', label: '📱 bKash' },
    nagad: { bg: '#fff7ed', color: '#ea580c', label: '📱 Nagad' },
    bank: { bg: '#f0fdf4', color: '#16a34a', label: '🏦 Bank' },
  };
  const key = (method || '').toLowerCase();
  const s = map[key] || { bg: '#f3f4f6', color: '#6b7280', label: method || 'N/A' };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 8, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>
      {s.label}
    </span>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

function ConfirmSuccessModal({ withdrawal, onClose, onConfirm, isPending }) {
  if (!withdrawal) return null;
  const credits = withdrawal.withdrawal_credit || 0;
  const usd = withdrawal.withdrawal_amount || (credits / 20);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '90%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        {/* Icon */}
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>
          💸
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: '#1a1a1a', textAlign: 'center' }}>
          Confirm Payment
        </h3>
        <p style={{ fontSize: 13, color: '#888', margin: '0 0 20px', textAlign: 'center', lineHeight: 1.6 }}>
          You are about to mark this withdrawal as <strong>Payment Successful</strong>. This will:
        </p>

        {/* Summary box */}
        <div style={{ background: '#f8f6f2', borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontSize: 13, lineHeight: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#888' }}>Creator</span>
            <span style={{ fontWeight: 600, color: '#333' }}>{withdrawal.creator_name || withdrawal.creator_email}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#888' }}>Amount</span>
            <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{credits} credits (≈ ${Number(usd).toFixed(2)})</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#888' }}>Via</span>
            <span style={{ fontWeight: 600, color: '#333' }}>{withdrawal.payment_system || '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#888' }}>Account</span>
            <span style={{ fontWeight: 600, color: '#333' }}>{withdrawal.account_number || '—'}</span>
          </div>
        </div>

        <ul style={{ fontSize: 12, color: '#666', margin: '0 0 24px', paddingLeft: 18, lineHeight: 2 }}>
          <li>Set withdrawal status → <strong>approved</strong></li>
          <li>Deduct <strong>{credits} credits</strong> from the creator&apos;s raised balance</li>
          <li>Send the creator a payment notification</li>
        </ul>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #d5cfc7', background: 'white', color: '#555', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            style={{
              padding: '10px 22px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg,#10b981,#059669)',
              color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14,
              opacity: isPending ? 0.6 : 1,
              boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
            }}
          >
            {isPending ? 'Processing…' : '✓ Confirm Payment Success'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Table styles ─────────────────────────────────────────────────────────────

const th = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: 12,
  color: '#888',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  whiteSpace: 'nowrap',
};
const td = { padding: '16px', verticalAlign: 'middle', color: '#444' };

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminWithdrawals() {
  const [confirmTarget, setConfirmTarget] = useState(null);

  const { data, isLoading } = usePendingWithdrawals({ limit: 50 });
  const approveMutation = useApproveWithdrawal();

  const withdrawals = data?.withdrawals || [];

  const handleConfirm = () => {
    if (!confirmTarget) return;
    approveMutation.mutate(
      { id: confirmTarget._id, adminNote: '' },
      { onSettled: () => setConfirmTarget(null) }
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Confirm modal */}
      <ConfirmSuccessModal
        withdrawal={confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleConfirm}
        isPending={approveMutation.isPending}
      />

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a1a', margin: 0, marginBottom: 4 }}>
          Withdrawal Requests
        </h1>
        <p style={{ fontSize: 14, color: '#888', margin: 0 }}>
          Review and process pending creator withdrawal requests
        </p>
      </div>

      {/* Card */}
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e5e0d8', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {/* Card header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #ede9e2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: 0, marginBottom: 2 }}>Pending Withdrawals</h2>
            <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>Click &quot;Payment Success&quot; once you&apos;ve sent the funds to the creator</p>
          </div>
          <span style={{ background: '#fef3c7', color: '#d97706', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 700 }}>
            {withdrawals.length} Pending
          </span>
        </div>

        {/* Body */}
        {isLoading ? (
          <div style={{ padding: 48, display: 'flex', justifyContent: 'center' }}>
            <LoadingSpinner />
          </div>
        ) : withdrawals.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#888', margin: 0 }}>No pending withdrawal requests</p>
            <p style={{ fontSize: 13, color: '#bbb', margin: '4px 0 0' }}>All caught up — nothing to process right now.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f8f6f2', borderBottom: '2px solid #e5e0d8' }}>
                  <th style={th}>#</th>
                  <th style={th}>Creator</th>
                  <th style={th}>Credits</th>
                  <th style={th}>Amount (USD)</th>
                  <th style={th}>Payment Method</th>
                  <th style={th}>Account</th>
                  <th style={th}>Submitted</th>
                  <th style={{ ...th, textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w, idx) => (
                  <tr
                    key={w._id}
                    style={{ borderBottom: '1px solid #ede9e2', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#faf8f5')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Row number */}
                    <td style={{ ...td, color: '#bbb', fontWeight: 600 }}>{idx + 1}</td>

                    {/* Creator */}
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'linear-gradient(135deg,#667eea,#764ba2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0,
                        }}>
                          {(w.creator_name || w.creator_email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: '#1a1a1a' }}>{w.creator_name || '—'}</p>
                          <p style={{ margin: 0, fontSize: 12, color: '#aaa' }}>{w.creator_email || ''}</p>
                        </div>
                      </div>
                    </td>

                    {/* Credits */}
                    <td style={td}>
                      <span style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 15 }}>
                        {(w.withdrawal_credit || 0).toLocaleString()}
                      </span>
                      <span style={{ color: '#aaa', fontSize: 12, marginLeft: 4 }}>cr</span>
                    </td>

                    {/* USD Amount */}
                    <td style={td}>
                      <span style={{ fontWeight: 700, color: '#059669', fontSize: 15 }}>
                        {formatCurrency(w.withdrawal_amount || (w.withdrawal_credit / 20))}
                      </span>
                    </td>

                    {/* Payment method */}
                    <td style={td}><PaymentBadge method={w.payment_system} /></td>

                    {/* Account */}
                    <td style={{ ...td, fontFamily: 'monospace', fontSize: 13, color: '#555' }}>
                      {w.account_number || '—'}
                    </td>

                    {/* Date */}
                    <td style={{ ...td, color: '#888', whiteSpace: 'nowrap' }}>
                      {formatDate(w.createdAt || w.withdraw_date)}
                    </td>

                    {/* Action */}
                    <td style={{ ...td, textAlign: 'center' }}>
                      <button
                        onClick={() => setConfirmTarget(w)}
                        disabled={approveMutation.isPending}
                        style={{
                          padding: '9px 18px',
                          borderRadius: 10,
                          border: 'none',
                          background: 'linear-gradient(135deg,#10b981,#059669)',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          opacity: approveMutation.isPending ? 0.6 : 1,
                          transition: 'transform 0.15s, box-shadow 0.15s',
                          boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,185,129,0.4)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(16,185,129,0.3)';
                        }}
                      >
                        💸 Payment Success
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
