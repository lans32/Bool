//OperationsPage.tsx
import { FC, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setName, fetchOperations } from '../../slices/operationsSlice';
import OperationCard from '../../components/OperationCard/OperationCard';
import TrafficLight from '../../components/TrafficLight/TrafficLight';
import './OperationsPage.css';


const OperationsPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { name, operations, loading, error } = useAppSelector((state) => state.operations);
    const { count, draftAskId } = useAppSelector((state) => state.ask);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        dispatch(fetchOperations());
    };

    const handleGoToAsk = () => {
        if (draftAskId) {
            navigate(`/asks/${draftAskId}`);
        }
    };

    useEffect(() => {
        dispatch(fetchOperations());
    }, [dispatch]);
    
    return (
        <div className="product-list-page">
            <div className="search-and-traffic-light">
                <TrafficLight />
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
                <div
                    onClick={count > 0 ? handleGoToAsk : undefined}
                    style={{ cursor: count > 0 ? 'pointer' : 'not-allowed' }}
                >
                    <img src="calc_icon.svg" alt="Cart" className="bucket-image" />
                    <span className="bucket-count">{count}</span>
                </div>
            </div>
            <div className="operation-card-container">
                <div className="operation-card-grid">
                    {loading ? (
                        <img src="/loading.webp" alt="Loading" />
                    ) : error ? (
                        <div>{error}</div>
                    ) : operations.length ? (
                        operations.map((operation) => (
                            <OperationCard key={operation.id} operation={operation} />
                        ))
                    ) : (
                        <div>No operations found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OperationsPage;
