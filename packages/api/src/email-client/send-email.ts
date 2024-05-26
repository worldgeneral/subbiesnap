import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import { NO_REPLY_EMAIL } from "../constants/emails";
import { ses } from "./client";

type SendEmailType = {
  FromEmailAddress?: string;
  Bcc?: Array<string>;
  Cc?: Array<string>;
  To: Array<string>;
  Subject: string;
  Body: {
    Html: string;
    Text: string;
  };
};

export async function sendEmail(email: SendEmailType) {
  const input = {
    FromEmailAddress: email.FromEmailAddress ?? NO_REPLY_EMAIL,
    Destination: {
      BccAddresses: email.Bcc,
      CcAddresses: email.Cc,
      ToAddresses: email.To,
    },
    Content: {
      Simple: {
        Subject: {
          Data: email.Subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: email.Body.Html,
            Charset: "UTF-8",
          },
          Text: {
            Data: email.Body.Text,
            Charset: "UTF-8",
          },
        },
      },
    },
  };

  await ses.send(new SendEmailCommand(input));
}
