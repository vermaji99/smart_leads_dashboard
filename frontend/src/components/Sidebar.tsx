import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const user = useAuthStore((state) => state.user);

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/leads', icon: Users, label: 'Leads' },
    ...(user?.role === 'Admin' ? [{ to: '/analytics', icon: BarChart3, label: 'Analytics' }] : []),
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <BarChart3 className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">Smart Leads</h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-500">
            <X size={24} />
          </button>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400'
              )
            }
          >
            <item.icon size={20} />
            <span className="font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t dark:border-slate-800 space-y-1">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
        >
          {isDarkMode ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-primary-600" />}
          <span className="font-semibold">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 glass rounded-xl shadow-lg text-primary-600"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen glass border-r flex-col fixed left-0 top-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 glass border-r flex flex-col z-[80] shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
