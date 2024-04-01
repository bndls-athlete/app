"use client";

import { useState } from "react";
import { useForm, useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastProvider";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Select from "@/app/components/Select";
import Textarea from "@/app/components/Textarea";
import { jobTypeSchema, deliverableSchema } from "@/schemas/jobPostingSchema";
import Breadcrumb from "@/app/components/Breadcrumb";
import {
  faEdit,
  faLock,
  faPencilAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "@/app/components/Modal";
import { AthleteTierNames } from "@/helpers/stripeAthleteManager";
import { stateOptions } from "@/helpers/stateOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  validateNumber,
  validateNumberRequired,
} from "@/helpers/zodSchemaHelpers";
import { useBrandData } from "@/hooks/useBrandData";
import { BrandTierManager } from "@/helpers/stripeBrandManager";

type Deliverable = z.infer<typeof deliverableSchema>;

const createJobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  feeCompensation: validateNumberRequired,
  opportunityDescription: z
    .string()
    .min(1, "Opportunity Description is required"),
  deliverables: z.array(deliverableSchema),
  skillsRequired: z.array(z.string()).min(1, "At least one skill is required"),
  additionalPreferredSkills: z.array(z.string()).optional(),
  numberOfAthletes: validateNumber,
  jobType: jobTypeSchema,
  athleteTierTarget: z
    .array(z.enum(AthleteTierNames))
    .min(1, "Select at least one athlete tier target"),
});

type CreateJobFormValues = z.infer<typeof createJobSchema>;

