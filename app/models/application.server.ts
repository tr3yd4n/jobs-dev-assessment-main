import { prisma } from '~/db.server';

export async function getApplicationsForUser(userId: string){
  return prisma.application.findMany({
    where: {
      userId,
    },
    include: {
      job: {
        include: {
          company: true,
        }
      }
    }
  })
}

export async function getApplicationsForJobCreatedByUser(userId: string) {
  return prisma.application.findMany({
    where: {
      job: {
        userId
      },
    },
    include: {
      job: {
        include: {
          company: true,
        }
      },
      user: true,
    }
  })
}

export async function createApplication(jobID: string, userID: string) {
  return prisma.application.create({
    data: {
      user: {
        connect: {
          id: userID,
        },
      },
      job: {
        connect: {
          id: jobID,
        },
      },
    },
  });
}