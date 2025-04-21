import { DateTime } from "luxon";
import { and, eq, not, exists, gte, lte, isNull } from "drizzle-orm";
import { db, schema } from "./db";

const pick = async (email: string): Code => {
  const currentYear = DateTime.now().year;
  const yearStart = DateTime.local(currentYear, 1, 1).startOf("day").toJSDate();
  const yearEnd = DateTime.local(currentYear, 12, 31).endOf("day").toJSDate();

  const result = await db
    .select()
    .from(schema.codes)
    .where(
      and(
        isNull(schema.codes.giftedTo),
        not(
          exists(
            db
              .select()
              .from(schema.codes)
              .where(
                and(
                  eq(schema.codes.giftedTo, email),
                  and(
                    gte(schema.codes.giftedAt, yearStart),
                    lte(schema.codes.giftedAt, yearEnd),
                  ),
                ),
              ),
          ),
        ),
      ),
    )
    .limit(1)
    .get();
};
const burn = async (code: Code) => {};

type Code = {
  code: string;
  vendorName: string;
  vendorUrl: string;
};

export { pick, burn, type Code };
