import { useEffect, useState } from 'react';
import { UserAvailability, DailyTask } from '@team-forge/shared/data-access';
import { TaskDrilldownDialog } from '../task-drilldown/task-drilldown-dialog';

// Sub-component: AvailabilityCell
const AvailabilityCell = ({
  hours,
  onClick,
}: {
  hours: number;
  onClick: () => void;
}) => {
  let cellClass = 'ag-cell-empty';
  let displayValue = hours > 0 ? hours.toString() : '-';

  if (hours > 24) {
    displayValue = '24+';
    cellClass = 'ag-cell-overloaded';
  } else if (hours > 9) {
    cellClass = 'ag-cell-overloaded';
  } else if (hours > 6) {
    cellClass = 'ag-cell-busy';
  } else if (hours > 0) {
    cellClass = 'ag-cell-healthy';
  }

  return (
    <div
      onClick={onClick}
      className={`ag-cell ${cellClass} ${
        hours > 0 ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''
      }`}
      title={hours > 0 ? `${hours} hours - Click to view` : ''}
    >
      {displayValue}
    </div>
  );
};

interface SelectedCellData {
  userId: string;
  userName: string;
  date: string;
  tasks: DailyTask[];
}

export const AvailabilityGrid = ({ teamId }: { teamId: string }) => {
  const [data, setData] = useState<UserAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState<Date[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<SelectedCellData | null>(
    null
  );

  useEffect(() => {
    // Generate next 14 days
    const today = new Date();
    const next14Days = [];
    for (let i = 0; i < 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        next14Days.push(d);
    }
    setDates(next14Days);

    if (teamId) {
        setLoading(true);
        setError(null);
        const startDate = next14Days[0].toISOString().split('T')[0];
        const endDate = next14Days[next14Days.length - 1].toISOString().split('T')[0];

        (window as any).fetch(`/api/reports/availability?teamId=${teamId}&startDate=${startDate}&endDate=${endDate}`)
            .then((res: any) => {
                if (res.ok) return res.json();
                throw new Error(`Failed to load report: ${res.statusText}`);
            })
            .then((json: any) => {
                const results = json.data || json;
                if (!Array.isArray(results)) {
                    console.error('Expected array but got:', results);
                    throw new Error('Invalid data format received from server');
                }
                setData(results as UserAvailability[]);
            })
            .catch((e: any) => {
                console.error(e);
                setError('Error connecting to server');
            })
            .finally(() => setLoading(false));
    }
  }, [teamId]);

  const handleCellClick = (
    user: UserAvailability,
    date: string,
    tasks: DailyTask[]
  ) => {
    if (!tasks || tasks.length === 0) return;
    setSelectedCell({
      userId: user.userId,
      userName: user.userName,
      date: date,
      tasks: tasks,
    });
  };

  const closeDialog = () => setSelectedCell(null);

  if (!teamId) return <div className="text-gray-500 p-4">Select a team to view availability.</div>;
  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading availability report...</div>;
  if (error) return <div className="p-4 text-red-600 bg-red-50 rounded border border-red-200">{error}</div>;

  return (
    <div className="ag-grid-container relative">
      <div className="ag-table-wrapper">
        <table className="ag-table">
            <thead className="ag-thead">
            <tr>
              <th scope="col" className="ag-th-member">
                Team Member
              </th>
              {dates.map((d) => (
                <th key={d.toISOString()} scope="col" className="ag-th-date">
                  <div className="ag-date-weekday">
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="ag-date-day">
                    {d.toLocaleDateString('en-US', { day: 'numeric', month: 'numeric' })}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.userId} className="ag-row">
                <td className="ag-td-member">
                  <div className="ag-member-info">
                    <div className="ag-avatar">
                        {user.userName.substring(0, 2).toUpperCase()}
                    </div>
                    <span>{user.userName}</span>
                  </div>
                </td>
                {dates.map((d) => {
                  const dateKey = d.toISOString().split('T')[0];
                  const dayData = user.dailyLoad[dateKey];
                  const hours = dayData ? dayData.totalHours : 0;
                  const tasks = dayData ? dayData.tasks : [];

                  return (
                    <td key={dateKey} className="ag-td-cell">
                      <AvailabilityCell
                        hours={hours}
                        onClick={() => handleCellClick(user, dateKey, tasks)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TaskDrilldownDialog
        isOpen={!!selectedCell}
        onClose={closeDialog}
        date={selectedCell?.date || ''}
        userName={selectedCell?.userName || ''}
        tasks={selectedCell?.tasks || []}
      />
    </div>
  );
};
