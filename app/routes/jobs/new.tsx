import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";

import { requireUserId } from "~/session.server";
import { createJob } from "~/models/job.server";
import { getCompaniesWithUserId } from "~/models/company.server";
import type { LoaderFunction } from "@remix-run/server-runtime";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const companyId = formData.get("company");
  const description = formData.get("description");
  const contractType = formData.get("contractType");
  const contractLength = formData.get("contractLength");
  const location = formData.get("location");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required", description: null } },
      { status: 400 }
    );
  }

  if (typeof description !== "string" || description.length === 0) {
    return json(
      { errors: { title: null, description: "Description is required" } },
      { status: 400 }
    );
  }

  if (typeof contractType !== "string" || contractType.length === 0) {
    return json(
      { errors: { contractType: "Contract type is required" } },
      { status: 400 }
    );
  }

  if (typeof companyId !== "string" || companyId.length === 0) {
    return json(
      { errors: { companyId: "Company is required" } },
      { status: 400 }
    );
  }

  if (typeof contractLength !== "string" || contractLength.length === 0) {
    return json(
      { errors: { contractLength: "Contract length is required" } },
      { status: 400 }
    );
  }

  if (typeof location !== "string" || location.length === 0) {
    return json(
      { errors: { Location: "Location is required" } },
      { status: 400 }
    );
  }

  const job = await createJob({
    title,
    description,
    userId,
    companyId,
    contractType,
    contractLength,
    location,
  });

  return redirect(`/jobs/${job.id}`);
}

type LoaderData = {
  companies: Awaited<ReturnType<typeof getCompaniesWithUserId>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const companies = await getCompaniesWithUserId(userId);
  return json<LoaderData>({ companies });
};

export default function NewJobPage() {
  const data = useLoaderData<LoaderData>();

  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const locationRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.description) {
      descriptionRef.current?.focus();
    }
    if (actionData?.errors?.location) {
      locationRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <section className="card mx-auto w-full max-w-2xl bg-base-300 px-6 py-4 shadow-xl">
        <h2 className="text-center text-3xl font-semibold">
          Advertise your job
        </h2>

        {actionData?.errors !== undefined && (
          <div className="alert alert-warning mt-8 shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 flex-shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{JSON.stringify(actionData?.errors, undefined, 2)}</span>
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="form-control w-full">
            <label className="label">
              Which company are you advertising for?
            </label>
            <select name="company" className="select select-bordered">
              <option disabled selected>
                Pick one
              </option>
              {data.companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div className="divider" />
          <div className="form-control">
            <label className="label">Job Title</label>
            <input
              ref={titleRef}
              name="title"
              type="text"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">Description</label>
            <textarea
              ref={descriptionRef}
              name="description"
              className="input input-bordered h-40 w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">Location</label>
            <input
              name="location"
              type="text"
              ref={locationRef}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">Contract Type</label>
            <select name="contractType" className="select select-bordered">
              <option disabled selected>
                Pick one
              </option>
              <option>Full-time</option>
              <option>Part-time</option>
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label">Contract Length</label>
            <select name="contractLength" className="select select-bordered">
              <option disabled selected>
                Pick one
              </option>
              <option>Permanent</option>
              <option>12 Months</option>
              <option>6 Months</option>
              <option>3 Months</option>
            </select>
          </div>

          <div className="mt-6 flex justify-center">
            <button type="submit" className="btn btn-primary w-full">
              Create
            </button>
          </div>
        </div>
      </section>
    </Form>
  );
}
