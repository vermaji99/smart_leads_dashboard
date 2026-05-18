import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ComposedChart, Legend, Line
} from 'recharts';
import { useThemeStore } from '../store/useThemeStore';
import { CHART_CONFIG } from '../constants/theme.constants';

const Analytics = () => {
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? 'dark' : 'light';
  const config = CHART_CONFIG[theme];

  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/stats');
      return data.data;
    },
  });

  if (isLoading) return <div className="animate-pulse h-screen bg-slate-100 dark:bg-slate-800 rounded-2xl" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Advanced Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Deep dive into lead conversion and acquisition metrics</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 h-[450px]">
          <h3 className="text-lg font-bold mb-8">Lead Acquisition Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={stats.monthlyGrowth}>
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
              <Legend verticalAlign="top" height={36}/>
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="New Leads" barSize={30} />
              <Line type="monotone" dataKey="count" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, fill: '#F59E0B' }} name="Trend Line" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6 h-[450px]">
          <h3 className="text-lg font-bold mb-8">Source Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.sourceStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                innerRadius={60}
                paddingAngle={5}
                dataKey="count"
                nameKey="_id"
                stroke="none"
              >
                {stats.sourceStats.map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
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
    </div>
  );
};

export default Analytics;
