import React from 'react';
import { Link } from 'react-router-dom';
import { T_Operation } from '../../modules/types';
import './OperationCard.css';

type OperationCardProps = {
    operation: T_Operation;
};

const OperationCard: React.FC<OperationCardProps> = ({ operation }) => {
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
                <form method="post" action={`/operation/${operation.id}/add_operation/`}>
                    <button className="button" type="submit">
                        <span className="button_text">Добавить заявку</span>
                    </button>
                </form>
            </div>
        </div>
    );        
};

export default OperationCard;
