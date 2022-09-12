import { getApplicationsForJobCreatedByUser, getApplicationsForUser } from '~/models/application.server';
import { requireUserId } from "~/session.server";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import ApplicationGrid from '~/components/application-grid';

export const loader = async ({ request }) => {
  const userId = await requireUserId(request);
  return {
    myApplications: await getApplicationsForUser(userId),
    incomingApplications: await getApplicationsForJobCreatedByUser(userId),
  };
};

export default function ApplicationsPage() {
  const { myApplications, incomingApplications } = useLoaderData();
  return (
    <main className="mx-auto max-w-7xl">
      <ApplicationGrid title="Your Applications" applications={myApplications}/>
      <ApplicationGrid title="Applications to jobs you created" applications={incomingApplications}/>
    </main>
  );
}
