import React, { useState, useEffect } from 'react';
import '../styles/RoomAvailability.css';

const RoomAvailability = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    building: '',
    capacity: '',
    equipment: '',
    status: ''
  });




///////////////////////////////// use this parttt used only to see




  // Mock data - replace with actual API call
  const mockRooms = [
    { id: 1, name: 'Room 101', building: 'Science Building', capacity: 30, equipment: ['Projector', 'Whiteboard'], status: 'available', nextBooking: '2:00 PM' },
    { id: 2, name: 'Room 102', building: 'Science Building', capacity: 50, equipment: ['Computers', 'Projector'], status: 'occupied', nextBooking: '3:30 PM' },
    { id: 3, name: 'Auditorium A', building: 'Main Hall', capacity: 200, equipment: ['Stage', 'Sound System', 'Projector'], status: 'available', nextBooking: '4:00 PM' },
    { id: 4, name: 'Lab 201', building: 'Engineering Building', capacity: 25, equipment: ['Computers', 'Specialized Software'], status: 'maintenance', nextBooking: 'Tomorrow' },
    { id: 5, name: 'Conference Room B', building: 'Administration', capacity: 15, equipment: ['Video Conference', 'Whiteboard'], status: 'available', nextBooking: '1:00 PM' },
    { id: 6, name: 'Room 303', building: 'Arts Building', capacity: 40, equipment: ['Art Supplies', 'Projector'], status: 'occupied', nextBooking: '2:45 PM' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRooms(mockRooms);
      setFilteredRooms(mockRooms);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterRooms();
  }, [filters, rooms]);

  const filterRooms = () => {
    let filtered = rooms;

    if (filters.building) {
      filtered = filtered.filter(room =>
        room.building.toLowerCase().includes(filters.building.toLowerCase())
      );
    }

    if (filters.capacity) {
      filtered = filtered.filter(room => room.capacity >= parseInt(filters.capacity));
    }

    if (filters.equipment) {
      filtered = filtered.filter(room =>
        room.equipment.some(eq =>
          eq.toLowerCase().includes(filters.equipment.toLowerCase())
        )
      );
    }

    if (filters.status) {
      filtered = filtered.filter(room => room.status === filters.status);
    }

    setFilteredRooms(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      building: '',
      capacity: '',
      equipment: '',
      status: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#27ae60';
      case 'occupied': return '#e74c3c';
      case 'maintenance': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return '✅';
      case 'occupied': return '🚫';
      case 'maintenance': return '🔧';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="room-availability">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading room availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="room-availability">
      <div className="page-header">
        <h1>🏢 Room Availability</h1>
        <p>View and manage classroom and facility availability across campus</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>🔍 Filter Rooms</h3>
          <button className="clear-filters" onClick={clearFilters}>
            🗑️ Clear Filters
          </button>
        </div>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Building</label>
            <input
              type="text"
              placeholder="Search building..."
              value={filters.building}
              onChange={(e) => handleFilterChange('building', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Minimum Capacity</label>
            <input
              type="number"
              placeholder="e.g., 20"
              value={filters.capacity}
              onChange={(e) => handleFilterChange('capacity', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Equipment</label>
            <input
              type="text"
              placeholder="e.g., Projector"
              value={filters.equipment}
              onChange={(e) => handleFilterChange('equipment', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="rooms-grid-section">
        <div className="section-header">
          <h2>Available Rooms ({filteredRooms.length})</h2>
          <div className="status-legend">
            <div className="legend-item">
              <span className="status-dot available"></span>
              Available
            </div>
            <div className="legend-item">
              <span className="status-dot occupied"></span>
              Occupied
            </div>
            <div className="legend-item">
              <span className="status-dot maintenance"></span>
              Maintenance
            </div>
          </div>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="no-rooms">
            <div className="no-rooms-icon">🏢</div>
            <h3>No rooms found</h3>
            <p>Try adjusting your filters to see more results</p>
          </div>
        ) : (
          <div className="rooms-grid">
            {filteredRooms.map(room => (
              <div key={room.id} className="room-card">
                <div className="room-header">
                  <h3>{room.name}</h3>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(room.status) }}
                  >
                    {getStatusIcon(room.status)} {room.status}
                  </span>
                </div>
                <div className="room-details">
                  <div className="detail-item">
                    <span className="detail-icon">🏛️</span>
                    <span>{room.building}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">👥</span>
                    <span>Capacity: {room.capacity} people</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⚙️</span>
                    <span className="equipment-list">
                      {room.equipment.join(', ')}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⏰</span>
                    <span>Next available: {room.nextBooking}</span>
                  </div>
                </div>
                <div className="room-actions">
                  <button className="btn-primary" disabled={room.status !== 'available'}>
                    📅 Book Room
                  </button>
                  <button className="btn-secondary">
                    👁️ View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomAvailability;