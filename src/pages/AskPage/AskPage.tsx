import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/API";
import "./AskPage.css";

interface Operation {
    id: number;
    name: string;
    operator_name: string;
    description: string;
    photo: string;
    status: string;
    value_0: boolean;
    value_A: boolean;
    value_B: boolean;
    value_AB: boolean;
}

interface Ask {
    id: string;
    first_operand: boolean | null;
    operations: { operation: Operation; second_operand: boolean | null }[];
    created_at: string;
    status: string;
}

const AskPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [ask, setAsk] = useState<Ask | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    console.log("id:", id);

    useEffect(() => {
        const getAskDetails = async () => {
            if (!id)  return;
            try {
                const response = await API.getAskById(Number(id));
                console.log("Response status:", response.status);
                const data = await response.json();
                console.log("Data received:", data);
                setAsk(data);
            } catch (error) {
                console.error("Ошибка при загрузке данных о заявке:", error);
                setError("Не удалось загрузить данные о заявке");
            } finally {
                setLoading(false);
            }
        };
        getAskDetails();
    }, [id]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;
    if (!ask) return <div>Заявка не найдена.</div>;

    const isEditable = ask.status !== 'f' && ask.status !== 'c' && ask.status !== 'r';

    const handleSubmit = async () => {
        try {
            await API.formAsk(Number(id));
            navigate('/');
        } catch (error) {
            console.error('Ошибка при завершении заявки:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await API.deleteAsk(Number(id));
            navigate('/');
        } catch (error) {
            console.error('Ошибка при удалении:', error);
        }
    };

    const handleOperationDelete = async (operationId: string, index: number) => {
        if (!ask) return;
        try {
            await API.deleteOperationFromDraft(Number(id), Number(operationId));
            const updatedOperations = [...ask.operations];
            updatedOperations.splice(index, 1); // Удаляем операцию из массива
            setAsk({ ...ask, operations: updatedOperations });
        } catch (error) {
            console.error('Ошибка при удалении операции:', error);
        }
    };

    const handleFirstOperandBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const newFirstOperand = e.target.value;
        let operandToSend: boolean | undefined;

        if (newFirstOperand === 'true') {
            operandToSend = true;
        } else if (newFirstOperand === 'false') {
            operandToSend = false;
        }

        if (operandToSend !== undefined && operandToSend !== ask?.first_operand) {
            await API.changeAddFields(Number(id), operandToSend); 
        }
    };

    return (
        <div>
            <div className="ask_title">Заявка № {ask.id}</div>

            <div className="container">
            <div className="input-section">
                <label htmlFor="a">Введите значение первого операнда:</label>
                <select
                    id="a"
                    name="a"
                    value={ask.first_operand?.toString()}
                    onChange={async (e) => {
                        const newFirstOperand = e.target.value === "true";
                        if (newFirstOperand !== ask.first_operand) {
                            await API.changeAddFields(Number(id), newFirstOperand);
                            setAsk({ ...ask, first_operand: newFirstOperand });
                        }
                    }}
                    onBlur={async (e) => {
                        const newFirstOperand = e.target.value === "true";
                        if (newFirstOperand !== ask.first_operand) {
                            await API.changeAddFields(Number(id), newFirstOperand);
                            setAsk({ ...ask, first_operand: newFirstOperand });
                        }
                    }}
                >
                    <option value="false">0</option>
                    <option value="true">1</option>
                </select>
            </div>

                {ask.operations.map((operationData, index) => {
                    const { operation, second_operand } = operationData;
                    return (
                        <div className="operation" key={operation.id}>
                            <div className="operation-title">
                                Операция {index + 1}: {operation.description}
                            </div>
                            <div className="operation-content">
                                <img src={operation.photo} alt={operation.description} />
                                <label htmlFor={`second-operands-${operation.id}`}>Введите значение второго операнда:</label>
                                <select
                                    className="form-control"
                                    id={`second-operands-${operation.id}`}
                                    value={second_operand?.toString()}
                                    onChange={async (e) => {
                                        const newSecondOperand = e.target.value === "true";
                                        const updatedOperations = [...ask.operations];
                                        updatedOperations[index] = {
                                            ...updatedOperations[index],
                                            second_operand: newSecondOperand,
                                        };
                                        setAsk({ ...ask, operations: updatedOperations });
                                    }}
                                >
                                    <option value="false">0</option>
                                    <option value="true">1</option>
                                </select>
                            </div>
                            {isEditable && (
                                <button
                                    type="button"
                                    onClick={() => handleOperationDelete(operation.id.toString(), index)}
                                >
                                    Удалить операцию
                                </button>
                            )}
                        </div>
                    );
                })}

                {isEditable && (
                    <>
                        <div className="button-container">
                            <button type="button" onClick={handleSubmit}>
                                Вычислить
                            </button>
                        </div>

                        <form
                            method="POST"
                            action="#"
                            className="button-container"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                        >
                            <button className="del-btn">Удалить заявку</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default AskPage;
