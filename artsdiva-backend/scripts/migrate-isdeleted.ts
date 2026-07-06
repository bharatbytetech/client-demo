/**
 * One-time migration: set isDeleted=false on every existing Artist/Artwork/Client/User
 * document that doesn't already have the field. Run after prisma db push when
 * deploying the deletedAt → isDeleted schema change.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [artists, artworks, clients, users] = await Promise.all([
    // @ts-expect-error – updateMany with a missing-field filter via raw MongoDB
    prisma.artist.updateMany({ where: { isDeleted: { isSet: false } }, data: { isDeleted: false } }),
    // @ts-expect-error
    prisma.artwork.updateMany({ where: { isDeleted: { isSet: false } }, data: { isDeleted: false } }),
    // @ts-expect-error
    prisma.client.updateMany({ where: { isDeleted: { isSet: false } }, data: { isDeleted: false } }),
    // @ts-expect-error
    prisma.user.updateMany({ where: { isDeleted: { isSet: false } }, data: { isDeleted: false } }),
  ]);

  console.log(`Migrated: ${artists.count} artists, ${artworks.count} artworks, ${clients.count} clients, ${users.count} users`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => void prisma.$disconnect());
