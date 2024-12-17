import { useEffect, useState } from 'react';
import API from '../../api/API';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from "../../store";
import './AsksPage.css';

interface Ask {
    id: string;
    first_operand: boolean | null;
    created_at: string;
    formed_at: string;
    completed_at: string;
    status: string;
    creator: string;
}

const AsksPage = () => {
  const [asks, setAsks] = useState<Ask[]>([]);
  const [filteredAsks, setFilteredAsks] = useState<Ask[]>([]);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [authorFilter, setAuthorFilter] = useState<string>("");
  const navigate = useNavigate();

  const { isStaff } = useSelector((state: RootState) => state.user);
  console.log('isStaff:', isStaff);

  const fetchAsks = async () => {
    try {
      const response = await API.getAsks({ status });
      const data = (await response.json()) as Ask[];
      setAsks(data);
      setFilteredAsks(data);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
    }
  };

  useEffect(() => {
    fetchAsks();
  }, [status]);

  useEffect(() => {
    const filtered = asks.filter((ask) => {
      const askDate = new Date(ask.created_at);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;
      const statusMatch = status ? ask.status === status : true;

      return (
        (!fromDate || askDate >= fromDate) &&
        (!toDate || askDate <= toDate) &&
        (!authorFilter || ask.creator.toLowerCase().includes(authorFilter.toLowerCase())) &&
        statusMatch
      );
    });
    setFilteredAsks(filtered);
  }, [dateFrom, dateTo, authorFilter, asks, status]);

  const formatDate = (dateString: string): string =>
    dateString ? dateString.split('T')[0] : '—';

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'f':
        return 'В работе';
      case 'c':
        return 'Завершена';
      case 'r':
        return 'Отклонена';
      default:
        return 'Неизвестен';
    }
  };

  const getFirstOperand = (firstOperand: boolean | null): string =>
    firstOperand === null ? '—' : firstOperand ? 'True' : 'False';

  const handleAccept = async (id: string) => {
    try {
      const response = await API.completeAsk(parseInt(id));
      if (response.ok) {
        console.log(`Заявка с ID ${id} успешно завершена.`);
        fetchAsks();
      } else {
        console.error(`Не удалось завершить заявку с ID ${id}:`, response);
      }
    } catch (error) {
      console.error(`Ошибка при завершении заявки с ID ${id}:`, error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await API.rejectedAsk(parseInt(id));
      if (response.ok) {
        console.log(`Заявка с ID ${id} успешно отклонена.`);
        fetchAsks();
      } else {
        console.error(`Не удалось отклонить заявку с ID ${id}:`, response);
      }
    } catch (error) {
      console.error(`Ошибка при отклонении заявки с ID ${id}:`, error);
    }
  };

  return (
    <div className="asks-page">
      <h1>Ваши заявки</h1>
      <div className="filters">
      {isStaff && (
          <label>
            Автор:
            <input
              type="text"
              className="asks-page-input"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              placeholder="Введите автора"
            />
          </label>
        )}
        <label>
          Дата от:
          <input
            type="date"
            className="asks-page-input"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </label>
        <label>
          Дата до:
          <input
            type="date"
            className="asks-page-input"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </label>
        <label>
          Статус:
          <select
            className="asks-page-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Все</option>
            <option value="f">В работе</option>
            <option value="c">Завершена</option>
            <option value="r">Отклонена</option>
          </select>
        </label>
      </div>

      <div className="asks-list">
        {filteredAsks.map((ask) => (
          <div
            key={ask.id}
            className="ask-row"
            onClick={() => navigate(`/asks/${ask.id}`)}
          >
            <div className="ask-row-section">
              <strong>№</strong>
              <div>{ask.id}</div>
            </div>
            <div className="ask-row-section">
              <strong>Первый операнд</strong>
              <div>{getFirstOperand(ask.first_operand)}</div>
            </div>
            <div className="ask-row-section">
              <strong>Статус</strong>
              <div>{getStatusText(ask.status)}</div>
            </div>
            <div className="ask-row-section">
              <strong>Дата создания</strong>
              <div>{formatDate(ask.created_at)}</div>
            </div>
            <div className="ask-row-section">
              <strong>Дата формирования</strong>
              <div>{formatDate(ask.formed_at)}</div>
            </div>
            <div className="ask-row-section">
              <strong>Дата завершения</strong>
              <div>{formatDate(ask.completed_at)}</div>
            </div>
            {isStaff && (
              <div className="ask-row-section">
                <strong>Создатель</strong>
                <div>{ask.creator}</div>
              </div>
            )}

            {isStaff && ask.status === "f" && (
              <>
                <div className="ask-row-section">
                  <button
                    className="ask-complete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(ask.id);
                    }}
                  >
                    Принять
                  </button>
                </div>
                <div className="ask-row-section">
                  <button
                    className="ask-reject"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(ask.id);
                    }}
                  >
                    Отклонить
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AsksPage;