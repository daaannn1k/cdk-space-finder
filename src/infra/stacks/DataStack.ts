import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'
import { getStackSuffix } from '../Utils'
import { Bucket, BucketAccessControl, HttpMethods, IBucket, ObjectOwnership } from 'aws-cdk-lib/aws-s3';

interface DataStackProps extends StackProps {
  distributionUrl: CfnOutput;
}

export class DataStack extends Stack {

  public readonly spacesTable: ITable;
  public readonly photosBucket: IBucket;

  constructor(scope: Construct, id: string, props?: DataStackProps) {
    super(scope, id, props)

    const stackSuffix = getStackSuffix(this);

    this.spacesTable = new Table(this, 'SpacesTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      tableName: `SpaceStack-${stackSuffix}`,
    })

    this.photosBucket = new Bucket(this, 'SpaceFinderPhotos', {
      bucketName: `space-finder-photos-${stackSuffix}`,
      cors: [{
        allowedMethods: [HttpMethods.GET, HttpMethods.POST, HttpMethods.PUT, HttpMethods.HEAD],
        allowedOrigins: ['*'],
        allowedHeaders: ['*'],
      }],
      // accessControl: BucketAccessControl.PUBLIC_READ,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
    })

    new CfnOutput(this, 'SpaceFinderPhotosBucketName', {
      value: this.photosBucket.bucketName,
    })
  }
}