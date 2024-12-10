import React from 'react';
import { Link } from 'react-router-dom';
import { T_Operation } from '../../modules/types';
import './OperationCard.css';
import API from "../../api/API";
import { fetchOperations } from '../../slices/operationsSlice';
import { useAppDispatch } from '../../hooks'; 

type OperationCardProps = {
    operation: T_Operation;
};

const OperationCard: React.FC<OperationCardProps> = ({ operation }) => {
    const dispatch = useAppDispatch();

    const handleAddToAsk = async (event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            // Выполняем запрос на добавление операции
            const response = await API.addOperationToDraft(Number(operation.id));
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            // После успешного выполнения обновляем состояние через fetchOperations
            dispatch(fetchOperations());
        } catch (error) {
            console.error("Ошибка при добавлении операции в заявку:", error);
        }
    };

    return (
        <div className="card">
            {/* Верхняя часть карточки с заголовком */}
            <div className="head_card">
                <h3 className="name_card"> {operation.name} </h3>
            </div>
    
            {/* Описание операции */}
            <div className="operation_discription">
                <p className="description_text">{operation.operator_name}</p>
            </div>
    
            {/* Контент карточки с изображением */}
            <div className="card_content">
                <img
                    src={operation.photo || 'default.jpg'}
                    alt={operation.name}
                    className="card_image"
                />
    
                {/* Кнопки внизу */}
                <Link to={`/operation/${operation.id}`} style={{ textDecoration: 'none' }}>
                    <div className="button">
                        <span className="button_text">Подробнее</span>
                    </div>
                </Link>
                <div>
                    <button onClick={handleAddToAsk} className="button">
                        <span className="button_text">Добавить заявку</span>
                    </button>
                </div>
            </div>
        </div>
    );        
};

export default OperationCard;
