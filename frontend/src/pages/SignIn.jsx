import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const SignIn = () => {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign in failed:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // More specific error messages
      let errorMessage = 'Failed to sign in. ';
      if (error.code === 'auth/popup-blocked') {
        errorMessage += 'Please allow popups for this site.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage += 'Sign-in popup was closed.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage += 'Another popup is already open.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // If already signed in, redirect to dashboard
  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">JobPrep</h1>
          <p className="text-slate-600">
            Create personalized study roadmaps for your dream job
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn size={20} />
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500 text-center">
            Sign in to analyze your resume and get a personalized roadmap
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;