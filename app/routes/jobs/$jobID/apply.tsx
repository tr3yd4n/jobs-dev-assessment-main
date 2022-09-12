import React from "react";
import { LoaderFunction } from "@remix-run/server-runtime";
import { requireUserId } from "~/session.server";
import { ActionArgs, json, redirect } from '@remix-run/node';
import { getJob } from "~/models/job.server";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import { createApplication } from '~/models/application.server';

type LoaderData = {
  job: Awaited<ReturnType<typeof getJob>>;
  success?: string | null;
};

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.jobID, "jobID not found");
  await createApplication(params.jobID, userId);
  return redirect(`/jobs/${params.jobID}/apply?success=true`);
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.jobID, "noteId not found")
  const job = await getJob(params.jobID);

  const url = new URL(request.url);
  const success = url.searchParams.get("success");

  return json<LoaderData>({ job, success });
};

export default function JobDetailPage(): JSX.Element {
  const data = useLoaderData<LoaderData>();
  const { company, user, ...job } = data.job;

  return (
    <div className="mx-auto flex flex-col max-w-6xl gap-8">
      <div className="card bg-base-300 px-6 py-4 shadow-xl">
        <h2 className="card-title text-3xl">{job.title}</h2>
        <p>at <a className="link link-secondary" href={`/company/${company.id}`}>{company.name}</a></p>
      </div>

      <div className="card bg-base-300 px-6 py-4 shadow-xl">
        <h2 className="card-title">Application</h2>
        <p>Your current CV and contact details will become available to the given hiring manager at the company you are applying to.</p>
        {data.success === 'true' && (
          <div className="alert alert-success mt-8 shadow-lg">
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
              <span>Success!</span>
            </div>
          </div>
        )}
        {data.success !== 'true' && (
          <form method="post" className="space-y-6">
            <button className="btn btn-primary mt-8 w-full" type="submit">Submit application</button>
          </form>
        )}

      </div>
    </div>
  );
}
