import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from './layouts/MainLayout';
import io from 'socket.io-client';

import { fetchNotifications, addNotification } from './features/notificationSlice';
import { validateSession } from './features/authSlice';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PostGig = lazy(() => import('./pages/PostGig'));
const GigDetails = lazy(() => import('./pages/GigDetails'));

const App = () => {
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = React.useState(true);

  useEffect(() => {
    const initApp = async () => {
      await dispatch(validateSession());
      setIsInitializing(false);
    };
    initApp();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
      const socket = io('/');

      socket.emit('join', user._id);

      socket.on('notification', (data) => {
        dispatch(addNotification(data));
      });

      return () => socket.disconnect();
    }
  }, [user, dispatch]);

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="mt-4 text-slate-500 font-display font-medium animate-pulse text-sm">Securing Session...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <MainLayout>
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/gigs/:id" element={<GigDetails />} />
            <Route path="/post-gig" element={<PrivateRoute><PostGig /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          </Routes>
        </Suspense>
      </MainLayout>
    </Router>
  );
};

export default App;
