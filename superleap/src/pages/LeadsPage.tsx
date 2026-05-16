import {
  useState,
  useEffect,
} from "react";

import {
  Search,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Link } from "react-router-dom";

import {
  getLeads,
  deleteLead,
  updateLead,
} from "../api/leads";

import StatusBadge from "../components/StatusBadge";
import type { LeadStatus } from "../types/lead";

import {
  getAllowedTransitions,
  isFinalStatus,
} from "../utils/statusRules";

const LeadsPage = () => {

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [nameSort, setNameSort] =
    useState<"asc" | "desc">("asc");

  const [openMenuId, setOpenMenuId] =
    useState<number | null>(null);

  const queryClient =
    useQueryClient();

  useEffect(() => {

    const handleClickOutside =
      () => {

        setOpenMenuId(null);
      };

    window.addEventListener(
      "click",
      handleClickOutside
    );

    return () => {

      window.removeEventListener(
        "click",
        handleClickOutside
      );
    };

  }, []);

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leads"],
    queryFn: getLeads,
  });

  const deleteMutation =
    useMutation({
      mutationFn: deleteLead,

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey: ["leads"],
        });
      },
    });

  const statusMutation =
    useMutation({
      mutationFn: ({
        id,
        status,
      }: {
        id: number;
        status: LeadStatus;
      }) =>
        updateLead(id, { status }),

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey: ["leads"],
        });
      },
    });

  const handleDelete = (
    id: number
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this lead?"
      );

    if (!confirmed) return;

    deleteMutation.mutate(id);
  };

  const handleStatusChange = (
    id: number,
    status: LeadStatus
  ) => {

    statusMutation.mutate({
      id,
      status,
    });
  };

  const filteredLeads =
    data
      ?.filter((lead) => {

        const matchesSearch =
          lead.name
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||

          lead.email
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );

        const matchesStatus =
          statusFilter === "ALL" ||
          lead.status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      })

      .slice()

      .sort((a, b) => {

        return nameSort === "asc"

          ? a.name.localeCompare(
              b.name
            )

          : b.name.localeCompare(
              a.name
            );
      });

  if (isLoading) {

    return (
      <h1>Loading...</h1>
    );
  }

  if (error) {

    return (
      <h1>
        Something went wrong
      </h1>
    );
  }

  return (

  <div className="min-h-screen bg-gray-50 p-6">

    {/* Header */}

    <div
      className="
        flex
        justify-between
        items-center
        mb-6
      "
    >

      <h1
        className="
          text-4xl
          font-bold
          text-gray-800
        "
      >
        Leads
      </h1>

      <Link
        to="/leads/new"

        className="
          bg-blue-600
          hover:bg-blue-700
          transition
          text-white
          px-5
          py-2.5
          rounded-lg
          shadow-sm
        "
      >
        Create Lead
      </Link>

    </div>

    {/* Search + Filter */}

    <div
      className="
        flex
        flex-wrap
        gap-4
        items-center
        mb-6
      "
    >

      <div className="relative">

        <Search
          size={18}

          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
          type="text"

          placeholder="Search by name or email"

          value={searchTerm}

          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }

          className="
            border
            border-gray-300
            p-3
            pl-10
            rounded-lg
            w-80
            bg-white
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400
          "
        />

      </div>

      <select
        value={statusFilter}

        onChange={(e) =>
          setStatusFilter(
            e.target.value
          )
        }

        className="
          border
          border-gray-300
          p-3
          rounded-lg
          bg-white
          focus:outline-none
          focus:ring-2
          focus:ring-blue-400
        "
      >

        <option value="ALL">
          All Status
        </option>

        <option value="NEW">
          NEW
        </option>

        <option value="CONTACTED">
          CONTACTED
        </option>

        <option value="QUALIFIED">
          QUALIFIED
        </option>

        <option value="CONVERTED">
          CONVERTED
        </option>

        <option value="LOST">
          LOST
        </option>

      </select>

    </div>

    {/* Empty State */}

    {filteredLeads?.length === 0 ? (

      <div
        className="
          text-center
          py-16
          text-gray-500
          bg-white
          rounded-xl
          shadow-sm
        "
      >
        No leads found
      </div>

    ) : (

      <div
        className="
          overflow-x-auto
          rounded-xl
          border
          shadow-sm
          bg-white
        "
      >

        <table
          className="
            w-full
            border-collapse
          "
        >

          <thead
            className="
              sticky
              top-0
              bg-gray-100
              z-10
            "
          >

            <tr>

              <th
                className="
                  border-b
                  px-5
                  py-4
                  text-left
                  font-semibold
                  text-gray-700
                  cursor-pointer
                "

                onClick={() =>
                  setNameSort((prev) =>
                    prev === "asc"
                      ? "desc"
                      : "asc"
                  )
                }
              >
                Name{" "}

                {nameSort === "asc"
                  ? "▲"
                  : "▼"}
              </th>

              <th
                className="
                  border-b
                  px-5
                  py-4
                  text-left
                  font-semibold
                  text-gray-700
                "
              >
                Email
              </th>

              <th
                className="
                  border-b
                  px-5
                  py-4
                  text-left
                  font-semibold
                  text-gray-700
                "
              >
                Status
              </th>

              <th
                className="
                  border-b
                  px-5
                  py-4
                  text-left
                  font-semibold
                  text-gray-700
                "
              >
                Source
              </th>

              <th
                className="
                  border-b
                  px-5
                  py-4
                  text-left
                  font-semibold
                  text-gray-700
                "
              >
                Updated At
              </th>

              <th
                className="
                  border-b
                  px-5
                  py-4
                  text-left
                  font-semibold
                  text-gray-700
                "
              >
                Status Actions
              </th>

              <th
                className="
                  border-b
                  px-5
                  py-4
                  text-center
                  font-semibold
                  text-gray-700
                "
              >
                More
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredLeads?.map(
              (lead) => {

                const allowedStatuses =
                  getAllowedTransitions(
                    lead.status
                  );

                return (

                  <tr
                    key={lead.id}

                    className="
                      odd:bg-white
                      even:bg-gray-50
                      hover:bg-blue-50
                      transition
                    "
                  >

                    <td className="px-5 py-4 border-b">
                      {lead.name}
                    </td>

                    <td className="px-5 py-4 border-b">
                      {lead.email}
                    </td>

                    <td className="px-5 py-4 border-b">

                      <StatusBadge
                        status={lead.status}
                      />

                    </td>

                    <td className="px-5 py-4 border-b">
                      {lead.source}
                    </td>

                    <td className="px-5 py-4 border-b">

                      {new Date(
                        lead.updated_at
                      ).toLocaleString(
                        "en-IN",
                        {
                          dateStyle:
                            "medium",

                          timeStyle:
                            "short",
                        }
                      )}

                    </td>

                    {/* Status Actions */}

                    <td className="px-5 py-4 border-b">

                      {isFinalStatus(
                        lead.status
                      ) ? (

                        <span className="text-gray-500">
                          Final Status
                        </span>

                      ) : (

                        <div
                          className="
                            flex
                            gap-2
                            flex-wrap
                          "
                        >

                          {allowedStatuses.map(
                            (status) => (

                              <button
                                key={status}

                                onClick={() =>
                                  handleStatusChange(
                                    lead.id,
                                    status
                                  )
                                }

                                className="
                                  px-3
                                  py-1.5
                                  bg-emerald-500
                                  hover:bg-emerald-600
                                  transition
                                  text-white
                                  rounded-md
                                  text-sm
                                  font-medium
                                "
                              >
                                {status}
                              </button>
                            )
                          )}

                        </div>

                      )}

                    </td>

                    {/* More Dropdown */}

                    <td
                      className="
                        px-5
                        py-4
                        border-b
                        relative
                        text-center
                      "
                    >

                      <button
                        onClick={(e) => {

                          e.stopPropagation();

                          setOpenMenuId(
                            openMenuId ===
                              lead.id
                              ? null
                              : lead.id
                          );
                        }}

                        className="
                          p-2
                          rounded-full
                          hover:bg-gray-200
                          transition
                        "
                      >

                        <MoreVertical
                          size={18}
                        />

                      </button>

                      {openMenuId ===
                        lead.id && (

                        <div

                          onClick={(e) =>
                            e.stopPropagation()
                          }

                          className="
                            absolute
                            right-5
                            mt-2
                            w-36
                            bg-white
                            border
                            rounded-xl
                            shadow-lg
                            z-20
                            overflow-hidden
                          "
                        >

                          <Link
                            to={`/leads/${lead.id}/edit`}

                            className="
                              flex
                              items-center
                              gap-2
                              px-4
                              py-3
                              hover:bg-gray-100
                              transition
                            "
                          >

                            <Pencil
                              size={16}
                            />

                            Edit

                          </Link>

                          <button
                            onClick={() => {

                              handleDelete(
                                lead.id
                              );

                              setOpenMenuId(
                                null
                              );
                            }}

                            className="
                              flex
                              items-center
                              gap-2
                              px-4
                              py-3
                              w-full
                              text-left
                              hover:bg-red-50
                              transition
                              text-red-500
                            "
                          >

                            <Trash2
                              size={16}
                            />

                            Delete

                          </button>

                        </div>

                      )}

                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

      </div>

    )}

  </div>
);
};

export default LeadsPage;
