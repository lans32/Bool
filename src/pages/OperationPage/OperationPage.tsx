
import React, { useEffect, useState } from 'react';
import './OperationPage.css';
import { OperationsMocks } from '../../modules/mocks';
import { T_Operation } from '../../modules/types';
import { useParams } from 'react-router-dom';

import defaultimg from '../../../public/default.jpg'



const OperationPage: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const [operation, setOperation] = useState<T_Operation | null>(null);
  const [isMock, setIsMock] = useState(false);


  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/operations/${id}`, { signal: AbortSignal.timeout(1000) });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setOperation(data);
    } catch (error) {
      console.error('Fetch error:', error);
      createMock();
    }
  };
  

  const createMock = () => {
    setIsMock(true);
    setOperation(OperationsMocks.find(operation => operation?.id == parseInt(id as string)) as T_Operation)
}

  useEffect(() => {
    if (!isMock) {
      fetchData();
    } else {
      createMock();
    }

    return () => {
      setOperation(null);
    };
  }, [id, isMock]);



  if (!operation) {
    return <div>Операция не найдена</div>;
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