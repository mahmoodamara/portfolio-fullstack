const CustomToolbar = ({ label, onNavigate, onView, view }) => {
    return (
      <div className="flex justify-between items-center bg-gray-900 text-white px-4 py-3 rounded-t-xl border-b border-gray-700">
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('TODAY')}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-sm font-medium"
          >
            Today
          </button>
          <button
            onClick={() => onNavigate('PREV')}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium"
          >
            ←
          </button>
          <button
            onClick={() => onNavigate('NEXT')}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium"
          >
            →
          </button>
        </div>
  
        <h2 className="text-lg font-semibold">{label}</h2>
  
        <div className="flex gap-2">
          {['month', 'week', 'day', 'agenda'].map((v) => (
            <button
              key={v}
              onClick={() => onView(v)}
              className={`px-3 py-1 rounded text-sm font-medium capitalize ${
                view === v ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default CustomToolbar;
  