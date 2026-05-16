import type { LeadStatus } from "../types/lead";

interface Props {
  status: LeadStatus;
}

const statusColors = {
  NEW: "bg-blue-100 text-blue-700",

  CONTACTED:
    "bg-yellow-100 text-yellow-700",

  QUALIFIED:
    "bg-purple-100 text-purple-700",

  CONVERTED:
    "bg-green-100 text-green-700",

  LOST: "bg-red-100 text-red-700",
};

const StatusBadge = ({
  status,
}: Props) => {
  return (
    <span
      className={`
        px-2
        py-1
        rounded
        text-sm
        font-medium
        ${statusColors[status]}
      `}
    >
      {status}
    </span>
  );
};

export default StatusBadge;