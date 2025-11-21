import React, { useState, useEffect } from 'react';
import UserForm from '../components/UserForm';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Base URL for API calls
  const API_BASE_URL = 'http://localhost:8080/api/accounts';

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching users from backend...');
      const response = await fetch(API_BASE_URL);

      if (!response.ok) {
        throw new Error(`Backend returned status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Backend response:', result);

      if (result.success) {
        setUsers(result.accounts || []);
      } else {
        throw new Error(result.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (userData) => {
    try {
      setError(null);
      console.log('Creating user:', userData);

      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      console.log('Create user response:', result);

      if (result.success) {
        // Refresh the user list
        await fetchUsers();
        setShowForm(false);
        alert('✅ User created successfully!');
      } else {
        throw new Error(result.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message);
    }
  };

  const handleEditUser = (user) => {
    console.log('Editing user:', user); // Debug log
    setEditingUser({
      id: user.id || user.accountId, // Handle both field names
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.accountType?.name || user.role,
      department: user.department,
      phone: user.phone || ''
    });
    setShowForm(true);
  };

  const handleUpdateUser = async (userData) => {
    if (!editingUser || !editingUser.id) {
      alert('❌ Error: No user ID found for update');
      return;
    }

    try {
      setError(null);
      console.log('Updating user ID:', editingUser.id, 'Data:', userData);

      const response = await fetch(`${API_BASE_URL}/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      console.log('Update user response:', result);

      if (result.success) {
        // Refresh the user list
        await fetchUsers();
        setEditingUser(null);
        setShowForm(false);
        alert('✅ User updated successfully!');
      } else {
        throw new Error(result.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) {
      alert('❌ Error: No user ID found for deletion');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      console.log('Deleting user ID:', userId);

      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      console.log('Delete user response:', result);

      if (result.success) {
        // Refresh the user list
        await fetchUsers();
        alert('✅ User deleted successfully!');
      } else {
        throw new Error(result.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message);
    }
  };

  // Role color mapping
  const getRoleColor = (role) => {
    const colors = {
      student: '#3498db',
      faculty: '#9b59b6',
      staff: '#f39c12',
      admin: '#e74c3c'
    };
    return colors[role] || '#3498db';
  };

  // Role gradient mapping
  const getRoleGradient = (role) => {
    const gradients = {
      student: 'linear-gradient(135deg, #3498db, #2980b9)',
      faculty: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
      staff: 'linear-gradient(135deg, #f39c12, #e67e22)',
      admin: 'linear-gradient(135deg, #e74c3c, #c0392b)'
    };
    return gradients[role] || 'linear-gradient(135deg, #3498db, #2980b9)';
  };

  // Role icon mapping - ADDED BACK
  const getRoleIcon = (role) => {
    const icons = {
      student: '🎓',
      faculty: '👨‍🏫',
      staff: '💼',
      admin: '⚙️'
    };
    return icons[role] || '👤';
  };

  // Department icon mapping - ADDED BACK
  const getDepartmentIcon = (department) => {
    const icons = {
      'Computer Science': '💻',
      'Mathematics': '📐',
      'Physics': '⚛️',
      'Chemistry': '🧪',
      'Biology': '🧬',
      'Engineering': '⚙️',
      'Business': '💼',
      'Arts': '🎨',
      'Medicine': '🩺',
      'Law': '⚖️'
    };
    return icons[department] || '🏫';
  };

  // Render error state
  if (error) {
    return (
      <div className="user-management">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h3>Connection Error</h3>
          <p>{error}</p>
          <div className="error-troubleshoot">
            <h4>To fix this:</h4>
            <ol>
              <li>Make sure your Spring Boot backend is running on port 8081</li>
              <li>Check that the backend has the new update/delete endpoints</li>
              <li>Verify the endpoint: http://localhost:8081/api/accounts</li>
              <li>Check browser console for detailed errors</li>
            </ol>
          </div>
          <button
            className="retry-button"
            onClick={fetchUsers}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="user-management">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading users from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <h1>👥 User Management</h1>
        <div className="header-actions">
          <div className="connection-status">
            <span className="status-indicator connected"></span>

          </div>


        </div>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingUser ? '✏️ Edit User' : '👤 Create New User'}</h2>
              <button
                className="close-button"
                onClick={() => {
                  setShowForm(false);
                  setEditingUser(null);
                }}
              >
                ✕
              </button>
            </div>
            <UserForm
              onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
              initialData={editingUser || {}}
              getDepartmentIcon={getDepartmentIcon} // PASS THE FUNCTION BACK
            />
          </div>
        </div>
      )}

      <div className="users-table-container">
        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No Users Found</h3>
            <p>No users have been created yet. Click "Add New User" to get started.</p>
            <button
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
              ➕ Create First User
            </button>
          </div>
        ) : (
          <div className="users-table">
            <div className="table-header">
              <span>Total Users: {users.length}</span>

            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id || user.accountId}>
                    <td className="user-id">#{user.id || user.accountId}</td>
                    <td>
                      <div className="user-name">
                        <strong>{user.firstName} {user.lastName}</strong>
                      </div>
                    </td>
                    <td className="user-email">{user.email}</td>
                    <td>
                      <span
                        className="role-badge"
                        style={{
                          backgroundColor: getRoleColor(user.accountType?.name || user.role),
                          color: 'white'
                        }}
                      >
                        {getRoleIcon(user.accountType?.name || user.role)} {/* ADDED ICON */}
                        {user.accountType?.name || user.role}
                      </span>
                    </td>
                    <td className="user-department">
                      {getDepartmentIcon(user.department)} {/* ADDED ICON */}
                      {user.department}
                    </td>
                    <td className="user-phone">{user.phone || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => handleEditUser(user)}
                          title="Edit User"
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteUser(user.id || user.accountId)}
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;