import {
  type SendParams,
  type TeamMember,
  type Mail,
  type Template,
} from "../types";

const send = async ({
  mjApiKey,
  mjApiSecret,
  body,
}: SendParams): Promise<JSON> => {
  const fetchResult = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(
        `${mjApiKey}:${mjApiSecret}`,
      ).toString("base64")}`,
    },
    body,
  });
  if (!fetchResult.ok) {
    throw new Error(`HTTP error: ${fetchResult.status}`);
  }
  return fetchResult.json();
};

const createPayload = (
  mail: Mail,
  member: TeamMember,
  templateParams: Template,
): string => {
  return JSON.stringify({
    Messages: [
      {
        From: {
          Email: mail.fromEmail,
          Name: mail.fromName,
        },
        To: [
          {
            Email: member.email,
            Name: member.fullName,
          },
        ],
        Bcc: [...(mail.bcc ? mail.bcc.map((email) => ({ Email: email })) : [])],
        TemplateID: mail.mjTemplateId,
        TemplateLanguage: true,
        Subject: `İyi ki varsın ${templateParams.firstname}`,
        Data: {},
        Variables: templateParams,
      },
    ],
  });
};

export { createPayload, send };
