import { SNSEvent } from 'aws-lambda';

const webHookUrl = 'https://hooks.slack.com/services/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';

async function handler(event: SNSEvent, context: any) {
  for(const record of event.Records) {
    await fetch(webHookUrl, {
      method: 'POST',
      body: JSON.stringify({
        "text": `Houston, We have a problem ${record.Sns.Message}` 
      })
    })
  }
}

export { handler }