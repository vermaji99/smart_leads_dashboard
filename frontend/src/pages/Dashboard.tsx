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

const Dashboard = () => {
  const { isDarkMode } = useThemeStore();
  const { data: stats, isLoading } = useQuery<IAnalyticsStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/stats');
      return data.data;
    },
  });

  if (isLoading || !stats) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
    </div>
  </div>;

  const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'];
  const chartTextColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';

  const statCards = [
    { label: 'Total Leads', value: stats.totalLeads, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Qualified Leads', value: stats.statusStats.find((s) => s._id === 'Qualified')?.count || 0, icon: UserCheck, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Lost Leads', value: stats.statusStats.find((s) => s._id === 'Lost')?.count || 0, icon: UserX, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
    { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm">Real-time performance metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="glass p-4 md:p-6 rounded-2xl flex items-center space-x-4 group hover:scale-[1.02] transition-transform duration-300">
            <div className={clsx('w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 flex-shrink-0', stat.bg)}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider truncate">{stat.label}</p>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white truncate">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-4 md:p-6 rounded-2xl h-[350px] md:h-96">
          <h3 className="text-lg font-semibold mb-6">Leads by Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.statusStats}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis 
                dataKey="_id" 
                tick={{ fill: chartTextColor, fontSize: 12 }} 
                axisLine={{ stroke: gridColor }}
                interval={0}
              />
              <YAxis tick={{ fill: chartTextColor, fontSize: 12 }} axisLine={{ stroke: gridColor }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                  borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                  borderRadius: '12px',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b'
                }}
              />
              <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass p-4 md:p-6 rounded-2xl h-[350px] md:h-96">
          <h3 className="text-lg font-semibold mb-6">Leads by Source</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.sourceStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                nameKey="_id"
              >
                {stats.sourceStats.map((_, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                  borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                  borderRadius: '12px',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass p-4 md:p-6 rounded-2xl h-[350px] md:h-96">
        <h3 className="text-lg font-semibold mb-6">Monthly Growth</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stats.monthlyGrowth}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis 
              dataKey={(d) => `${d._id.month}/${d._id.year}`} 
              tick={{ fill: chartTextColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
            />
            <YAxis tick={{ fill: chartTextColor, fontSize: 12 }} axisLine={{ stroke: gridColor }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                borderRadius: '12px',
                color: isDarkMode ? '#f1f5f9' : '#1e293b'
              }}
            />
            <Area type="monotone" dataKey="count" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorCount)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
