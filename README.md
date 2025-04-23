# Birthday Z

In our company we send out gift vouchers to our team members on their birthdays. This is a basic tool to automate that process.

It consists of a YAML config file where you define the recipients, mail settings and schedule; and a SQLite database where you keep the gift codes.

## Requirements

This script is developed and tested on Bun. Feel free to run it with Docker unless you have Bun installed.

A MailJet account is required for sending out e-mails. You also need to create a transactional e-mail template with MailJet and supply its ID in the configuration file.

You can use the following variables in the MJ template:

- firstname
- code
- vendorName
- vendorUrl

## Install

To install dependencies:

```bash
bun install
```

## Configuration

### Config file

Create a `birthdayz.yml` in the root folder and fill it like:

```YAML
# CRON expression, twice a day should be enough.
schedule: "* * * * *"
mail:
  from_name: BREW # Sender name
  from_email: info@brewww.com # Sender e-mail
  mj_template_id: 1111 # MJ template ID
  mj_api_key: 111abc # MJ API key
  mj_api_secret: 111abc # MJ API secret
  # BCC for each mail sent (optional)
  bcc:
    - gokcen@fastmail.com
team:
  - full_name: Foo Bar # Recipient name
    email: foo@bar.com # Recipient e-mail
    birthdate: 1980-12-31 # Date of birth
```

### SQLite

Migrate the database; this will create an empty DB for you in the `./db` folder so that you can type in your gift codes.

```bash
bun drizzle-kit migrate
```

## Running

### Run with Bun

After installing the packages, run the following command:

```bash
bun run src/index.ts send
```

### Run with Docker

Simply run the following command:

```bash
docker compose up -d
```

Then follow the logs with:

```bash
docker compose logs --follow
```
