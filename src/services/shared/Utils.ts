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