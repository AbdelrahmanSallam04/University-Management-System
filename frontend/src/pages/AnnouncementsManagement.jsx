import React, { useState } from 'react';// Make sure to import the CSS file
import '../styles/AnnouncementsManagement.css';

const AnnouncementsManagement = () => {
  // --- STATE MANAGEMENT ---
  const [showForm, setShowForm] = useState(false);
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

  // Pre-defined options
  const fieldOptions = ["Audience", "Priority", "Category", "Link"];

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
    // 1. VALIDATION CHECK
    if (
        !mandatoryFields.Title.trim() ||
        !mandatoryFields.Date ||
        !mandatoryFields.Summary.trim() ||
        !mandatoryFields.Content.trim()
    ) {
      alert("⚠️ Please fill in all mandatory fields (Title, Date, Summary, Content) before saving.");
      return;
    }

    // 2. Structure the data
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

    console.log("Sending to DB:", payload);

    try {
      const response = await fetch('http://localhost:8080/api/announcements/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const successMessage = await response.text();
        alert(`✅ ${successMessage}`);

        // Reset Form and Close Modal
        setShowForm(false);
        setMandatoryFields({ Title: "", Date: "", Summary: "", Content: "" });
        setDynamicFields([]);
      } else {
        const errorText = await response.text();
        alert(`❌ Failed to save. Server said: ${errorText}`);
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("❌ Error: Could not connect to the server. Is the backend running?");
    }
  };

  return (
      <div className="announcement-container">

        {/* --- PAGE HEADER --- */}
        <div className="header-section">
          <h1>Announcements Management</h1>
          <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
          >
            📢 Create Announcement
          </button>
        </div>

        {/* --- MOCK LIST --- */}
        <div className="empty-state">
          <p>No announcements yet. (You need to implement a GET request to fetch them!)</p>
        </div>

        {/* --- CREATE MODAL --- */}
        {showForm && (
            <div className="modal-overlay">
              <div className="modal-content">

                <div className="modal-header">
                  <h2>New Announcement</h2>
                  <button onClick={() => setShowForm(false)} className="close-btn">
                    ✕
                  </button>
                </div>

                <div className="form-container">

                  {/* Mandatory Fields */}
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

                  {/* Dynamic Fields */}
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
                          <button
                              onClick={() => removeDynamicField(index)}
                              className="btn btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                  ))}

                  {/* Add Field Buttons */}
                  <div className="add-field-container">
                    {!showCustomInput ? (
                        <>
                          <button
                              type="button"
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                              className="btn btn-add-attr"
                          >
                            + Add Attribute
                          </button>

                          {isDropdownOpen && (
                              <div className="dropdown-menu">
                                {fieldOptions.map(opt => (
                                    <div
                                        key={opt}
                                        onClick={() => handleAddField(opt)}
                                        className="dropdown-item"
                                    >
                                      {opt}
                                    </div>
                                ))}
                                <div
                                    onClick={() => handleAddField("Custom")}
                                    className="dropdown-item custom"
                                >
                                  + Custom Field...
                                </div>
                              </div>
                          )}
                        </>
                    ) : (
                        <div className="custom-input-group">
                          <input
                              type="text"
                              placeholder="Field name..."
                              value={customFieldName}
                              onChange={(e) => setCustomFieldName(e.target.value)}
                              className="form-control"
                              autoFocus
                          />
                          <button onClick={confirmCustomField} className="btn btn-success">Save</button>
                          <button onClick={() => setShowCustomInput(false)} className="btn btn-secondary">Cancel</button>
                        </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="modal-footer">
                    <button
                        onClick={handleSubmit}
                        className="btn btn-primary"
                    >
                      Publish Announcement
                    </button>
                  </div>

                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default AnnouncementsManagement;