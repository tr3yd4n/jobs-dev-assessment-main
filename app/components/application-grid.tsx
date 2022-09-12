import type { Application } from '@prisma/client';
import React from 'react';

export interface IApplicationGridProps {
  applications: Application[];
  title: string;
}

export default function ApplicationGrid(props: IApplicationGridProps) : JSX.Element {

  return (
    <React.Fragment>
      <h1 className="mt-16 mb-4 text-2xl">{props.title}</h1>
      <div className="grid grid-cols-3 gap-8">
        {props.applications.map((application) => (
          <div className="card bg-base-300 shadow-xl">
            <div className="card-body">
              <div className="flex flex-row items-center gap-4">
                <img
                  className="h-16 w-16"
                  src={application.job.company.logoUrl}
                  alt={application.job.company.name}
                />
                <div>
                  <h2 className="card-title">{application.job.title}</h2>
                  <p className="text-xs">{application.job.company.name}</p>
                </div>
              </div>
              {application.user !== undefined && (
                <div>
                  <p className="">{application.user.email}</p>
                </div>
              )}
              <p>Applied {new Date(application.createdAt).toDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  )
}