const send = async ({
  mjApiKey,
  mjApiSecret,
  body,
}: SendParams): Promise<object> => {
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

const createPayload = (mail: any, member: any, templateParams: any): string => {
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
        /*
        Bcc: [
          {
            Email: env.mail.fromEmail,
            Name: env.mail.fromName,
          },
        ],
        */
        TemplateID: mail.mjTemplateId,
        TemplateLanguage: true,
        Subject: `İyi ki varsın ${templateParams.firstname}`,
        Data: {},
        Variables: templateParams,
      },
    ],
  });
};

type SendParams = {
  mjApiKey: string;
  mjApiSecret: string;
  body: string;
};

export { createPayload, send };
