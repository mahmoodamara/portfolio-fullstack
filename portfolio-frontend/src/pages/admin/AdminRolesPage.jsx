import { useState } from 'react';
import { FaShieldAlt } from 'react-icons/fa';

const sampleAdmins = [
  { id: 1, name: 'Mahmood Amara', email: 'admin@example.com', role: 'Super Admin' },
  { id: 2, name: 'Sara Malik', email: 'sara@site.com', role: 'Content Manager' },
  { id: 3, name: 'John Doe', email: 'john@site.com', role: 'Project Manager' },
];

const roles = ['Super Admin', 'Content Manager', 'Project Manager', 'Read Only'];

const AdminRolesPage = () => {
  const [admins, setAdmins] = useState(sampleAdmins);

  const handleRoleChange = (id, newRole) => {
    const updated = admins.map((admin) =>
      admin.id === id ? { ...admin, role: newRole } : admin
    );
    setAdmins(updated);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex items-center gap-3 mb-8">
        <FaShieldAlt className="text-indigo-400 text-3xl" />
        <h1 className="text-3xl font-bold">Manage Admin Roles</h1>
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-lg p-4">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left bg-gray-700 text-gray-200 rounded">
              <th className="px-4 py-3">👤 Name</th>
              <th className="px-4 py-3">📧 Email</th>
              <th className="px-4 py-3">🔑 Role</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr
                key={admin.id}
                className="border-b border-gray-700 hover:bg-gray-700/50 transition"
              >
                <td className="px-4 py-3 font-medium">{admin.name}</td>
                <td className="px-4 py-3 text-gray-300">{admin.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={admin.role}
                    onChange={(e) => handleRoleChange(admin.id, e.target.value)}
                    className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {roles.map((role, i) => (
                      <option key={i} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRolesPage;
