import { Stack, StackProps } from 'aws-cdk-lib'
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'
import { getStackSuffix } from '../Utils'

export class DataStack extends Stack {

  public readonly spacesTable: ITable;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const stackSuffix = getStackSuffix(this);

    this.spacesTable = new Table(this, 'SpacesTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      tableName: `SpaceStack-${stackSuffix}`,
    })
  }
}