import { useEffect, FormEvent, useState } from 'react'; 
import './OperationsPage.css';
import { OperationsMocks } from '../../modules/mocks';
import { T_Operation } from '../../modules/types';
import OperationCard from '../../components/OperationCard/OperationCard';

const OperationsPage = () => {
    const [operations, setOperations] = useState<T_Operation[]>([]);
    const [isMock, setIsMock] = useState(false);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/operations/?name=${name.toLowerCase()}`, { signal: AbortSignal.timeout(1000) });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setOperations(result.operations);
            setQuantity( result.quantity || 0 );
            setIsMock(false);
        } catch (error) {
            createMocks();
        }
    };
    
    
    const createMocks = () => {
        setIsMock(true);
        setOperations(OperationsMocks.filter(operation => operation.name.toLowerCase().includes(name.toLowerCase())));
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await fetchData();
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="product-list-page">
            <div className="container">
                {/* Верхний ряд для корзины и поиска */}
                <div className="search-and-bucket">
                    {/* Корзина слева */}
                    <div className="bucket-icon">
                        <a href={`/ask/1`}>
                            <img src="calc_icon.svg" alt="Cart" className="bucket-image" />
                        </a>
                        <span className="bucket-count">
                            {quantity > 0 ? quantity : 0}
                        </span>
                    </div>

    
                    {/* Поиск справа */}
                    <form onSubmit={handleSubmit} className="search-bar">
                        <input
                            type="text"
                            name="search_product"
                            className="search-bar"
                            placeholder="Введите название"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button type="submit" className="search-button">
                            <img src="search.svg" alt="Search" />
                        </button>
                    </form>
                </div>
    
                {/* Ряд для списка карточек, центрированного по странице */}
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="product-list">
                            {operations.length ? (
                                operations.map((operation) => (
                                    <OperationCard key={operation.id} operation={operation} />
                                ))
                            ) : (
                                <p>Операции не найдены.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );    
};

export default OperationsPage;