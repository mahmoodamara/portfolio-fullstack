import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import API from '../api/axios';

const ProjectChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadChart = async () => {
      try {
        const res = await API.get('/stats/projects-per-month');
        const formatted = res.data.map((d) => ({
          month: d.month,
          projects: parseInt(d.count),
        }));
        setData(formatted);
      } catch (err) {
        console.error('Failed to load project chart data:', err);
      }
    };
    loadChart();
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-white">Projects Growth</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis dataKey="month" stroke="#e5e7eb" />
          <YAxis stroke="#e5e7eb" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }}
            labelStyle={{ color: '#93c5fd' }}
          />
          <Line type="monotone" dataKey="projects" stroke="#6366f1" strokeWidth={3} dot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectChart;
