import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmptyDashboard from "./pages/EmptyDashboard";
import Initialize from "./pages/Initialize";
import Logs from "./pages/Logs";
import ApiKeys from "./pages/ApiKeys";
import ComingSoon from "./components/shared/ComingSoon";

import { useTheme } from "./store/useTheme";

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (currentTheme: 'light' | 'dark' | 'system') => {
      if (currentTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else if (currentTheme === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
      } else {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
        root.classList.remove(systemTheme === 'dark' ? 'light' : 'dark');
      }
    };

    applyTheme(theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);
  return (
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/empty" element={<ProtectedRoute><EmptyDashboard /></ProtectedRoute>} />
          <Route path="/initialize" element={<ProtectedRoute><Initialize /></ProtectedRoute>} />
          <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
          <Route path="/apikeys" element={<ProtectedRoute><ApiKeys /></ProtectedRoute>} />
          <Route path="/webhooks" element={<ProtectedRoute><ComingSoon moduleName="Webhooks" /></ProtectedRoute>} />
          <Route path="/team" element={<ProtectedRoute><ComingSoon moduleName="Team" /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><ComingSoon moduleName="Settings" /></ProtectedRoute>} />
          <Route path="/docs" element={<ProtectedRoute><ComingSoon moduleName="Documentation" /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><ComingSoon moduleName="Support" /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
  );
}

export default App;
