import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createLead } from "../api/leads";
import { Link } from "react-router-dom";

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),

  email: z
    .string()
    .email("Invalid email"),

  countryCode: z.string().min(1, "Country code is required"),

  phone: z
    .string()
    .regex(
      /^[0-9]{10}$/,
      "Phone must be 10 digits"
    )
    .optional()
    .or(z.literal("")),

  source: z.string().optional(),
});

type LeadFormData =
  z.infer<typeof leadSchema>;

const CreateLeadPage = () => {

  const queryClient =
    useQueryClient();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid,
    },
  } = useForm<LeadFormData>({
    resolver:
      zodResolver(leadSchema),

    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: createLead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
    },
  });

  const onSubmit = (
    data: LeadFormData
  ) => {

    mutation.mutate({
      ...data,
      status: "NEW",
    });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Create Lead
      </h1>
       <Link
  to="/leads"
  className="text-blue-520"
>
  ← Back to Leads
</Link>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >

        <div>
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="
              border
              p-3
              w-full
              rounded
            "
          />

          {errors.name && (
            <p className="text-red-500 mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="
              border
              p-3
              w-full
              rounded
            "
          />

          {errors.email && (
            <p className="text-red-500 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <select
            {...register("countryCode")}
            className="
              border
              p-3
              w-full
              rounded
            "
          >
            <option value="">Select Country Code</option>
            <option value="+1">+1 (USA/Canada)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+91">+91 (India)</option>
            <option value="+61">+61 (Australia)</option>
            <option value="+86">+86 (China)</option>
            <option value="+81">+81 (Japan)</option>
            <option value="+49">+49 (Germany)</option>
            <option value="+33">+33 (France)</option>
            <option value="+39">+39 (Italy)</option>
            <option value="+34">+34 (Spain)</option>
            <option value="+31">+31 (Netherlands)</option>
            <option value="+55">+55 (Brazil)</option>
            <option value="+27">+27 (South Africa)</option>
          </select>

          {errors.countryCode && (
            <p className="text-red-500 mt-1">
              {errors.countryCode.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Phone"
            {...register("phone")}
            className="
              border
              p-3
              w-full
              rounded
            "
          />

          {errors.phone && (
            <p className="text-red-500 mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Source"
            {...register("source")}
            className="
              border
              p-3
              w-full
              rounded
            "
          />
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="
            bg-blue-500
            text-white
            px-4
            py-2
            rounded
            disabled:bg-gray-400
          "
        >
          {mutation.isPending
            ? "Creating..."
            : "Create Lead"}
        </button>

        {mutation.isError && (
          <p className="text-red-500">
            Failed to create lead
          </p>
        )}

        {mutation.isSuccess && (
          <p className="text-green-600">
            Lead created successfully
          </p>
        )}

      </form>
    </div>
  );
};

export default CreateLeadPage;