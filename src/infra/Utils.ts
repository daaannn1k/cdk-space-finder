import { Stack, Fn } from 'aws-cdk-lib';

export const getStackSuffix = (stack: Stack) => {
  const shortStackId = Fn.select(2, Fn.split('/', stack.stackId));
  const stackSuffix = Fn.select(4, Fn.split('-', shortStackId));
  return stackSuffix;
}