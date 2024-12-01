import { CheckCircle2, Circle, HelpCircle } from "lucide-react";

interface StatusTrackerProps {
  status: string;
}

const StatusTracker = ({ status }: StatusTrackerProps) => {
  const stages = [
    { id: 'viewed', label: 'Viewed Profile' },
    { id: 'requested', label: 'Connection Requested' },
    { id: 'connected', label: 'Connection Made by DoorList' },
    { id: 'completed', label: 'Investment Complete' }
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'viewed':
        return 0;
      case 'requested':
        return 1;
      case 'connected':
        return 2;
      case 'completed':
        return 3;
      default:
        return 1; // Default to "requested" stage
    }
  };

  const currentStageIndex = getStageIndex(status);

  return (
    <div className="flex items-center justify-between w-full mt-4">
      {stages.map((stage, index) => (
        <div key={stage.id} className="flex flex-col items-center flex-1">
          {index > 0 && (
            <div className={`h-0.5 w-full -ml-2 ${index <= currentStageIndex ? 'bg-doorlist-salmon' : 'bg-gray-200'}`} />
          )}
          <div className="flex flex-col items-center">
            {index < currentStageIndex ? (
              <CheckCircle2 className="h-6 w-6 text-doorlist-salmon" />
            ) : index === currentStageIndex ? (
              index === 3 ? (
                <HelpCircle className="h-6 w-6 text-doorlist-salmon" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-doorlist-salmon" />
              )
            ) : (
              <Circle className="h-6 w-6 text-gray-300" />
            )}
            <span className="text-xs text-gray-600 text-center mt-1">{stage.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusTracker;