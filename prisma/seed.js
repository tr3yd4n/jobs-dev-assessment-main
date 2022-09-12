const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function seed() {
  const emails = ["rachel@remix.run", ...(faker.helpers.uniqueArray(faker.internet.email, 9))];
  const hashedPassword = await bcrypt.hash("password", 10);

  // cleanup the existing database
  await prisma.user.delete({ where: { email: emails } }).catch(() => {
    // no worries if it doesn't exist yet
  });


  const users = await Promise.all(emails.map(email => prisma.user.create({
    data: {
      email, password: {
        create: {
          hash: hashedPassword
        }
      },
    }
  })));

  const companies = [];
  for(let i = 0; i < 10; i++){
    const c = await prisma.company.create({
      data: {
        name: faker.company.companyName(),
        logoUrl: faker.image.business(90,90, true),
        users: {
          connect: [{ id: users[i].id }]
        }
      }
    });
    companies.push(c)
  }

  for (let i = 0; i < 1000; i++) {
    await prisma.job.create({
      data: {
        title: faker.name.jobTitle(),
        description: faker.commerce.productDescription(),
        location: faker.address.city(),
        contractType: faker.helpers.arrayElement(["Full-time", "Part-time"]),
        contractLength: faker.helpers.arrayElement(["Permanent", "12 Months", "6 Months", "3 Months"]),
        companyId: faker.helpers.arrayElement(companies).id,
        userId: faker.helpers.arrayElement(users).id,
      }
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
