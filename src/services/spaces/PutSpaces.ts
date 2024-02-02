import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb'

export async function putSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  console.log('EVENT', event);

  //@ts-ignore
  const item = JSON.parse(event.body);
  const queryParams = event.queryStringParameters;

  if(queryParams && 'id' in queryParams && item) {
      const itemId = queryParams['id'];

      const itemKey = Object.keys(item)[0];
      const itemValue = item[itemKey];
      const result = await ddbClient.send(new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          //@ts-ignore
          'id': {
            S: itemId,
          }
        },
        UpdateExpression: 'set #zzzNew = :new',
        ExpressionAttributeValues: {
          ':new' : {
            S: itemValue,
          }
        },
        ExpressionAttributeNames: {
          '#zzzNew': itemKey,
        },
        ReturnValues: 'UPDATED_NEW',
      }));
      return {
        statusCode: 200,
        body: JSON.stringify({ attributes: result.Attributes }),
      }
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify('Bad request! Invalid parameter')
    }
  }
}