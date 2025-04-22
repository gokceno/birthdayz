import { command, string } from "@drizzle-team/brocli";
import { yaml as config } from "../utils/config";
import { logger } from "../utils/logger";
import { DateTime } from "luxon";
import { pick, burn } from "../codes";
import { createPayload, send as mjSend } from "../utils/mailjet";
import {
  type Template,
  type Config,
  type TeamMember,
  type Code,
} from "../types";

const send = command({
  name: "send",
  options: {
    "config-file": string()
      .desc("Path to config file")
      .default("./birthdayz.yml")
      .required(),
  },
  handler: async (opts) => {
    const env: Config = config(opts["config-file"]);
    logger.debug(`Fetched ${env.team.length} record(s).`);
    const now = DateTime.local();
    const birthdays: TeamMember[] = env.team.filter(
      ({ birthdate }: TeamMember) => {
        return (
          now.toFormat("MM-dd") ===
          DateTime.fromISO(birthdate).toFormat("MM-dd")
        );
      },
    );
    logger.info(
      `Found ${birthdays.length} birthday(s) for ${now.toFormat("MM-dd")}.`,
    );
    for (const member of birthdays) {
      logger.info(`Found ${member.fullName}`);
      const pickedTemplateParts: Code = await pick(member.email);
      if (!pickedTemplateParts) {
        logger.warn(
          `Sending for ${member.email} failed. Either ran out of codes or already sent this year.`,
        );
        continue;
      }
      const templateParams: Template = {
        firstname: member.fullName.split(" ")[0],
        ...pickedTemplateParts,
      };
      logger.debug(JSON.stringify(templateParams));
      try {
        const body: string = createPayload(env.mail, member, templateParams);
        const mjResponse = await mjSend({
          ...env.mail,
          body,
        });
        logger.debug(body);
        logger.debug(JSON.stringify(mjResponse));
        logger.info(`Message sent to ${member.email}`);
      } catch (e: any) {
        logger.error(e.message);
      }
      await burn(pickedTemplateParts.code, member.email);
    }
  },
});

export default send;
