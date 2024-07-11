import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../lib/prisma";
import { ClientError } from "../errors/client-error";
import { env } from "../env";

export const confirmParticipant = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/participants/:participantId/confirm",
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

      if (!participant) throw new ClientError("participant not found");

      if (participant.isConfirmed) {
        reply.redirect(`${env.WEB_BASE_URL}/trips/${participant.tripId}`);
      }

      await db.participant.update({
        where: {
          id: participantId,
        },
        data: {
          isConfirmed: true,
        },
      });

      return reply.redirect(`${env.WEB_BASE_URL}/trips/${participant.tripId}`);
    }
  );
};
