import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useState } from 'react';
import API from '../api/axios';
import CustomToolbar from './CustomToolbar';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

const AdminCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const res = await API.get('/calendar');
        const formatted = res.data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(formatted);
      } catch (err) {
        console.error('❌ Calendar fetch failed:', err);
      }
    };

    fetchCalendarEvents();
  }, []);

  return (
    <div className="mt-12 bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        🗓 Admin Calendar
      </h2>
      <div className="h-[550px] rounded-xl overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          components={{ toolbar: CustomToolbar }}
          style={{ height: '100%', width: '100%' }}
          eventPropGetter={() => ({
            style: {
              backgroundColor: '#4f46e5',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '8px',
              padding: '4px 8px',
              border: 'none',
            },
          })}
          dayPropGetter={() => ({
            style: {
              backgroundColor: '#111827',
              color: '#e5e7eb',
              border: '1px solid #1f2937',
            },
          })}
          popup
        />
      </div>
    </div>
  );
};

export default AdminCalendar;
