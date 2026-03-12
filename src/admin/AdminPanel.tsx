import { AnimatePresence } from 'framer-motion';
import { useAdminStore } from '../store/adminStore';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminPanel() {
  const store = useAdminStore();

  return (
    <AnimatePresence mode="wait">
      {store.state.isLoggedIn ? (
        <AdminDashboard key="dashboard" store={store} onLogout={store.logout} />
      ) : (
        <AdminLogin key="login" onLogin={store.login} />
      )}
    </AnimatePresence>
  );
}
