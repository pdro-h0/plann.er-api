import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../lib/prisma";
import { dayjs } from "../../lib/dayjs";

export const updateTrip = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/trips/:tripId",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          destination: z.string().min(4),
          startsAt: z.coerce.date(),
          endsAt: z.coerce.date(),
        }),
      },
    },
    async (req, reply) => {
      const { tripId } = req.params;

      const { destination, endsAt, startsAt } = req.body;

      const trip = await db.trip.findUnique({
        where: {
          id: tripId,
        },
      });

      if (dayjs(startsAt).isBefore(new Date())) {
        throw new Error("Invalid trip start date!");
      }

      if (dayjs(endsAt).isBefore(startsAt)) {
        throw new Error("Invalid trip end date!");
      }

      if (!trip) throw new Error("Trip not found");

      const tripUpdated = await db.trip.update({
        where: {
          id: tripId,
        },
        data: {
          destination,
          startsAt,
          endsAt,
        },
      });
      return reply.send({ tripUpdated });
    }
  );
};
