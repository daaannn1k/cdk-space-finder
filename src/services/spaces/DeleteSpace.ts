import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { hasAdminGroup } from '../shared/Utils';

export async function deleteSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  console.log('EVENT', event);

  if(!hasAdminGroup(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify(`Not authorized`),
    }
  }

  if(event.queryStringParameters){
    if('id' in event.queryStringParameters) {
      const spaceId = event.queryStringParameters['id'];
      const result = await ddbClient.send(new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          // @ts-ignore
          'id': {
            S: spaceId
          }
        }
      }))

      return {
        statusCode: 200,
        body: JSON.stringify(`Item ${result.Attributes} with id ${spaceId}, was successfully deleted!`),
      }
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify(`Space with such id not found`),
        }
      }
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify('Bad request! Invalid parameter')
    }
  }
}