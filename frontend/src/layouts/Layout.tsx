import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuthStore } from '../store/useAuthStore';

const Layout = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8 pb-6 border-b dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Welcome back, {user?.name}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right mr-2 hidden md:block">
              <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/20 border-2 border-white dark:border-slate-800">
              {user?.name.charAt(0)}
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
