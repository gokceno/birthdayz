import { command, string } from "@drizzle-team/brocli";
import { yaml as config, type Config, type TeamMember } from "../config";
import { logger } from "../logger";
import { DateTime } from "luxon";

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
    birthdays.map(async (member) => {
      logger.info(`Found ${member.fullName}`);
      const templateParams: Template = {
        firstname: member.fullName.split(" ")[0],
        code: "1234567890",
        vendorName: "Boyner",
        vendorUrl: "http://www.boyner.com.tr",
      };
      try {
        const body: string = JSON.stringify({
          Messages: [
            {
              From: {
                Email: env.mail.fromEmail,
                Name: env.mail.fromName,
              },
              To: [
                {
                  Email: member.email,
                  Name: member.fullName,
                },
              ],
              TemplateID: env.mail.mjTemplateId,
              TemplateLanguage: true,
              Subject: `İyi ki varsın ${templateParams.firstname}`,
              Data: {},
              Variables: templateParams,
            },
          ],
        });
        logger.debug(body);
        const fetchResult = await fetch("https://api.mailjet.com/v3.1/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(
              `${env.mail.mjApiKey}:${env.mail.mjApiSecret}`,
            ).toString("base64")}`,
          },
          body,
        });
        if (!fetchResult.ok) {
          throw new Error(`HTTP error: ${fetchResult.status}`);
        }
        const data = await fetchResult.json();
        logger.info(`Message sent to ${member.email}`);
        logger.debug(JSON.stringify(data));
      } catch (e: any) {
        logger.error(e.message);
      }
    });
  },
});

type Template = {
  firstname: string;
  code: string;
  vendorName: string;
  vendorUrl: string;
};

export default send;