const CreateJobPage = () => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDeliverableIndex, setCurrentDeliverableIndex] = useState<
    number | null
  >(null);
  const [skillRequired, setSkillRequired] = useState("");
  const [additionalPreferredSkill, setAdditionalPreferredSkill] = useState("");
  const [newDeliverable, setNewDeliverable] = useState<Deliverable>({
    title: "",
    duration: "",
    description: "",
  });
  const { brand } = useBrandData();
  const brandTierManager = BrandTierManager.getInstance();
  const hasActiveSubscription = brandTierManager.hasActiveSubscription(brand);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    getValues,
    trigger,
  } = useForm<CreateJobFormValues>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      skillsRequired: [],
      additionalPreferredSkills: [],
      deliverables: [],
      athleteTierTarget: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "deliverables",
  });

  const onSubmit = async (data: CreateJobFormValues) => {
    setIsLoading(true);
    try {
      await axios.post("/api/job", data);
      addToast("success", "Job created successfully!");
    } catch (error) {
      console.error("Error creating job:", error);
      addToast("error", "Failed to create job.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDeliverableClick = () => {
    setCurrentDeliverableIndex(null);
    setIsModalOpen(true);
  };

  // const handleModalClose = () => {
  //   setIsModalOpen(false);
  // };

  const handleModalConfirm = () => {
    const fieldErrors = [];
    if (!newDeliverable.title.trim()) {
      fieldErrors.push("Title");
    }
    if (!newDeliverable.duration.trim()) {
      fieldErrors.push("Duration");
    }
    if (!newDeliverable.description.trim()) {
      fieldErrors.push("Description");
    }

    if (fieldErrors.length > 0) {
      const errorMessage = `Please fill in the following field(s): ${fieldErrors.join(
        ", "
      )}`;
      addToast("error", errorMessage);
      return;
    }

    if (currentDeliverableIndex !== null) {
      update(currentDeliverableIndex, newDeliverable);
    } else {
      append(newDeliverable);
    }
    setNewDeliverable({ title: "", duration: "", description: "" });
    setCurrentDeliverableIndex(null); // Reset index
    setIsModalOpen(false);
  };

  const handleAddSkillRequired = async () => {
    if (!skillRequired.trim()) {
      addToast("error", "Skill cannot be empty");
      return;
    }
    setValue("skillsRequired", [...getValues("skillsRequired"), skillRequired]);
    setSkillRequired("");
    await trigger("skillsRequired");
  };

  const handleRemoveSkillRequired = async (index: number) => {
    const updatedSkills = getValues("skillsRequired").filter(
      (_, i) => i !== index
    );
    setValue("skillsRequired", updatedSkills);
    await trigger("skillsRequired");
  };

  const handleAddAdditionalPreferredSkill = async () => {
    if (!additionalPreferredSkill.trim()) {
      addToast("error", "Additional skill cannot be empty");
      return;
    }
    const currentSkills = getValues("additionalPreferredSkills") || [];
    setValue("additionalPreferredSkills", [
      ...currentSkills,
      additionalPreferredSkill,
    ]);
    setAdditionalPreferredSkill("");
    await trigger("additionalPreferredSkills");
  };

  const handleRemoveAdditionalPreferredSkill = async (index: number) => {
    const currentSkills = getValues("additionalPreferredSkills") || [];
    const updatedSkills = currentSkills.filter((_, i) => i !== index);
    setValue("additionalPreferredSkills", updatedSkills);
    await trigger("additionalPreferredSkills");
  };

  const getAccessRequirement = (tier: string) => {
    switch (tier) {
      case "TIER_1":
        return "Upgrade to Advanced tier to access Tier 1 athletes.";
      case "TIER_2":
        return "Upgrade to Performance or Advanced tier to access Tier 2 athletes.";
      case "TIER_3":
        return "Upgrade to Basic, Performance, or Advanced tier to access Tier 3 athletes.";
      default:
        return "";
    }
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setNewDeliverable({ title: "", duration: "", description: "" });
          setCurrentDeliverableIndex(null);
          setIsModalOpen(false);
        }}
        onConfirm={handleModalConfirm}
        title="Add Deliverable"
      >
        <div className="space-y-4">
          <Input
            value={newDeliverable.title}
            onChange={(e) =>
              setNewDeliverable({ ...newDeliverable, title: e.target.value })
            }
            placeholder="Title"
          />
          <p className="text-subtitle">
            E.g., Social Media Promotion, Event Appearances, Product Feedback
          </p>
          <Input
            value={newDeliverable.duration}
            onChange={(e) =>
              setNewDeliverable({ ...newDeliverable, duration: e.target.value })
            }
            placeholder="Duration"
          />
          <p className="text-subtitle">
            E.g., Throughout the contract period, At least 2 events per month,
            Monthly
          </p>
          <Textarea
            value={newDeliverable.description}
            onChange={(e) =>
              setNewDeliverable({
                ...newDeliverable,
                description: e.target.value,
              })
            }
            placeholder="Description"
          />
          <p className="text-subtitle">
            Briefly describe the deliverable. E.g., Post about products on
            social media, Attend sports events, Provide product feedback.
          </p>
        </div>
      </Modal>

      <Breadcrumb menu="Create Job Posting" icon={faPencilAlt} />
      <div className="my-6 text-dark">
        <h1 className="text-3xl font-semibold">Create Job Posting</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-3">
            <div className="flex justify-between border-b">
              <div className="py-3">
                <h6 className="font-semibold">Brand Information</h6>
                <span className="text-subtitle">
                  Provide information about the job you're posting.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Job Title</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <Input
                  {...register("title")}
                  placeholder="Enter job title"
                  error={errors.title?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Opportunity Description</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <Textarea
                  {...register("opportunityDescription")}
                  placeholder="Describe the opportunity"
                  rows={4}
                  error={errors.opportunityDescription?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Fee Compensation</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <Input
                  type="number"
                  {...register("feeCompensation")}
                  placeholder="Enter fee compensation (USD)"
                  error={errors.feeCompensation?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Deliverables</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8 space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex flex-col">
                    <div className="bg-gray-100 p-2 rounded flex flex-col">
                      <div>
                        <p>
                          <strong>Title:</strong> {field.title}
                        </p>
                        <p>
                          <strong>Duration:</strong> {field.duration}
                        </p>
                        <p>
                          <strong>Description:</strong> {field.description}
                        </p>
                      </div>
                      <div className="flex mt-2">
                        <button
                          type="button"
                          className="flex-1 p-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-l flex justify-center items-center"
                          onClick={() => {
                            setCurrentDeliverableIndex(index);
                            setIsModalOpen(true);
                            setNewDeliverable(field);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          type="button"
                          className="flex-1 p-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-r flex justify-center items-center"
                          onClick={() => {
                            remove(index);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddDeliverableClick}
                >
                  Add Deliverable
                </Button>
                <p className="text-subtitle mt-3">
                  Deliverables are specific outcomes or outputs that you are
                  expected to provide as part of your job. For example, social
                  media promotion, event appearances, and product feedback.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Skills Required</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <div className="flex items-center space-x-2">
                  <Input
                    value={skillRequired}
                    onChange={(e) => setSkillRequired(e.target.value)}
                    placeholder="Add a skill"
                  />
                  <Button type="button" onClick={handleAddSkillRequired}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getValues("skillsRequired")?.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 px-2 py-1 rounded"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        className="ml-2 text-gray-600"
                        onClick={() => handleRemoveSkillRequired(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                {errors.skillsRequired && (
                  <p className="text-red-500 mt-1">
                    {errors.skillsRequired.message}
                  </p>
                )}
                <p className="text-subtitle mt-3">
                  List the essential skills needed for this job. For example,
                  Social Media Savvy, Public Speaking, Networking.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Additional Preferred Skills</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <div className="flex items-center space-x-2">
                  <Input
                    value={additionalPreferredSkill}
                    onChange={(e) =>
                      setAdditionalPreferredSkill(e.target.value)
                    }
                    placeholder="Add a skill"
                  />
                  <Button
                    type="button"
                    onClick={handleAddAdditionalPreferredSkill}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getValues("additionalPreferredSkills")?.map(
                    (skill, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-200 px-2 py-1 rounded"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          className="ml-2 text-gray-600"
                          onClick={() =>
                            handleRemoveAdditionalPreferredSkill(index)
                          }
                        >
                          &times;
                        </button>
                      </div>
                    )
                  )}
                </div>
                {errors.additionalPreferredSkills && (
                  <p className="text-red-500 mt-1">
                    {errors.additionalPreferredSkills.message}
                  </p>
                )}
                <p className="text-subtitle mt-3">
                  List any additional skills that would be beneficial for this
                  job. For example, Photography, Content Creation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Job Type</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <Select {...register("jobType")}>
                  <option value="" disabled>
                    Select job type
                  </option>
                  {Object.values(jobTypeSchema.options).map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Number of Athletes</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <Input
                  type="number"
                  {...register("numberOfAthletes")}
                  placeholder="Enter number of athletes"
                  error={errors.numberOfAthletes?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Athlete Tier Target</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <div className="flex flex-col space-y-2">
                  {AthleteTierNames.map((tier) => (
                    <div key={tier} className="flex items-start">
                      <input
                        type="checkbox"
                        id={tier}
                        {...register("athleteTierTarget")}
                        value={tier}
                        className="checkbox mt-1 mr-2"
                        disabled={
                          !brandTierManager.checkBrandAccessToAthlete(brand, [
                            tier,
                          ])
                        }
                      />
                      <label htmlFor={tier} className="flex-1">
                        {tier}
                      </label>
                      {!brandTierManager.checkBrandAccessToAthlete(brand, [
                        tier,
                      ]) && (
                        <p className="text-xs text-gray-500 italic ml-2">
                          {getAccessRequirement(tier)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {errors.athleteTierTarget && (
                  <p className="text-red-500 mt-1">
                    {errors.athleteTierTarget.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Address</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8 space-y-3">
                <Input
                  {...register("city")}
                  error={errors.city?.message}
                  placeholder="Enter your city"
                />
                <Select {...register("state")} error={errors.state?.message}>
                  <option value="" disabled>
                    Select State
                  </option>
                  {stateOptions()}
                </Select>
              </div>
            </div>

            <div className="flex justify-end py-3">
              <Button
                type="submit"
                disabled={!hasActiveSubscription || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Processing...
                  </>
                ) : !hasActiveSubscription ? (
                  <>
                    <FontAwesomeIcon icon={faLock} className="mr-2" />
                    Access Restricted
                  </>
                ) : (
                  "Create Job"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateJobPage;
