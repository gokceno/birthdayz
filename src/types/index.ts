export type SendParams = {
  mjApiKey: string;
  mjApiSecret: string;
  body: string;
};

export type TeamMember = {
  fullName: string;
  birthdate: string;
  email: string;
};

export type Mail = {
  fromName: string;
  fromEmail: string;
  mjTemplateId: number;
  mjApiKey: string;
  mjApiSecret: string;
};

export type Config = {
  mail: Mail;
  team: TeamMember[];
};

export type Template = {
  firstname: string;
  code: string;
  vendorName: string;
  vendorUrl: string;
};

export type Code = {
  code: string;
  vendorName: string;
  vendorUrl: string;
};
