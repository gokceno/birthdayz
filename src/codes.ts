import { DateTime } from "luxon";
import { and, eq, notExists, isNull, between } from "drizzle-orm";
import { db, schema } from "./utils/db";

const pick = async (email: string): Promise<Code> => {
  const [result] = await db
    .select({
      code: schema.codes.code,
      vendorName: schema.codes.vendorName,
      vendorUrl: schema.codes.vendorUrl,
    })
    .from(schema.codes)
    .where(
      and(
        isNull(schema.codes.giftedTo),
        notExists(
          db
            .select()
            .from(schema.codes)
            .where(
              and(
                eq(schema.codes.giftedTo, email),
                between(
                  schema.codes.giftedAt,
                  DateTime.now().startOf("year").toJSDate(),
                  DateTime.now().endOf("year").toJSDate(),
                ),
              ),
            ),
        ),
      ),
    )
    .limit(1);
  return result;
};
const burn = async (code: string, email: string): Promise<void> => {
  await db
    .update(schema.codes)
    .set({
      giftedTo: email,
      giftedAt: DateTime.now().toJSDate(),
    })
    .where(eq(schema.codes.code, code));
};

type Code = {
  code: string;
  vendorName: string;
  vendorUrl: string;
};

export { pick, burn, type Code };
