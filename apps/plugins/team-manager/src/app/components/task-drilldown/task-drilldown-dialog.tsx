import { DailyTask } from '@team-forge/shared/data-access';

interface TaskDrilldownDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  userName: string;
  tasks: DailyTask[];
}

export const TaskDrilldownDialog = ({
  isOpen,
  onClose,
  date,
  userName,
  tasks,
}: TaskDrilldownDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        {/* Modal Container */}
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">
                    Tasks for {date}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Assignee: {userName}
                </p>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-96">
                {tasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No tasks found.</p>
                ) : (
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                            >
                                {/* Top Row */}
                                <div className="flex justify-between items-start">
                                    <span className="font-medium text-gray-900 leading-tight">
                                        {task.title}
                                    </span>
                                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded whitespace-nowrap">
                                        {task.project.name}
                                    </span>
                                </div>

                                {/* Bottom Row */}
                                <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                                    <span
                                        className={`font-semibold ${
                                            task.status === 'DONE'
                                                ? 'text-green-600'
                                                : task.status === 'IN_PROGRESS'
                                                ? 'text-blue-600'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        {task.status}
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        {task.estimatedHours}h
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200 rounded-b-lg">
                <button
                    onClick={onClose}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                    Close
                </button>
            </div>
      </div>
    </div>
  );
};
