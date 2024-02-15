import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { getStackSuffix } from '../Utils';
import { join } from 'path';
import { existsSync } from 'fs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';



export class UIDeploymentStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const stackSuffix = getStackSuffix(this)
    const deploymentBucket = new Bucket(this, 'DeploymentUIBucket', {
      bucketName: `deployment-ui-bucket-${stackSuffix}`,
    });

    const uiDir = join(__dirname, '..', '..', '..', '..', 'space-finder-fronted', 'build');

    if(!existsSync(uiDir)) {
      console.log('Such a file for this path doesnt exist' + uiDir);
      return;
    };

    new BucketDeployment(this, 'SpacesFinderDeployment', {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)]
    });

    const originIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');

    deploymentBucket.grantRead(originIdentity);

    const distribution = new Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(deploymentBucket, {
          originAccessIdentity: originIdentity
        })
      }
    });

   new CfnOutput(this, 'SpaceFinderUrl', {
      value: distribution.distributionDomainName
    });
  }
}