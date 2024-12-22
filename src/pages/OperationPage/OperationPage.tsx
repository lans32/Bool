import React, { useEffect } from 'react';
import './OperationPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOperationDetails } from '../../slices/operationsSlice';
import { useAppDispatch, useAppSelector } from '../../hooks'; // Use typed hooks
import defaultimg from '../../../public/default.jpg';

const OperationPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch(); // Use typed dispatch
  const { operations, loading, error } = useAppSelector((state) => state.operations);

  useEffect(() => {
    if (id) {
      dispatch(fetchOperationDetails(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return <div className="loading-gif"><img src="/loading.webp" alt="Loading" /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const operation = operations[0]; // Assuming you have a single operation detail

  if (!operation) {
    return <div>No operation found</div>;
  }

  return (
    <div className="container-fluid product-container">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="product-operation-container">
            <h1 className="product-title">{operation.name}</h1>
            <div className="operation-details-container">
              <div className="product-operations">
                <img
                  src={operation.photo || defaultimg}
                  alt={operation.name}
                  onError={(e) => { e.currentTarget.src = defaultimg; }}
                  className="product-image"
                />
                <div className="info">
                  <p><strong>Оператор:</strong> {operation.operator_name}</p>
                  <p><strong>Описание:</strong> {operation.description}</p>
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
                        <td>{operation.value_0 ? '1' : '0'}</td>
                      </tr>
                      <tr>
                        <td>1</td>
                        <td>0</td>
                        <td>{operation.value_A ? '1' : '0'}</td>
                      </tr>
                      <tr>
                        <td>0</td>
                        <td>1</td>
                        <td>{operation.value_B ? '1' : '0'}</td>
                      </tr>
                      <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>{operation.value_AB ? '1' : '0'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationPage;