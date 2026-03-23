import { SignUp } from '../features/auth/SingUp';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold tracking-tight text-white">New Identity</h2>
        <p className="text-sm text-zinc-500">Create keys and join the network</p>
      </div>

      <SignUp />

      <p className="text-center text-sm text-zinc-500">
        Already have a session?{' '}
        <Link to="/auth/login" className="text-white hover:underline transition-all">
          Decrypt here
        </Link>
      </p>
    </div>
  );
};

export default SignUpPage; 