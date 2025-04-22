import { DateTime } from "luxon";
import { and, eq, notExists, isNull, between } from "drizzle-orm";
import { db, schema } from "./utils/db";
import { type Code } from "types";

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

export { pick, burn };
