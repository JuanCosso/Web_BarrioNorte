import { prisma } from "./lib/prisma.js";

async function swapRoundNumbers() {
  await prisma.match.update({
    where: { id: "cmu69n05h0000bgndx5u59m6q" },
    data: { roundNumber: 2, roundName: "Semifinal 2" }
  });
  await prisma.match.update({
    where: { id: "cmu69n0780001bgndo6hu0tbe" },
    data: { roundNumber: 1, roundName: "Semifinal 1" }
  });
  console.log("Round numbers swapped.");
}

swapRoundNumbers().catch(console.error);
