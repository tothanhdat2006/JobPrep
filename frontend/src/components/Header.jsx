import { Map } from 'lucide-react';

const Header = ({ onYourRoadmap }) => {
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
