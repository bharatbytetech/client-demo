import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateCollection(collection: string) {
  const result = await prisma.$runCommandRaw({
    update: collection,
    updates: [
      {
        q: { isDeleted: { $exists: false } },
        u: { $set: { isDeleted: false } },
        multi: true,
      },
    ],
  });

  console.log(`${collection}:`, result);

  return result;
}

async function main() {
  await Promise.all([
    updateCollection("Artist"),
    updateCollection("Artwork"),
    updateCollection("Client"),
    updateCollection("User"),
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
