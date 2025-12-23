import React, { useState, useEffect } from 'react'; //
import AnnouncementCard from '../components/AnnouncementCard';
import '../styles/AnnouncementsManagement.css';

const AnnouncementsManagement = () => {
  // --- STATE MANAGEMENT ---
  const [showForm, setShowForm] = useState(false);
  const [announcements, setAnnouncements] = useState([]); // NEW: Holds the DB data
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customFieldName, setCustomFieldName] = useState("");

  // Standard fields
  const [mandatoryFields, setMandatoryFields] = useState({
    Title: "",
    Date: "",
    Summary: "",
    Content: ""
  });

  // Dynamic fields
  const [dynamicFields, setDynamicFields] = useState([]);

  // --- FETCH LOGIC ---
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/announcements/all');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements(); // Fetch on page load
  }, []);

  // --- HANDLERS ---
  const handleMandatoryChange = (e) => {
    setMandatoryFields({ ...mandatoryFields, [e.target.name]: e.target.value });
  };

  const handleDynamicChange = (index, value) => {
    const updatedFields = [...dynamicFields];
    updatedFields[index].value = value;
    setDynamicFields(updatedFields);
  };

  const handleAddField = (fieldKey) => {
    if (fieldKey === "Custom") {
      setShowCustomInput(true);
      setIsDropdownOpen(false);
    } else {
      if (!dynamicFields.some(f => f.key === fieldKey)) {
        setDynamicFields([...dynamicFields, { key: fieldKey, value: "" }]);
      }
      setIsDropdownOpen(false);
    }
  };

  const confirmCustomField = () => {
    if (customFieldName.trim() !== "") {
      setDynamicFields([...dynamicFields, { key: customFieldName, value: "" }]);
      setCustomFieldName("");
      setShowCustomInput(false);
    }
  };

  const removeDynamicField = (index) => {
    const updatedFields = dynamicFields.filter((_, i) => i !== index);
    setDynamicFields(updatedFields);
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = async () => {
    if (
        !mandatoryFields.Title.trim() ||
        !mandatoryFields.Date ||
        !mandatoryFields.Summary.trim() ||
        !mandatoryFields.Content.trim()
    ) {
      alert("⚠️ Please fill in all mandatory fields.");
      return;
    }

    const payload = {
      name: mandatoryFields.Title,
      attributes: {
        ...mandatoryFields,
        ...dynamicFields.reduce((acc, field) => {
          if(field.value.trim() !== "") {
            acc[field.key] = field.value;
          }
          return acc;
        }, {})
      }
    };

    try {
      const response = await fetch('http://localhost:8080/api/announcements/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("✅ Published Successfully!");
        setShowForm(false);
        setMandatoryFields({ Title: "", Date: "", Summary: "", Content: "" });
        setDynamicFields([]);
        fetchAnnouncements(); // REFRESH THE LIST IMMEDIATELY
      }
    } catch (error) {
      console.error("Connection Error:", error);
    }
  };

  return (
      <div className="announcement-container">
        <div className="header-section">
          <h1>Announcements Management</h1>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            📢 Create Announcement
          </button>
        </div>

        {/* --- REPLACED MOCK LIST WITH REAL CARDS --- */}
        <div className="announcements-display-grid">
          {announcements.length > 0 ? (
              announcements.map((ann, index) => (
                  <AnnouncementCard key={index} announcement={ann} isAdminView={true} />
              ))
          ) : (
              <div className="empty-state">
                <p>No announcements found. Click "Create" to add one!</p>
              </div>
          )}
        </div>

        {/* --- MODAL (Kept same as original) --- */}
        {showForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>New Announcement</h2>
                  <button onClick={() => setShowForm(false)} className="close-btn">✕</button>
                </div>
                <div className="form-container">
                  {['Title', 'Date', 'Summary'].map((field) => (
                      <div key={field} className="form-group">
                        <label className="form-label">{field} *</label>
                        <input
                            type={field === 'Date' ? 'date' : 'text'}
                            name={field}
                            value={mandatoryFields[field]}
                            onChange={handleMandatoryChange}
                            className="form-control"
                        />
                      </div>
                  ))}
                  <div className="form-group">
                    <label className="form-label">Content *</label>
                    <textarea
                        name="Content"
                        value={mandatoryFields.Content}
                        onChange={handleMandatoryChange}
                        rows="3"
                        className="form-control"
                    />
                  </div>
                  {/* ... (dynamic field logic kept same) */}
                  {dynamicFields.map((field, index) => (
                      <div key={index} className="form-group">
                        <label className="form-label">{field.key}</label>
                        <div className="dynamic-row">
                          <input
                              type="text"
                              value={field.value}
                              onChange={(e) => handleDynamicChange(index, e.target.value)}
                              className="form-control"
                          />
                          <button onClick={() => removeDynamicField(index)} className="btn btn-danger">Delete</button>
                        </div>
                      </div>
                  ))}
                  {/* ... (Add field button and Save button kept same) */}
                  <div className="modal-footer">
                    <button onClick={handleSubmit} className="btn btn-primary">Publish Announcement</button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default AnnouncementsManagement;