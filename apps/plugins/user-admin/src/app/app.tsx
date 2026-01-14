import React, { useEffect, useState } from 'react';
// import { useNavigation } from '@team-forge/shared/utils';
import { Button } from '@team-forge/shared/ui';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  isSuperAdmin: boolean;
  createdAt: string;
}

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch Data (Rule 21)
  useEffect(() => {
    axios
      .get('/api/users')
      .then((res) => {
        const data = res.data.data || res.data;
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error(
            'Expected array for users but received:',
            typeof data,
            data
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load users', err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  // Navigation is handled by the Shell (Manually registered in App.tsx)
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>User Management</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          {users.length === 0 && <p>No users found (or API error). Check console.</p>}
          <div
            style={{
              display: 'grid',
              gap: '10px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            }}
          >
            {users.map((u) => (
              <div
                key={u.id}
                style={{
                  padding: '16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--background-paper)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>{u.email}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {u.isSuperAdmin ? '👑 Super Admin' : 'User'}
                  </div>
                </div>
                <Button variant="secondary" onClick={() => handleDelete(u.id)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
