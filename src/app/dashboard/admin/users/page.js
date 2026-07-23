'use client';

import { useState } from 'react';
import { useAdminUsers, useChangeUserRole, useDeleteUser } from '@/hooks/useAdmin';
import ConfirmModal from '@/components/shared/ConfirmModal';
import Pagination from '@/components/shared/Pagination';
import { formatDate } from '@/utils/formatters';
import { useDebounce } from '@/hooks/useDebounce';
import { Button, Card, CardBody, Chip, Input, Select, SelectItem } from '@heroui/react';

const roleItems = [
  { key: '', label: 'All Roles' },
  { key: 'supporter', label: 'Supporter' },
  { key: 'creator', label: 'Creator' },
  { key: 'admin', label: 'Admin' },
];

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useAdminUsers({ page, limit: 10, search: debouncedSearch, role: roleFilter });
  const changeRole = useChangeUserRole();
  const deleteUser = useDeleteUser();
  const users = data?.users || [];
  const pagination = data?.pagination || { pages: 1, page: 1 };

  const handleDelete = () => {
    if (deleteId) deleteUser.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const roleColor = { supporter: 'default', creator: 'primary', admin: 'danger' };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onValueChange={setSearch}
          className="flex-1"
        />
        <Select
          selectedKeys={roleFilter ? [roleFilter] : []}
          onSelectionChange={(keys) => setRoleFilter(Array.from(keys)[0] || '')}
          className="w-full sm:w-48"
        >
          {roleItems.map((r) => (
            <SelectItem key={r.key}>{r.label}</SelectItem>
          ))}
        </Select>
      </div>

      <div className="space-y-3">
        {users.map((u) => (
          <Card key={u._id}>
            <CardBody className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                {u.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
                <p className="text-xs text-gray-400">Joined {formatDate(u.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Chip size="sm" color={roleColor[u.role]} variant="flat">
                  {u.role}
                </Chip>
                <Select
                  size="sm"
                  selectedKeys={[u.role]}
                  onSelectionChange={(keys) => {
                    const newRole = Array.from(keys)[0];
                    if (newRole && newRole !== u.role) {
                      changeRole.mutate({ id: u._id, role: newRole });
                    }
                  }}
                  className="w-32"
                >
                  <SelectItem key="supporter">Supporter</SelectItem>
                  <SelectItem key="creator">Creator</SelectItem>
                  <SelectItem key="admin">Admin</SelectItem>
                </Select>
                <Button size="sm" variant="light" color="danger" onPress={() => setDeleteId(u._id)}>
                  Delete
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={setPage} />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
