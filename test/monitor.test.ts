import { SNSEvent } from 'aws-lambda';
import { handler } from '../src/services/monitor/handler';

export interface SNSEventRecord {
  EventVersion: string;
  EventSubscriptionArn: string;
  EventSource: string;
  Sns: SNSMessage;
}

export interface SNSMessage {
  SignatureVersion: string;
  Timestamp: string;
  Signature: string;
  SigningCertUrl: string;
  MessageId: string;
  Message: string;
  MessageAttributes: {
    [name: string] : {
      Type: string, Value: string
    }
  };
  Type: string;
  UnsubscribeUrl: string;
  TopicArn: string;
};

const testVariable: SNSEventRecord = {
  EventSource: 'testEventSource',
  EventSubscriptionArn: 'testEventSubscriptionArn',
  EventVersion: 'testEventVersion',
  Sns: {
    SignatureVersion: 'testSignatureVersion',
    Timestamp: 'testTimestamp',
    Signature: 'testSignature',
    SigningCertUrl: 'testSigningCertUrl',
    MessageId: 'testMessageId',
    Message: 'THERE ARE SOME PROBLEMS',
    MessageAttributes: {
      'test' : {
        Type: '1',
        Value: '2'
      }
    },
    Type: '1',
    UnsubscribeUrl: 'lorem',
    TopicArn: 'testTopicArn',
  }
}

const snsRecords: SNSEvent = {
  Records: [testVariable]
}


handler(snsRecords, {})