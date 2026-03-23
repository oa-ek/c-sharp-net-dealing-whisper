import { Login } from '../features/auth/Login';
import { Link } from 'react-router-dom'; 

const LoginPage = () => {
  return (
    <div className="space-y-6">
      <Login />
      <p className="text-center text-sm text-zinc-500">
        New here?{' '}
        <Link to="/auth/signup" className="text-white hover:underline">
          Create identity
        </Link>
      </p>
    </div>
  );
};

export default LoginPage; 