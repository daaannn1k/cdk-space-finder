import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { v4 } from 'uuid';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';


export async function postSpacesWithDoc(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

  console.log('EVENT', event);
  const randomUUID = v4();
  //@ts-ignore
  const item = JSON.parse(event.body);
  item.id = randomUUID;

  const result = await ddbDocClient.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: item,
  }));

  console.log('RESULT', result);

  return {
    statusCode: 201,
    body: JSON.stringify({ id: randomUUID }),
  }
}