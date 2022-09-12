import type { User, Job, Company } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Job } from "@prisma/client";

export function getJob(id: string) {
  return prisma.job.findFirst({
    include: {
      company: true,
      user: true
    },
    where: { id },
  });
}

export function getJobListItems() {
  return prisma.job.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      location: true,
      contractType: true,
      contractLength: true,
      user: true,
      company: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function createJob({
  description,
  title,
  userId,
  companyId,
  location,
  contractType,
  contractLength,
}: Pick<Job, "description" | "title" | "location" | "contractLength" | "contractType"> & {
  userId: User["id"];
  companyId: Company["id"];
}) {
  return prisma.job.create({
    data: {
      title,
      description,
      location,
      contractType,
      contractLength,
      user: {
        connect: {
          id: userId,
        },
      },
      company: {
        connect: {
          id: companyId,
        },
      },
    },
  });
}

export function deleteJob({
  id,
  userId,
}: Pick<Job, "id"> & { userId: User["id"] }) {
  return prisma.job.deleteMany({
    where: { id, userId },
  });
}
