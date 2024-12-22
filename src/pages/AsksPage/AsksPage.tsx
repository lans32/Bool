import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks'; // Import the custom hooks
import { fetchAsks, completeAsk, rejectAsk } from '../../slices/askSlice';
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
  const [filteredAsks, setFilteredAsks] = useState<Ask[]>([]);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [authorFilter, setAuthorFilter] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch(); // Use the typed dispatch

  const { isStaff } = useAppSelector((state) => state.user);
  const { asks, loading, error } = useAppSelector((state) => state.ask);

  useEffect(() => {
    dispatch(fetchAsks(status));
    const intervalId = setInterval(() => dispatch(fetchAsks(status)), 10000);

    return () => clearInterval(intervalId);
  }, [status, dispatch]);

  useEffect(() => {
    const filtered = asks.filter((ask) => {
      const askDate = new Date(ask.created_at);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      // Устанавливаем конец дня для toDate
      const toDateEndOfDay = toDate ? new Date(toDate) : null;
      if (toDateEndOfDay) {
        toDateEndOfDay.setHours(23, 59, 59, 999); // Устанавливаем время на конец дня
      }

      const statusMatch = status ? ask.status === status : true;

      return (
        (!fromDate || askDate >= fromDate) &&
        (!toDateEndOfDay || askDate <= toDateEndOfDay) &&
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

  const handleAccept = (id: string) => {
    dispatch(completeAsk(parseInt(id)));
  };

  const handleReject = (id: string) => {
    dispatch(rejectAsk(parseInt(id)));
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
        <div className="asks-header">
          <div>№</div>
          <div>Первый операнд</div>
          <div>Статус</div>
          <div>Дата создания</div>
          <div>Дата формирования</div>
          <div>Дата завершения</div>
          {isStaff && <div>Создатель</div>}
          {isStaff && <div>Действия</div>}
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          filteredAsks.map((ask) => (
          <div
            key={ask.id}
            className="ask-row"
            onClick={() => navigate(`/asks/${ask.id}`)}
          >
            <div className="ask-row-section">{ask.id}</div>
            <div className="ask-row-section">{getFirstOperand(ask.first_operand)}</div>
            <div className="ask-row-section">{getStatusText(ask.status)}</div>
            <div className="ask-row-section">{formatDate(ask.created_at)}</div>
            <div className="ask-row-section">{formatDate(ask.formed_at)}</div>
            <div className="ask-row-section">{formatDate(ask.completed_at)}</div>
            {isStaff && <div className="ask-row-section">{ask.creator}</div>}
            {isStaff && (
              <div className="ask-row-section">
                {ask.status === 'f' ? (
              <>
                  <button
                    className="ask-complete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(ask.id);
                    }}
                  >
                    Принять
                  </button>
                  <button
                    className="ask-reject"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(ask.id);
                    }}
                  >
                    Отклонить
                  </button>
                  </>
                ) : (
                  <>
                    <button className="ask-complete" disabled>
                      Принять
                    </button>
                    <button className="ask-reject" disabled>
                      Отклонить
                    </button>
                  </>
                )}
                </div>
            )}
          </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AsksPage;