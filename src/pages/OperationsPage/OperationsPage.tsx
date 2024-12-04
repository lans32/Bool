// OperationsPage.tsx
import { FC, useEffect, useState, FormEvent } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import './OperationsPage.css';
import API from "../../api/API";
import { T_Operation } from '../../modules/types';
import OperationCard from '../../components/OperationCard/OperationCard';
import TrafficLight from '../../components/TrafficLight/TrafficLight';
import { setName } from '../../slices/operationsSlice';
import { RootState } from '../../store';
import { OperationsMocks } from '../../modules/mocks';
import { setDraftAsk } from "../../slices/askSlice";

const OperationsPage: FC = () => {
    const dispatch = useDispatch();
    const name = useSelector((state: RootState) => state.operations.name);
    const navigate = useNavigate();
    const { count, draftAskId } = useSelector((state: RootState) => state.ask);

    const [operations, setOperations] = useState<T_Operation[]>([]);

    const fetchData = async () => {
        try {
          const response = await API.getOperations();
          const data = await response.json();
          setOperations(data.operations);
          dispatch(setDraftAsk({
            draftAskId: data.draft_ask_id,
            count: data.count
        }));
        } catch {
          const mockOperations = OperationsMocks.filter((operation) =>
            operation.name.toLowerCase().includes(name.toLowerCase())
          );
          setOperations(mockOperations);
        }
      };      

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        fetchData();
    };

    const handleGoToAsk = () => {
        if (draftAskId) {
            navigate(`/asks/${draftAskId}`);
        }
    };

    useEffect(() => {
        fetchData();
    }, [name]);

    useEffect(() => {
        // Отслеживаем изменения count в Redux, чтобы обновить корзину
        console.log("count updated:", count); // Это можно удалить в продакшн
    }, [count]);

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

                <div
                    onClick={count > 0 ? handleGoToAsk : undefined}
                    style={{ cursor: count > 0 ? 'pointer' : 'not-allowed' }}>
                    <img src="calc_icon.svg" alt="Cart" className="bucket-image"/>
                    <span className="bucket-count">
                        {count}
                    </span>
                </div>
            </div>
            <div className="operation-card-container">
                <div className="operation-card-grid">
                    {operations.length ? (
                        operations.map((operation: T_Operation) => (
                            <OperationCard key={operation.id} operation={operation} />
                        ))
                    ) : (
                        <div><img src="/loading.webp"></img></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OperationsPage;
