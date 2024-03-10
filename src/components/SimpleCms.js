import React, { useState } from 'react';
import CMS from "../common/cms.json";
import "../SimpleCms.css";
import ImageSelectorModal from './atoms/ImageSelectorModal';
ImageSelectorModal

const SimpleCms = () => {
  const [assets, setAssets] = useState(CMS.assets);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageModalTitle, setImageModalTitle] = useState('');
  const [currentEditingPath, setCurrentEditingPath] = useState({});

  const handleOpenImageSelector = (assetId, field, index = null, subField = null) => {
    setCurrentEditingPath({ assetId, field, index, subField });
    setImageModalTitle(assetId);
    setIsImageModalOpen(true);
  };

  const onSelectImage = (imagePath) => {
    const { assetId, field, index, subField } = currentEditingPath;
    if (index != null && subField) {
      // If it's a nested object field
      handleNestedObjectChange(assetId, field, index, subField, imagePath);
    } else {
      // If it's a direct field
      handleChange(assetId, field, imagePath);
    }
    
    setIsImageModalOpen(false);
  }

  const handleNestedObjectChange = (assetId, field, index, subField, newValue) => {
    const updatedAssets = { ...assets };
    const updatedArray = [...updatedAssets[assetId][field]];
    updatedArray[index] = { ...updatedArray[index], [subField]: newValue };
    updatedAssets[assetId][field] = updatedArray;
    setAssets(updatedAssets);
  };

  const handleChange = (assetId, field, newValue, isSubField = false, subField = null) => {
    const updatedAssets = { ...assets };
    if (isSubField) {
      updatedAssets[assetId][field][subField] = newValue;
    } else {
      updatedAssets[assetId][field] = newValue;
    }
    setAssets(updatedAssets);
  };

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
      
      const handleAddNestedItem = (assetId, field) => {
        const updatedArray = [...assets[assetId][field], { ...newItemTemplate }];
        setAssets({
          ...assets,
          [assetId]: {
            ...assets[assetId],
            [field]: updatedArray,
          },
        });
      };
   
      const renderNestedObjectField = (assetId, field, array, key) => {
        return array.map((item, index) => (
          <div key={`${key}-${index}`} className="nestedObjectContainer">
            {Object.entries(item).map(([subField, subValue]) => (
              <div key={`${key}-${index}-${subField}`} className="nestedObjectField">
                <label>{subField}:</label>
                {
                  (subField === 'imagePath') ?  
                  (
                    // <img src={subValue} className='thumbnail' onClick={() => setIsImageModalOpen(true)}/>
                    <img src={subValue} className='thumbnail' onClick={() => handleOpenImageSelector(assetId, field, index, subField)} />

                  ) : 
                  (                
                    <input
                      type="text"
                      value={subValue}
                      onChange={(e) => handleNestedObjectChange(assetId, field, index, subField, e.target.value)}
                      className="input"
                    />
                  )
                }
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
      
    
      const renderField = (assetId, field, value, key) => {
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
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
            return (
              <div className="fieldContainer" key={key}>
                <label className="label">{field}:</label>
                {
                  (field === 'imagePath' || field === 'male' || field === 'female') ?  
                  (
                    // <img src={value} className='thumbnail' onClick={() => setIsImageModalOpen(true)}/>
                    <img src={value} className='thumbnail' onClick={() => handleOpenImageSelector(assetId, field)} />

                  ) : 
                  (<input
                    type="text"
                    value={typeof value === 'string' ? value : ''}
                    onChange={(e) => handleChange(assetId, field, e.target.value)}
                    className="input"
                  />)
                }
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
    <>
      <form onSubmit={handleSubmit} className="simpleCmsForm">
        {Object.entries(assets).map(([id, asset]) => (
          <div key={id} className="assetContainer">
            <h3 className="assetTitle">{id}</h3>
            {Object.entries(asset).map(([field, value]) => renderField(id, field, value, `${id}-${field}`))}
          </div>
        ))}
        <button type="submit" className="submitButton">Save Changes</button>
      </form>
      <ImageSelectorModal title={imageModalTitle} isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} onSelectImage={onSelectImage}/>
    </>
  );
};

export default SimpleCms;
