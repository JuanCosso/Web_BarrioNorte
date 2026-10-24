import { prisma } from "./prisma.js";
import { AVAILABLE_NUMBER_GROUPS } from "./bonoData.js";

export async function ensureBonoNumberGroups() {
  await prisma.bonoNumberGroup.createMany({
    data: AVAILABLE_NUMBER_GROUPS.map((group) => ({
      id: group.id,
      numbers: group.numbers,
      sold: Boolean(group.vendido),
      hidden: Boolean(group.ocultar),
    })),
    skipDuplicates: true,
  });
}

export async function getBonoNumberGroups() {
  await ensureBonoNumberGroups();
  return prisma.bonoNumberGroup.findMany({ orderBy: { id: "asc" } });
}
