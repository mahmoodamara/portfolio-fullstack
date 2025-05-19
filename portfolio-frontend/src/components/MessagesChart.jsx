import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import API from '../api/axios';

const MessagesChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessagesData = async () => {
      try {
        const res = await API.get('/stats/messages-per-month');
        const formatted = res.data.map((item) => ({
          month: item.month,
          messages: parseInt(item.count),
        }));
        setData(formatted);
      } catch (error) {
        console.error('❌ Failed to load messages chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessagesData();
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-white">📬 Messages Overview</h2>

      {loading ? (
        <p className="text-gray-400">Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis dataKey="month" stroke="#e5e7eb" />
            <YAxis stroke="#e5e7eb" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }}
              labelStyle={{ color: '#facc15' }}
            />
            <Bar
              dataKey="messages"
              fill="#10b981"
              barSize={30}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MessagesChart;
