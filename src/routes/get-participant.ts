import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../lib/prisma";

export const getParticipant = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/participant/:participantId",
    {
      schema: {
        params: z.object({
          participantId: z.string().uuid(),
        }),
      },
    },
    async (req, reply) => {
      const { participantId } = req.params;

      const participant = await db.participant.findUnique({
        where: {
          id: participantId,
        },
      });

      if (!participant) throw new Error("participant not found");

      return reply.send({ participant });
    }
  );
};
