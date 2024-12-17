// src/pages/EditOperationPage/EditOperationPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import API from '../../api/API';
import { T_Operation } from '../../modules/types';
import defaultimg from '../../../public/default.jpg';
import './EditOperationPage.css'; // Import the CSS file

const EditOperationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isStaff } = useAppSelector((state) => state.user);
  const [operation, setOperation] = useState<T_Operation | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isStaff) {
      navigate('/'); // Redirect if not a staff member
    } else if (id) {
      fetchOperation();
    }
  }, [id, isStaff, navigate]);

  const fetchOperation = async () => {
    try {
      const response = await API.getOperationDetails(id!); // Use non-null assertion
      if (response.ok) {
        const data = await response.json();
        setOperation(data);
      }
    } catch (error) {
      setLocalError('Failed to fetch operation');
    }
  };

  const handleFieldChange = (field: keyof T_Operation, value: any) => {
    setOperation((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleSaveChanges = async () => {
    if (operation) {
      try {
        const response = await API.updateOperation(operation.id, operation);
        if (response.ok) {
          navigate(`/operation/${operation.id}`);
        }
      } catch (error) {
        setLocalError('Failed to save changes');
      }
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('photo', file);

      try {
        // Call the API to upload the image
        const response = await API.operationsImageUpdate(operation!.id.toString(), formData);
        if (response.ok) {
          const data = await response.json();
          const imageName = data.photo_url.split('/').pop(); // Extract the image name from the URL

          // Update the operation's photo field with the image name
          setOperation((prev) => prev ? { ...prev, photo: imageName } : null);
          fetchOperation(); // Refresh operation data
        } else {
          const errorData = await response.json();
          setLocalError(errorData.photo ? errorData.photo.join(', ') : 'Failed to update image');
        }
      } catch (error) {
        setLocalError('Failed to update image');
      }
    }
  };

  if (!operation) return <div>Loading...</div>;
  if (localError) return <div>{localError}</div>;

  return (
    <div className="container-fluid product-container">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="product-operation-container">
            <h1>Редактирование операции: {operation.name}</h1>
              <div className="product-operations">
                <img
                  src={operation.photo || defaultimg}
                  alt={operation.name}
                  className="product-image"
                />
                <input type="file" onChange={handleImageChange} />
                <div className="info">
                  <label htmlFor="operation-name">Имя операции:</label>
                  <input
                    id="operation-name"
                    type="text"
                    value={operation.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                  />
                  
                  <label htmlFor="operator-name">Имя оператора:</label>
                  <input
                    id="operator-name"
                    type="text"
                    value={operation.operator_name}
                    onChange={(e) => handleFieldChange('operator_name', e.target.value)}
                  />
                  
                  <label htmlFor="operation-description">Описание:</label>
                  <textarea
                    id="operation-description"
                    value={operation.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                  />
                  
                  <h2>Таблица истинности</h2>
                  <table className="truth-table">
                    <thead>
                      <tr>
                        <th>A</th>
                        <th>B</th>
                        <th>Результат</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>0</td>
                        <td>0</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={operation.value_0}
                            onChange={(e) => handleFieldChange('value_0', e.target.checked)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>1</td>
                        <td>0</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={operation.value_A}
                            onChange={(e) => handleFieldChange('value_A', e.target.checked)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>0</td>
                        <td>1</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={operation.value_B}
                            onChange={(e) => handleFieldChange('value_B', e.target.checked)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={operation.value_AB}
                            onChange={(e) => handleFieldChange('value_AB', e.target.checked)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <button onClick={handleSaveChanges}>Сохранить изменения</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default EditOperationPage;