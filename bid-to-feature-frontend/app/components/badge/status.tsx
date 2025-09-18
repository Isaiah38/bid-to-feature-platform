export const StatusBadgeInternal = ({ status }: { status: string }) => {
  const getColorClass = (status: string): string => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-slate-100 text-slate-600";
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Ongoing":
        return "bg-green-100 text-green-800";
      case "Active":
        return "bg-yellow-100 text-yellow-600";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "new":
        return "bg-blue-100 text-blue-800";
      case "read":
        return "bg-yellow-100 text-yellow-800";
      case "replied":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const colorClass = getColorClass(status);

  return (
    <span
      className={`px-2 h-max inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}
    >
      {status}
    </span>
  );
};

export const StatusBadge = ({ status }: { status: string }) => {
  return (
    <>
      <StatusBadgeInternal status={status} />
    </>
  );
};
