import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';

interface AdminFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  setStatusFilter: (filter: 'all' | 'active' | 'inactive') => void;
  filteredCount: number;
  totalCount: number;
  selectedCount: number;
  isProcessing: boolean;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
}

export default function AdminFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  filteredCount,
  totalCount,
  selectedCount,
  isProcessing,
  onBulkActivate,
  onBulkDeactivate
}: AdminFiltersProps) {
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Registered Users</h2>
          <p className="text-zinc-400">
            Showing {filteredCount} of {totalCount} users
          </p>
        </div>
        {selectedCount > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400">
              {selectedCount} selected
            </span>
            <button
              onClick={onBulkActivate}
              disabled={isProcessing}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Icon name="CheckCircle" size={16} />
              Activate Selected
            </button>
            <button
              onClick={onBulkDeactivate}
              disabled={isProcessing}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Icon name="XCircle" size={16} />
              Deactivate Selected
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" 
            />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, username, or email..."
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-zinc-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-black'
                : 'bg-white/5 text-zinc-300 hover:bg-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-white/5 text-zinc-300 hover:bg-white/10'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === 'inactive'
                ? 'bg-red-600 text-white'
                : 'bg-white/5 text-zinc-300 hover:bg-white/10'
            }`}
          >
            Inactive
          </button>
        </div>

        {(searchTerm || statusFilter !== 'all') && (
          <button
            onClick={handleClearFilters}
            className="button-ghost px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Icon name="X" size={16} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
