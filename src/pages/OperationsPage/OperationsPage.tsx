// OperationsPage.tsx
import { useEffect, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './OperationsPage.css';
import { T_Operation } from '../../modules/types';
import OperationCard from '../../components/OperationCard/OperationCard';
import TrafficLight from '../../components/TrafficLight/TrafficLight';
import {
    setOperations,
    setIsMock,
    setName,
    setQuantity,
} from '../../slices/operationsSlice';
import { RootState } from '../../store';
import { OperationsMocks } from '../../modules/mocks';

const OperationsPage = () => {
    const dispatch = useDispatch();
    const { operations, name } = useSelector((state: RootState) => state.operations);

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/operations/?name=${name.toLowerCase()}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            dispatch(setOperations(result.operations));
            dispatch(setQuantity(result.quantity || 0));
            dispatch(setIsMock(false));
        } catch {
            dispatch(setIsMock(true));
            const mockOperations = OperationsMocks.filter((operation) =>
                operation.name.toLowerCase().includes(name.toLowerCase())
            );
            dispatch(setOperations(mockOperations));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, [name]);

    return (
        <div className="product-list-page">
            <div className="search-and-traffic-light">
                <div className="traffic-light-widget">
                    <TrafficLight />
                </div>
                <form onSubmit={handleSubmit} className="search-input">
                    <input
                        type="text"
                        name="search_product"
                        className="search-input"
                        placeholder="Введите название"
                        value={name}
                        onChange={(e) => dispatch(setName(e.target.value))}
                    />
                </form>
            </div>
            <div className="operation-card-container">
                <div className="operation-card-grid">
                    {operations.length ? (
                        operations.map((operation: T_Operation) => (
                            <OperationCard key={operation.id} operation={operation} />
                        ))
                    ) : (
                        <p>Операции не найдены.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OperationsPage;
