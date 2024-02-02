import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb';

import { validateAsSpaceEntry } from '../shared/Validator';
import { createRandomUUID, jsonParse } from '../shared/Utils';


export async function postSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  console.log('EVENT', event);
  const randomUUID = createRandomUUID();
  //@ts-ignore
  const item = jsonParse(event.body);
  item.id = randomUUID;

  validateAsSpaceEntry(item);

  const result = await ddbClient.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: marshall(item),
  }));

  console.log('RESULT', result);

  return {
    statusCode: 201,
    body: JSON.stringify({ id: randomUUID }),
  }
}