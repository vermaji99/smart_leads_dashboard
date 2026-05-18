import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Invalid phone number'),
  company: z.string().min(2, 'Company is required'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
  notes: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: any;
  isViewOnly?: boolean;
}

const LeadModal = ({ isOpen, onClose, lead, isViewOnly }: LeadModalProps) => {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: lead || {
      status: 'New',
      source: 'Website',
    }
  });

  const mutation = useMutation({
    mutationFn: (values: LeadFormValues) => 
      lead ? api.put(`/leads/${lead._id}`, values) : api.post('/leads', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success(lead ? 'Lead updated' : 'Lead created');
      onClose();
    },
    onError: () => toast.error('Something went wrong'),
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="glass w-full max-w-2xl rounded-2xl p-8 animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {isViewOnly ? 'Lead Details' : lead ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="label-text">Name</label>
            <input 
              {...register('name')} 
              disabled={isViewOnly}
              className="input-field disabled:opacity-75 disabled:cursor-not-allowed" 
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="label-text">Email</label>
            <input 
              {...register('email')} 
              disabled={isViewOnly}
              className="input-field disabled:opacity-75 disabled:cursor-not-allowed" 
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="label-text">Phone</label>
            <input 
              {...register('phone')} 
              disabled={isViewOnly}
              className="input-field disabled:opacity-75 disabled:cursor-not-allowed" 
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="label-text">Company</label>
            <input 
              {...register('company')} 
              disabled={isViewOnly}
              className="input-field disabled:opacity-75 disabled:cursor-not-allowed" 
            />
            {errors.company && <p className="text-red-500 text-xs">{errors.company.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="label-text">Status</label>
            <select 
              {...register('status')} 
              disabled={isViewOnly}
              className="input-field disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="label-text">Source</label>
            <select 
              {...register('source')} 
              disabled={isViewOnly}
              className="input-field disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="label-text">Notes</label>
            <textarea 
              {...register('notes')} 
              disabled={isViewOnly}
              rows={3}
              className="input-field disabled:opacity-75 disabled:cursor-not-allowed" 
            />
          </div>

          {!isViewOnly && (
            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? 'Saving...' : lead ? 'Update Lead' : 'Create Lead'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
