'use client';

import { useState } from 'react';
import { useAdminUsers, useChangeUserRole, useDeleteUser } from '@/hooks/useAdmin';
import { formatDate } from '@/utils/formatters';
import { useDebounce } from '@/hooks/useDebounce';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

// ─── Role config ──────────────────────────────────────────────────────────────

const ROLE_CONFIG = {
  admin:     { bg: '#fef2f2', color: '#dc2626', label: 'Admin',     icon: '🛡️' },
  creator:   { bg: '#eff6ff', color: '#2563eb', label: 'Creator',   icon: '🎨' },
  supporter: { bg: '#f0fdf4', color: '#16a34a', label: 'Supporter', icon: '🙋' },
};

function RoleBadge({ role }) {
  const cfg = ROLE_CONFIG[role] || { bg: '#f3f4f6', color: '#6b7280', label: role, icon: '👤' };
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      borderRadius: 8, padding: '3px 10px',
      fontSize: 12, fontWeight: 700,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ src, name }) {
  const initial = (name || '?')[0].toUpperCase();
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #e5e0d8' }}
        onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
      />
    );
  }
  return (
    <div style={{
      width: 38, height: 38, borderRadius: '50%',
      background: 'linear-gradient(135deg,#667eea,#764ba2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0,
    }}>
      {initial}
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteModal({ user, onClose, onConfirm, isPending }) {
  if (!user) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '90%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 16px' }}>🗑️</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: '#1a1a1a', textAlign: 'center' }}>Remove User</h3>
        <p style={{ fontSize: 13, color: '#888', textAlign: 'center', margin: '0 0 8px', lineHeight: 1.6 }}>
          You are about to permanently delete:
        </p>
        <div style={{ background: '#f8f6f2', borderRadius: 10, padding: '12px 16px', margin: '0 0 20px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#1a1a1a', fontSize: 15 }}>{user.name || '—'}</p>
          <p style={{ margin: '2px 0 0', color: '#888', fontSize: 13 }}>{user.email}</p>
        </div>
        <p style={{ fontSize: 12, color: '#dc2626', textAlign: 'center', margin: '0 0 24px' }}>
          ⚠️ This action <strong>cannot be undone</strong>.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #d5cfc7', background: 'white', color: '#555', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#dc2626', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14, opacity: isPending ? 0.6 : 1 }}
          >
            {isPending ? 'Removing…' : 'Yes, Remove'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Role Dropdown ────────────────────────────────────────────────────────────

function RoleDropdown({ userId, currentRole, onChangeRole, isChanging }) {
  const [localRole, setLocalRole] = useState(currentRole);

  const handleChange = (e) => {
    const newRole = e.target.value;
    if (newRole === localRole) return;
    setLocalRole(newRole);
    onChangeRole(userId, newRole);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select
        value={localRole}
        onChange={handleChange}
        disabled={isChanging}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          padding: '7px 32px 7px 12px',
          borderRadius: 9,
          border: '1.5px solid #d5cfc7',
          background: 'white',
          fontSize: 13,
          fontWeight: 600,
          color: '#333',
          cursor: 'pointer',
          outline: 'none',
          minWidth: 118,
          opacity: isChanging ? 0.6 : 1,
          transition: 'border-color 0.2s',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = '#6366f1')}
        onBlur={e => (e.currentTarget.style.borderColor = '#d5cfc7')}
      >
        <option value="admin">🛡️ Admin</option>
        <option value="creator">🎨 Creator</option>
        <option value="supporter">🙋 Supporter</option>
      </select>
      {/* Chevron icon */}
      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#999', fontSize: 11 }}>▼</span>
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
const td = { padding: '14px 16px', verticalAlign: 'middle', color: '#444' };

// ─── Pagination ───────────────────────────────────────────────────────────────

function SimplePagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px 0' }}>
      <button
        onClick={() => onChange(page - 1)} disabled={page <= 1}
        style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #d5cfc7', background: 'white', color: page <= 1 ? '#ccc' : '#333', cursor: page <= 1 ? 'default' : 'pointer', fontWeight: 600, fontSize: 13 }}
      >← Prev</button>
      <span style={{ fontSize: 13, color: '#888', padding: '0 8px' }}>Page {page} of {pages}</span>
      <button
        onClick={() => onChange(page + 1)} disabled={page >= pages}
        style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #d5cfc7', background: 'white', color: page >= pages ? '#ccc' : '#333', cursor: page >= pages ? 'default' : 'pointer', fontWeight: 600, fontSize: 13 }}
      >Next →</button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminUsers() {
  const [page, setPage]               = useState(1);
  const [search, setSearch]           = useState('');
  const [roleFilter, setRoleFilter]   = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null); // full user object
  const [changingId, setChangingId]   = useState(null);  // id of user whose role is being updated

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useAdminUsers({ page, limit: 20, search: debouncedSearch, role: roleFilter });
  const changeRole = useChangeUserRole();
  const deleteUser = useDeleteUser();

  const users      = data?.users       || [];
  const pagination = data?.pagination  || { pages: 1, page: 1, total: 0 };

  const handleRoleChange = (id, newRole) => {
    setChangingId(id);
    changeRole.mutate({ id, role: newRole }, { onSettled: () => setChangingId(null) });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteUser.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Delete modal */}
      <DeleteModal
        user={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteUser.isPending}
      />

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a1a', margin: 0, marginBottom: 4 }}>Manage Users</h1>
        <p style={{ fontSize: 14, color: '#888', margin: 0 }}>View, update roles, and remove users from the platform</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 400 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#aaa' }}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email…"
            style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 10, border: '1.5px solid #d5cfc7', fontSize: 14, outline: 'none', background: 'white', boxSizing: 'border-box' }}
            onFocus={e => (e.currentTarget.style.borderColor = '#6366f1')}
            onBlur={e => (e.currentTarget.style.borderColor = '#d5cfc7')}
          />
        </div>

        {/* Role filter */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <select
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            style={{ appearance: 'none', WebkitAppearance: 'none', padding: '10px 36px 10px 14px', borderRadius: 10, border: '1.5px solid #d5cfc7', background: 'white', fontSize: 14, fontWeight: 600, color: '#333', cursor: 'pointer', outline: 'none', minWidth: 155 }}
            onFocus={e => (e.currentTarget.style.borderColor = '#6366f1')}
            onBlur={e => (e.currentTarget.style.borderColor = '#d5cfc7')}
          >
            <option value="">👥 All Roles</option>
            <option value="admin">🛡️ Admin</option>
            <option value="creator">🎨 Creator</option>
            <option value="supporter">🙋 Supporter</option>
          </select>
          <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#999', fontSize: 11 }}>▼</span>
        </div>

        {/* Total count pill */}
        <span style={{ marginLeft: 'auto', background: '#f0eee9', color: '#666', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
          {pagination.total.toLocaleString()} user{pagination.total !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table card */}
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e5e0d8', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 64, display: 'flex', justifyContent: 'center' }}>
            <LoadingSpinner />
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#888', margin: 0 }}>No users found</p>
            <p style={{ fontSize: 13, color: '#bbb', margin: '4px 0 0' }}>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f8f6f2', borderBottom: '2px solid #e5e0d8' }}>
                    <th style={th}>#</th>
                    <th style={th}>User</th>
                    <th style={th}>Email</th>
                    <th style={th}>Role</th>
                    <th style={th}>Credits</th>
                    <th style={th}>Joined</th>
                    <th style={th}>Update Role</th>
                    <th style={{ ...th, textAlign: 'center' }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr
                      key={u._id}
                      style={{ borderBottom: '1px solid #ede9e2', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#faf8f5')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* # */}
                      <td style={{ ...td, color: '#bbb', fontWeight: 600, fontSize: 13 }}>
                        {(page - 1) * 20 + idx + 1}
                      </td>

                      {/* User */}
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ position: 'relative' }}>
                            <Avatar src={u.image} name={u.name} />
                            {/* Online-ish dot using role color */}
                            <span style={{
                              position: 'absolute', bottom: 0, right: 0,
                              width: 10, height: 10, borderRadius: '50%',
                              background: ROLE_CONFIG[u.role]?.color || '#aaa',
                              border: '2px solid white',
                            }} />
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap' }}>
                              {u.name || '—'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ ...td, color: '#666', fontSize: 13 }}>
                        {u.email || '—'}
                      </td>

                      {/* Role badge */}
                      <td style={td}><RoleBadge role={u.role} /></td>

                      {/* Credits */}
                      <td style={td}>
                        <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{(u.credits || 0).toLocaleString()}</span>
                        <span style={{ color: '#aaa', fontSize: 12, marginLeft: 3 }}>cr</span>
                      </td>

                      {/* Joined */}
                      <td style={{ ...td, color: '#888', whiteSpace: 'nowrap', fontSize: 13 }}>
                        {u.createdAt ? formatDate(u.createdAt) : '—'}
                      </td>

                      {/* Role dropdown */}
                      <td style={td}>
                        <RoleDropdown
                          userId={u._id}
                          currentRole={u.role}
                          onChangeRole={handleRoleChange}
                          isChanging={changingId === u._id}
                        />
                        {changingId === u._id && (
                          <span style={{ fontSize: 11, color: '#6366f1', marginLeft: 8, fontWeight: 600 }}>Saving…</span>
                        )}
                      </td>

                      {/* Remove button */}
                      <td style={{ ...td, textAlign: 'center' }}>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          style={{
                            padding: '7px 16px',
                            borderRadius: 9,
                            border: '1.5px solid #dc2626',
                            background: 'white',
                            color: '#dc2626',
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'background 0.15s, transform 0.1s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                          🗑️ Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ borderTop: '1px solid #ede9e2' }}>
              <SimplePagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
