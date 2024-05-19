import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import { ses } from "./client";

type SendEmailType = {
  FromEmailAddress: string;
  Destination: {
    BccAddresses: Array<string>;
    CcAddresses: Array<string>;
    ToAddresses: Array<string>;
  };
  Simple: {
    Subject: {
      Data: string;
    };
    Body: {
      Html: {
        Data: string;
      };
      Text: {
        Data: string;
      };
    };
  };
};

export async function sendEmail(email: SendEmailType) {
  const input = {
    FromEmailAddress: email.FromEmailAddress,
    Destination: {
      BccAddresses: email.Destination.BccAddresses,
      CcAddresses: email.Destination.CcAddresses,
      ToAddresses: email.Destination.ToAddresses,
    },
    Content: {
      Simple: {
        Subject: {
          Data: email.Simple.Subject.Data,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: email.Simple.Body.Html.Data,
            Charset: "UTF-8",
          },
          Text: {
            Data: email.Simple.Body.Text.Data,
            Charset: "UTF-8",
          },
        },
      },
    },
  };

  await ses.send(new SendEmailCommand(input));
}
