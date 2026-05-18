import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '../services/lead.service';
import { useDebounce } from '../hooks/useDebounce';
import { useAuthStore } from '../store/useAuthStore';
import { Badge } from '../components/ui/Badge';
import { TableSkeleton } from '../components/feedback/Skeleton';
import { 
  Search, Plus, Download, ChevronLeft, ChevronRight, Edit2, Trash2, Eye 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import LeadModal from '../components/modals/LeadModal';
import { formatDate } from '../utils/cn';
import { LeadStatus, LeadSource } from '../types/leads.types';
import type { ILead } from '../types/leads.types';

import { AxiosError } from 'axios';

const Leads = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: leadsResponse, isLoading } = useQuery({
    queryKey: ['leads', debouncedSearch, status, source, sortBy, order, page],
    queryFn: () => leadService.getLeads({ 
      search: debouncedSearch, 
      status, 
      source, 
      sortBy, 
      order, 
      page, 
      limit: 10 
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadService.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted successfully');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to delete lead');
    },
  });

  const handleExport = async () => {
    try {
      const blob = await leadService.exportLeads({ search: debouncedSearch, status, source });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_export_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export started');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const handleAction = (lead: ILead, type: 'view' | 'edit' | 'delete') => {
    if (type === 'delete') {
      if (window.confirm('Are you sure you want to delete this lead?')) {
        deleteMutation.mutate(lead._id);
      }
      return;
    }
    setSelectedLead(lead);
    setIsViewOnly(type === 'view');
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads Management</h1>
          <p className="text-slate-500 text-sm">Enterprise-grade lead tracking and management</p>
        </div>
        <div className="flex items-center space-x-3">
          {user?.role === 'Admin' && (
            <button onClick={handleExport} className="btn-secondary flex items-center space-x-2">
              <Download size={18} />
              <span>Export CSV</span>
            </button>
          )}
          <button 
            onClick={() => { setSelectedLead(null); setIsViewOnly(false); setIsModalOpen(true); }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      <div className="glass p-4 md:p-6 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
            <option value="">All Statuses</option>
            {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={source} onChange={(e) => setSource(e.target.value)} className="input-field">
            <option value="">All Sources</option>
            {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            value={`${sortBy}-${order}`} 
            onChange={(e) => {
              const [field, dir] = e.target.value.split('-');
              setSortBy(field);
              setOrder(dir as 'asc' | 'desc');
            }} 
            className="input-field"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>

        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="inline-block min-w-full align-middle px-4 md:px-0">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b dark:border-slate-800">
                  <th className="pb-4 font-bold text-[10px] md:text-xs uppercase tracking-wider text-slate-500">Lead Info</th>
                  <th className="pb-4 font-bold text-[10px] md:text-xs uppercase tracking-wider text-slate-500 hidden sm:table-cell">Company</th>
                  <th className="pb-4 font-bold text-[10px] md:text-xs uppercase tracking-wider text-slate-500">Status</th>
                  <th className="pb-4 font-bold text-[10px] md:text-xs uppercase tracking-wider text-slate-500 hidden lg:table-cell">Source</th>
                  <th className="pb-4 font-bold text-[10px] md:text-xs uppercase tracking-wider text-slate-500 hidden md:table-cell">Assigned</th>
                  <th className="pb-4 font-bold text-[10px] md:text-xs uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {isLoading ? (
                  <tr><td colSpan={6} className="py-8"><TableSkeleton /></td></tr>
                ) : leadsResponse?.data.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-slate-500">No leads found.</td></tr>
                ) : (
                  leadsResponse?.data.map((lead: ILead) => (
                    <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                      <td className="py-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm md:text-base truncate max-w-[120px] md:max-w-none">{lead.name}</div>
                        <div className="text-[10px] md:text-xs text-slate-500 truncate max-w-[120px] md:max-w-none">{lead.email}</div>
                      </td>
                      <td className="py-4 text-xs md:text-sm font-medium hidden sm:table-cell truncate max-w-[100px] md:max-w-none">{lead.company}</td>
                      <td className="py-4">
                        <Badge variant={lead.status === LeadStatus.NEW ? 'blue' : lead.status === LeadStatus.CONTACTED ? 'amber' : lead.status === LeadStatus.QUALIFIED ? 'green' : 'red'}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium hidden lg:table-cell">{lead.source}</td>
                      <td className="py-4 hidden md:table-cell">
                        <div className="text-xs md:text-sm font-bold text-primary-600 truncate max-w-[100px]">{lead.assignedTo?.name || 'Unassigned'}</div>
                        <div className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold">{formatDate(lead.createdAt)}</div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button onClick={() => handleAction(lead, 'view')} className="p-1.5 md:p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-600" title="View"><Eye size={16} /></button>
                          <button onClick={() => handleAction(lead, 'edit')} className="p-1.5 md:p-2 hover:bg-blue-50 text-blue-600 dark:hover:bg-blue-900/20 rounded-lg" title="Edit"><Edit2 size={16} /></button>
                          {user?.role === 'Admin' && (
                            <button onClick={() => handleAction(lead, 'delete')} className="p-1.5 md:p-2 hover:bg-red-50 text-red-600 dark:hover:bg-red-900/20 rounded-lg" title="Delete"><Trash2 size={16} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {leadsResponse?.pagination && (
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t dark:border-slate-800 gap-4">
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
              Total {leadsResponse.pagination.total} Leads
            </p>
            <div className="flex items-center space-x-2">
              <button 
                disabled={!leadsResponse.pagination.hasPrevPage} 
                onClick={() => setPage(p => p - 1)}
                className="p-1.5 md:p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs md:text-sm font-bold px-3 md:px-4">
                {leadsResponse.pagination.page} / {leadsResponse.pagination.totalPages}
              </span>
              <button 
                disabled={!leadsResponse.pagination.hasNextPage} 
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 md:p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        lead={selectedLead}
        isViewOnly={isViewOnly}
      />
    </div>
  );
};

export default Leads;
