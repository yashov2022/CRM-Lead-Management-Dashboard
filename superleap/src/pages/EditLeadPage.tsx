import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";

import {
  getLeadById,
  updateLead,
} from "../api/leads";

const leadSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required"),

  email: z
    .string()
    .email("Invalid email"),

   phone: z
  .string()
  .regex(
    /^\d{10}$/,
    "Phone number must be 10 digits"
  )
  .optional()
  .or(z.literal("")),

  source: z.string().optional(),
});

type LeadFormData =
  z.infer<typeof leadSchema>;

const inputStyles = `
  border
  border-gray-300
  p-3
  w-full
  rounded-lg
  focus:outline-none
  focus:ring-2
  focus:ring-blue-400
`;

const labelStyles = `
  block
  mb-2
  text-sm
  font-semibold
  text-gray-700
`;

const EditLeadPage = () => {

  const { id } = useParams();
  const leadId = Number(id);

  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const {
    data: lead,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lead", id],

    queryFn: () =>
      getLeadById(leadId),
  });

  const {
    register,
    handleSubmit,
    reset,

    formState: {
      errors,
      isValid,
    },

  } = useForm<LeadFormData>({
    resolver:
      zodResolver(leadSchema),

    mode: "onChange",
  });

  useEffect(() => {

    if (lead) {

      reset({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || "",
        source: lead.source || "",
      });
    }

  }, [lead, reset]);

  const mutation =
    useMutation({

      mutationFn: (
        data: LeadFormData
      ) =>
        updateLead(leadId, data),

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey: ["leads"],
        });

        navigate("/leads");
      },
    });

  const onSubmit = (
    data: LeadFormData
  ) => {

    mutation.mutate(data);
  };

  if (isLoading) {

    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (error) {

    return (
      <div className="p-6 text-red-500">
        Failed to load lead
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-50 p-6">

      <div
        className="
          max-w-2xl
          mx-auto
          bg-white
          shadow-md
          rounded-xl
          p-8
        "
      >

        <Link
          to="/leads"
          className="
            text-blue-500
            hover:underline
            inline-block
            mb-6
          "
        >
          ← Back to Leads
        </Link>

        <h1
          className="
            text-3xl
            font-bold
            mb-8
          "
        >
          Edit Lead
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* Name */}

          <div>

            <label
              className={labelStyles}
            >
              Name
            </label>

            <input
              type="text"

              placeholder="Enter name"

              {...register("name")}

              className={inputStyles}
            />

            {errors.name && (
              <p
                className="
                  text-red-500
                  text-sm
                  mt-2
                "
              >
                {errors.name.message}
              </p>
            )}

          </div>

          {/* Email */}

          <div>

            <label
              className={labelStyles}
            >
              Email
            </label>

            <input
              type="email"

              placeholder="Enter email"

              {...register("email")}

              className={inputStyles}
            />

            {errors.email && (
              <p
                className="
                  text-red-500
                  text-sm
                  mt-2
                "
              >
                {errors.email.message}
              </p>
            )}

          </div>

          {/* Phone */}

          <div>

            <label
              className={labelStyles}
            >
              Phone
            </label>

            <input
              type="text"

              placeholder="Enter phone"

              {...register("phone")}

              className={inputStyles}
            />

            {errors.phone && (
              <p
                className="
                  text-red-500
                  text-sm
                  mt-2
                "
              >
                {errors.phone.message}
              </p>
            )}

          </div>
          {/* Source */}

          <div>

            <label
              className={labelStyles}
            >
              Source
            </label>

            <input
              type="text"

              placeholder="Enter source"

              {...register("source")}

              className={inputStyles}
            />

          </div>

          {/* Submit Button */}

          <button
            type="submit"

            disabled={
              !isValid ||
              mutation.isPending
            }

            className="
              w-full
              bg-green-500
              hover:bg-green-600
              transition
              text-white
              py-3
              rounded-lg
              font-medium
              disabled:bg-gray-400
            "
          >
            {mutation.isPending
              ? "Updating..."
              : "Update Lead"}
          </button>

          {mutation.isError && (
            <p
              className="
                text-red-500
                text-sm
              "
            >
              Failed to update lead
            </p>
          )}

        </form>

      </div>

    </div>
  );
};

export default EditLeadPage;
