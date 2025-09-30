import Icon from '@/components/ui/icon';

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string | null;
  last_login: string | null;
  is_active: boolean;
}

interface AdminUsersTableProps {
  users: User[];
  selectedUsers: Set<number>;
  onSelectUser: (userId: number) => void;
  onSelectAll: () => void;
  onToggleStatus: (userId: number, currentStatus: boolean) => void;
  formatDate: (dateString: string | null) => string;
  loading: boolean;
  hasNoUsers: boolean;
  hasNoFilteredUsers: boolean;
  onClearFilters: () => void;
}

export default function AdminUsersTable({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onToggleStatus,
  formatDate,
  loading,
  hasNoUsers,
  hasNoFilteredUsers,
  onClearFilters
}: AdminUsersTableProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <Icon name="Loader2" size={32} className="animate-spin mx-auto text-white" />
      </div>
    );
  }

  if (hasNoUsers) {
    return (
      <div className="text-center py-12 text-zinc-400">
        No users registered yet
      </div>
    );
  }

  if (hasNoFilteredUsers) {
    return (
      <div className="text-center py-12 text-zinc-400">
        <Icon name="SearchX" size={48} className="mx-auto mb-4 opacity-50" />
        <p>No users found matching your filters</p>
        <button
          onClick={onClearFilters}
          className="mt-4 button-ghost px-4 py-2 rounded-md"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/20 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.size === users.length && users.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-white cursor-pointer"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(user.id)}
                    onChange={() => onSelectUser(user.id)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-white cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                  {formatDate(user.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                  {formatDate(user.last_login)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.is_active ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onToggleStatus(user.id, user.is_active)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      user.is_active
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
