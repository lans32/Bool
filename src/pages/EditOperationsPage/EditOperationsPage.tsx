import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchOperations } from '../../slices/operationsSlice';
import { Api } from '../../api/Api_generated';
import { Operation } from '../../api/Api_generated';

const api = new Api();

const EditOperationsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { operations, loading, error } = useAppSelector((state) => state.operations);
    const [newOperation, setNewOperation] = useState<Partial<Operation>>({});
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchOperations());
    }, [dispatch]);

    const handleAddOperation = async () => {
        try {
            if (!newOperation.name || !newOperation.operator_name) {
                setLocalError('Name and Operator Name are required');
                return;
            }

            const operationData: Operation = {
                name: newOperation.name,
                operator_name: newOperation.operator_name,
                description: newOperation.description || null,
                photo: newOperation.photo || null,
                value_0: newOperation.value_0 || null,
                value_A: newOperation.value_A || null,
                value_B: newOperation.value_B || null,
                value_AB: newOperation.value_AB || null
            };

            const response = await api.operations.operationsCreate(operationData);
            if (response.data) {
                dispatch(fetchOperations());
                setNewOperation({});
            }
        } catch (error) {
            setLocalError('Failed to add operation');
        }
    };

    const handleEditOperation = async (id: number) => {
        try {
            const operation = operations.find(op => op.id === id);
            if (!operation) return;

            const response = await api.operations.operationsUpdate(id.toString(), operation);
            if (response.data) {
                dispatch(fetchOperations());
            }
        } catch (error) {
            setLocalError('Failed to edit operation');
        }
    };

    const handleDeleteOperation = async (id: number) => {
        try {
            await api.operations.operationsDelete(id.toString());
            dispatch(fetchOperations());
        } catch (error) {
            setLocalError('Failed to delete operation');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error || localError) return <div>{error || localError}</div>;

    return (
        <div className="operations-admin-page">
            <h1>Operations Management</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Operator Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {operations.map((operation) => (
                        <tr key={operation.id}>
                            <td>{operation.name}</td>
                            <td>{operation.operator_name}</td>
                            <td>{operation.description}</td>
                            <td>
                                <button onClick={() => handleEditOperation(operation.id)}>Edit</button>
                                <button onClick={() => handleDeleteOperation(operation.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <h2>Add New Operation</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={newOperation.name || ''}
                    onChange={(e) => setNewOperation({ ...newOperation, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Operator Name"
                    value={newOperation.operator_name || ''}
                    onChange={(e) => setNewOperation({ ...newOperation, operator_name: e.target.value })}
                />
                <textarea
                    placeholder="Description"
                    value={newOperation.description || ''}
                    onChange={(e) => setNewOperation({ ...newOperation, description: e.target.value })}
                />
                <button onClick={handleAddOperation}>Add Operation</button>
            </div>
        </div>
    );
};

export default EditOperationsPage;