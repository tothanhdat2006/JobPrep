import { LogOut, Map } from 'lucide-react';

const Header = ({ user, onSignOut, onYourRoadmap }) => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">JobPrep</h1>
          <div className="flex items-center gap-4">
            {onYourRoadmap && (
              <button
                onClick={onYourRoadmap}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
              >
                <Map size={18} />
                <span className="text-sm font-medium">Your Roadmap</span>
              </button>
            )}
            <span className="text-sm text-slate-600">
              {user?.displayName || user?.email}
            </span>
            <button
              onClick={onSignOut}
              className="text-slate-600 hover:text-slate-800 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
