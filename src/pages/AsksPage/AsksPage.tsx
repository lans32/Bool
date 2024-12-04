import { useEffect, useState } from 'react';
import API from '../../api/API';
import { useNavigate } from 'react-router-dom';
import './AsksPage.css';
interface Ask {
    id: string;
    first_operand: boolean;
    created_at: string;
    formed_at: string;
    completed_at: string;
    status: string;
    creator: number;
}
const AsksPage = () => {
  const [asks, setAsks] = useState<Ask[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAsks = async () => {
      try {
        const response = await API.getAsks({ date_from: dateFrom, date_to: dateTo, status });
        const data: Ask[] = await response.json();
        setAsks(data);
      } catch (error) {
        console.error('Ошибка при загрузке заявок:', error);
      }
    };
    fetchAsks();
  }, [dateFrom, dateTo, status]);
  const formatDate = (dateString: string): string =>
    dateString ? new Date(dateString).toLocaleString() : '—';
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
  const handleRowClick = (id: string) => {
    navigate(`/asks/${id}`);
  };
  return (
    <div className="asks-page">
      <h1>Ваши заявки</h1>
      <div className="filters">
        <label className='asks-page-label'>
          <input
            type="date"
            value={dateFrom}
            className='asks-page-input'
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </label>
        <label className='asks-page-label'>
          <input
            type="date"
            value={dateTo}
            className='asks-page-input'
            onChange={(e) => setDateTo(e.target.value)}
          />
        </label>
        <label className='asks-page-label'>
          <select value={status} className='asks-page-select' onChange={(e) => setStatus(e.target.value)}>
            <option value="">Все</option>
            <option value="f">В работе</option>
            <option value="c">Завершена</option>
            <option value="r">Отклонена</option>
          </select>
        </label>
      </div>
      <table className="asks-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Дата формирования</th>
            <th>Дата завершения</th>
          </tr>
        </thead>
        <tbody>
          {asks.map((ask) => (
            <tr
              key={ask.id}
              onClick={() => handleRowClick(ask.id)}
            >
              <td>{ask.id}</td>
              <td>{getStatusText(ask.status)}</td>
              <td>{formatDate(ask.created_at)}</td>
              <td>{formatDate(ask.formed_at)}</td>
              <td>{formatDate(ask.completed_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AsksPage;