import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layout/AuthLayout';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SingUpPage';
import ChatsPage from '../pages/ChatsPage'; 
import ProtectedRoute from '../router/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignUpPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/chats',
        element: <ChatsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/auth/login" replace />,
  },
]);