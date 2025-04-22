import { command, string } from "@drizzle-team/brocli";
import { yaml as config, type Config, type TeamMember } from "../config";
import { logger } from "../logger";
import { DateTime } from "luxon";
import { pick, burn, type Code } from "../codes";
import { createPayload, send as mjSend } from "../mailjet";

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
      ({ birthdate }: { birthdate: string }) => {
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

type Template = {
  firstname: string;
  code: string;
  vendorName: string;
  vendorUrl: string;
};

export default send;
