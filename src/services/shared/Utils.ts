import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { JsonError } from './Validator';
import { randomUUID } from 'crypto';

export function createRandomUUID() {
  return randomUUID();
}

export function jsonParse(arg: string) {
  try {
    return JSON.parse(arg);
  } catch (error) {
    //@ts-ignore
    throw new JsonError(error.message)
  }
}

export function hasAdminGroup(event: APIGatewayProxyEvent) {
  const groups = event.requestContext.authorizer?.claims['cognito:groups'];

  if(groups) {
    return (groups as string).includes('admins');
  }
  return false;
}

export function addCorsHeader(arg: APIGatewayProxyResult) {
  if(!arg.headers) {
    arg.headers = {};
  }
  arg.headers['Access-Control-Allow-Origin'] = '*';
  arg.headers['Access-Control-Allow-Methods'] = '*';
}