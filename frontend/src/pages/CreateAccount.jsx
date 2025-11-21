import React, { useState } from 'react';
import UserForm from '../components/UserForm';
import '../styles/CreateAccount.css';

const CreateAccount = () => {
  const [recentAccounts, setRecentAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRoleColor = (role) => {
    const colors = {
      student: '#3498db',
      faculty: '#9b59b6',
      staff: '#f39c12',
      admin: '#e74c3c'
    };
    return colors[role] || '#3498db';
  };

  const getRoleGradient = (role) => {
    const gradients = {
      student: 'linear-gradient(135deg, #3498db, #2980b9)',
      faculty: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
      staff: 'linear-gradient(135deg, #f39c12, #e67e22)',
      admin: 'linear-gradient(135deg, #e74c3c, #c0392b)'
    };
    return gradients[role] || 'linear-gradient(135deg, #3498db, #2980b9)';
  };

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

  const handleCreateAccount = async (userData) => {
    setLoading(true);
    try {
      console.log('Sending data to backend:', userData);

      const response = await fetch('http://localhost:8080/api/accounts/create', { // Fixed port
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Backend response:', result);

      if (result.success) {
        const newAccount = {
          id: result.accountId,
          ...result.user,
          createdAt: new Date().toLocaleDateString(),
          status: 'Active'
        };
        setRecentAccounts([newAccount, ...recentAccounts.slice(0, 4)]);
        alert(`✅ ${result.message}`);
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Error creating account:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert('❌ Cannot connect to server. Please make sure the backend is running on port 8080.');
      } else {
        alert(`❌ Failed to create account: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-account">
      <div className="page-header">
        <div className="header-content">
          <h1>🎯 Create User Account</h1>
          <p>{loading ? '⏳ Creating account...' : 'Create new accounts for students, faculty, or staff members'}</p>
        </div>


      </div>

      <div className="account-creation-section">
        <div className="creation-card">
          <div className="card-header">
            <h2>👤 User Information</h2>
            <div className="card-decoration"></div>
          </div>
          <div className="form-container">
            <UserForm
              onSubmit={handleCreateAccount}
              loading={loading}
              getDepartmentIcon={getDepartmentIcon}
            />
          </div>
        </div>
      </div>

      {recentAccounts.length > 0 && (
        <div className="recent-accounts">
          <div className="section-header">
            <h2>📋 Recently Created Accounts</h2>
            <span className="count-badge">{recentAccounts.length} accounts</span>
          </div>
          <div className="accounts-grid">
            {recentAccounts.map(account => (
              <div
                key={account.id}
                className="account-card"
                style={{
                  borderLeftColor: getRoleColor(account.role),
                  background: `linear-gradient(135deg, white, ${getRoleColor(account.role)}15)`
                }}
              >
                <div className="account-header">
                  <div
                    className="role-avatar"
                    style={{ background: getRoleGradient(account.role) }}
                  >
                    {account.role === 'student' ? '🎓' :
                     account.role === 'faculty' ? '👨‍🏫' :
                     account.role === 'staff' ? '👔' : '⚙️'}
                  </div>
                  <div className="account-info">
                    <span className="account-name">
                      {account.firstName} {account.lastName}
                    </span>
                    <span
                      className="account-role-badge"
                      style={{ background: getRoleColor(account.role) }}
                    >
                      {account.role}
                    </span>
                  </div>
                </div>
                <div className="account-details">
                  <div className="detail-item">
                    <span className="detail-icon">📧</span>
                    <span className="detail-value">{account.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🏫</span>
                    <span className="detail-value">{account.department}</span>
                  </div>
                </div>
                <div className="account-footer">
                  <span className="account-date">Created: {account.createdAt}</span>
                  <span className="status-badge" style={{ background: '#27ae60' }}>
                    ✅ {account.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAccount;