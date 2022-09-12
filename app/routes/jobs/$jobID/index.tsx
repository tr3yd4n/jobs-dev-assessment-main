import React from "react";
import { LoaderFunction } from "@remix-run/server-runtime";
import { requireUserId } from "~/session.server";
import { json } from "@remix-run/node";
import { getJob } from "~/models/job.server";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";

type LoaderData = {
  job: Awaited<ReturnType<typeof getJob>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.jobID, "noteId not found");
  const job = await getJob(params.jobID);
  return json<LoaderData>({ job });
};

export default function JobDetailPage(): JSX.Element {
  const data = useLoaderData<LoaderData>();
  const { company, user, ...job } = data.job;

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4">
      <div className="col-span-2 flex flex-col gap-4">
        <div className="card bg-base-300 px-6 py-4 shadow-xl">
          <h2 className="card-title text-3xl">{job.title}</h2>
          <p>at <a className="link link-secondary" href={`/company/${company.id}`}>{company.name}</a></p>
          <div className="mt-8 prose">
            <h3>Description</h3>
            <p>{job.description}</p>
            <h4>Location</h4>
            <p>{job.location}</p>
            <h4>Created</h4>
            <p>{new Date(job.createdAt).toDateString()}</p>
          </div>

        </div>

        <div className="card bg-base-300 px-4 py-4 shadow-xl">
          <a className="btn btn-secondary w-full" href={`/jobs/${job.id}/apply`}>Apply now</a>
        </div>
      </div>

      <div className="col-span-1 flex flex-col gap-4">
        <a href={`/company/${company.id}`} className="card bg-base-300  px-6 py-4 shadow-xl flex flex-row gap-4">
          <img className="w-16 h-16" src={company.logoUrl}/>
          <div>
            <h4>{company.name}</h4>
          </div>
        </a>

        <a href={`/user/${user.id}`} className="card bg-base-300  px-6 py-4 shadow-xl flex flex-row gap-4">
          <img className="w-16 h-16" src={`https://i.pravatar.cc/80?u=${user.email}`}/>
          <div>
            <p>Job added by</p>
            <h4>{user.email}</h4>
            <p className="text-xs">Joined {new Date(user.createdAt).toDateString()}</p>
          </div>
        </a>
      </div>
    </div>
  );
}
