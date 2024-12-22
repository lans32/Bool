import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchOperations, createOperation, deleteOperation } from '../../slices/operationsSlice';
import { Operation } from '../../api/Types';
import './EditOperationsPage.css';

const EditOperationsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { operations, loading, error } = useAppSelector((state) => state.operations);
    const [newOperation, setNewOperation] = useState<Partial<Operation>>({});
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchOperations());
    }, [dispatch]);

    const handleAddOperation = async () => {
            if (!newOperation.name || !newOperation.operator_name) {
                setLocalError('Name and Operator Name are required');
                return;
            }

            const operationData: Omit<Operation, 'id'> = {
                name: newOperation.name,
                operator_name: newOperation.operator_name,
                description: newOperation.description || '',
                photo: newOperation.photo || '',
                status: 'a',
                value_0: newOperation.value_0 || false,
                value_A: newOperation.value_A || false,
                value_B: newOperation.value_B || false,
                value_AB: newOperation.value_AB || false
            };

        try {
            await dispatch(createOperation(operationData)).unwrap();
                setNewOperation({});
        } catch (error) {
            setLocalError('Failed to add operation');
        }
    };

    const handleDeleteOperation = async (id: number) => {
        try {
            await dispatch(deleteOperation(id)).unwrap();
        } catch (error) {
            setLocalError('Failed to delete operation');
        }
    };

    const handleNavigateToEdit = (id: number) => {
        navigate(`/edit-operation/${id}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error || localError) return <div>{error || localError}</div>;

    return (
        <div className="operations-admin-page">
            <h1>Управление операциями</h1>
            <table>
                <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Имя оператора</th>
                        <th>Описание</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {operations.map((operation) => (
                        <tr key={operation.id}>
                            <td>{operation.name}</td>
                            <td>{operation.operator_name}</td>
                            <td>{operation.description}</td>
                            <td>
                                <button onClick={() => handleNavigateToEdit(operation.id)}>Редактировать</button>
                                <button className="delete-button" onClick={() => handleDeleteOperation(operation.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <h2>Добавить новую операцию</h2>
                <input
                    type="text"
                    placeholder="Имя"
                    value={newOperation.name || ''}
                    onChange={(e) => setNewOperation({ ...newOperation, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Имя оператора"
                    value={newOperation.operator_name || ''}
                    onChange={(e) => setNewOperation({ ...newOperation, operator_name: e.target.value })}
                />
                <textarea
                    placeholder="Описание"
                    value={newOperation.description || ''}
                    onChange={(e) => setNewOperation({ ...newOperation, description: e.target.value })}
                />
                <button onClick={handleAddOperation}>Добавить операцию</button>
            </div>
        </div>
    );
};

export default EditOperationsPage;