import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart, Legend
} from 'recharts';
import { useThemeStore } from '../store/useThemeStore';

const Analytics = () => {
  const { isDarkMode } = useThemeStore();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/stats');
      return data.data;
    },
  });

  if (isLoading) return <div className="animate-pulse h-screen bg-slate-100 dark:bg-slate-800 rounded-2xl" />;

  const chartTextColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold">Advanced Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl h-96">
          <h3 className="text-lg font-semibold mb-6">Lead Acquisition Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={stats.monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis 
                dataKey={(d) => `${d._id.month}/${d._id.year}`} 
                tick={{ fill: chartTextColor }}
                axisLine={{ stroke: gridColor }}
              />
              <YAxis tick={{ fill: chartTextColor }} axisLine={{ stroke: gridColor }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                  borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                  borderRadius: '12px',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b'
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="New Leads" />
              <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} name="Trend" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="glass p-6 rounded-2xl h-96">
          <h3 className="text-lg font-semibold mb-6">Source Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.sourceStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="_id"
              >
                {stats.sourceStats.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'][index % 4]} />
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
    </div>
  );
};

export default Analytics;
