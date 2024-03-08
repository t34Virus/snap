import React, { useState } from 'react';
import CMS from "../common/cms.json";
import "../SimpleCms.css";

const SimpleCms = () => {
  const [assets, setAssets] = useState(CMS.assets);

  const handleNestedObjectChange = (assetId, field, index, subField, newValue) => {
    // Copy current state
    const updatedAssets = { ...assets };
    // Deep copy the array to preserve immutability
    const updatedArray = [...updatedAssets[assetId][field]];
    // Update the specific field of the object in the array
    updatedArray[index] = { ...updatedArray[index], [subField]: newValue };
    // Update the assets state
    updatedAssets[assetId][field] = updatedArray;
    setAssets(updatedAssets);
  };

  const handleChange = (assetId, field, newValue, isSubField = false, subField = null) => {
    // Update for simple fields and nested objects
    const updatedAssets = { ...assets };
    if (isSubField) {
      // Handle change for nested objects
      updatedAssets[assetId][field][subField] = newValue;
    } else {
      // Handle change for top-level fields
      updatedAssets[assetId][field] = newValue;
    }
    setAssets(updatedAssets);
  };

    // Handle deleting an item from a nested array
    const handleDeleteNestedItem = (assetId, field, index) => {
        const updatedArray = assets[assetId][field].filter((_, idx) => idx !== index);
        setAssets({
          ...assets,
          [assetId]: {
            ...assets[assetId],
            [field]: updatedArray,
          },
        });
      };
    
      const newItemTemplate = {
        title: "",
        imagePath: ""
      };
      
      // Handle adding a new item to a nested array
      const handleAddNestedItem = (assetId, field) => {
        // Use the newItemTemplate when adding a new item
        const updatedArray = [...assets[assetId][field], { ...newItemTemplate }];
        setAssets({
          ...assets,
          [assetId]: {
            ...assets[assetId],
            [field]: updatedArray,
          },
        });
      };
    
      // Existing handleChange and handleNestedObjectChange functions remain the same
    
      const renderNestedObjectField = (assetId, field, array, key) => {
        return array.map((item, index) => (
          <div key={`${key}-${index}`} className="nestedObjectContainer">
            {Object.entries(item).map(([subField, subValue]) => (
              <div key={`${key}-${index}-${subField}`} className="nestedObjectField">
                <label>{subField}:</label>
                <input
                  type="text"
                  value={subValue}
                  onChange={(e) => handleNestedObjectChange(assetId, field, index, subField, e.target.value)}
                  className="input"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleDeleteNestedItem(assetId, field, index)}
              className="deleteButton"
            >
              Delete
            </button>
          </div>
        ));
      };
      
    
      // Include add button for nested arrays
      const renderField = (assetId, field, value, key) => {
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
          // Array holds nested objects
          return (
            <div key={key}>
              <label className="arrayTitle">{field}:</label>
              {renderNestedObjectField(assetId, field, value, key)}
              <button type="button" onClick={() => handleAddNestedItem(assetId, field, {})} className="addButton">
                Add New Item
              </button>
            </div>
          );
        } else {
            // Render a single input for simple fields or unsupported types
            return (
              <div className="fieldContainer" key={key}>
                <label className="label">{field}:</label>
                <input
                  type="text"
                  value={typeof value === 'string' ? value : ''}
                  onChange={(e) => handleChange(assetId, field, e.target.value)}
                  className="input"
                />
              </div>
            );
          }
        };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/update', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ assets }),
      });
      if (!response.ok) throw new Error('Failed to update assets');
      alert('Assets updated successfully!');
    } catch (error) {
      console.error('Failed to submit assets:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="simpleCmsForm">
      {Object.entries(assets).map(([id, asset]) => (
        <div key={id} className="assetContainer">
          <h3 className="assetTitle">{id}</h3>
          {Object.entries(asset).map(([field, value]) => renderField(id, field, value, `${id}-${field}`))}
        </div>
      ))}
      <button type="submit" className="submitButton">Save Changes</button>
    </form>
  );
};

export default SimpleCms;
