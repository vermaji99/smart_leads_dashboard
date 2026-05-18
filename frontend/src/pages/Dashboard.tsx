import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { useThemeStore } from '../store/useThemeStore';
import type { IAnalyticsStats } from '../types/leads.types';
import { CHART_CONFIG, STATUS_COLORS } from '../constants/theme.constants';

const Dashboard = () => {
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? 'dark' : 'light';
  const config = CHART_CONFIG[theme];

  const { data: stats, isLoading } = useQuery<IAnalyticsStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/stats');
      return data.data;
    },
  });

  if (isLoading || !stats) return (
    <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  );

  const statCards = [
    { label: 'Total Leads', value: stats.totalLeads, icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Qualified Leads', value: stats.statusStats.find((s) => s._id === 'Qualified')?.count || 0, icon: UserCheck, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Lost Leads', value: stats.statusStats.find((s) => s._id === 'Lost')?.count || 0, icon: UserX, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10' },
    { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: TrendingUp, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time performance metrics and leads insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card p-6 flex items-center space-x-4">
            <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', stat.bg)}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 h-[400px]">
          <h3 className="text-lg font-bold mb-6">Leads by Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.statusStats}>
              <CartesianGrid strokeDasharray="3 3" stroke={config.grid} vertical={false} />
              <XAxis 
                dataKey="_id" 
                tick={{ fill: config.text, fontSize: 12, fontWeight: 500 }} 
                axisLine={{ stroke: config.grid }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: config.text, fontSize: 12, fontWeight: 500 }} 
                axisLine={{ stroke: config.grid }}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: isDarkMode ? '#1F2937' : '#F8FAF9', opacity: 0.4 }}
                contentStyle={{ 
                  backgroundColor: config.tooltip.bg,
                  borderColor: config.tooltip.border,
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  color: config.tooltip.text,
                  border: '1px solid'
                }}
              />
              <Bar 
                dataKey="count" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
              >
                {stats.statusStats.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_COLORS[entry._id as keyof typeof STATUS_COLORS] || '#3B82F6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6 h-[400px]">
          <h3 className="text-lg font-bold mb-6">Leads by Source</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.sourceStats}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={8}
                dataKey="count"
                nameKey="_id"
                stroke="none"
              >
                {stats.sourceStats.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: config.tooltip.bg,
                  borderColor: config.tooltip.border,
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  color: config.tooltip.text,
                  border: '1px solid'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6 h-[400px]">
        <h3 className="text-lg font-bold mb-6">Monthly Acquisition Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stats.monthlyGrowth}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={config.grid} vertical={false} />
            <XAxis 
              dataKey={(d) => `${d._id.month}/${d._id.year}`} 
              tick={{ fill: config.text, fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: config.grid }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: config.text, fontSize: 12, fontWeight: 500 }} 
              axisLine={{ stroke: config.grid }}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: config.tooltip.bg,
                borderColor: config.tooltip.border,
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                color: config.tooltip.text,
                border: '1px solid'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#3B82F6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCount)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
