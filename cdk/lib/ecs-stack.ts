import {
  Stack, StackProps,
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_autoscaling as autoscaling,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class EcsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // AZ2, public/private構成のVPCを作成する
    const vpc = new ec2.Vpc(this, "ecsVpc", {
      cidr: "10.0.0.0/16",
      maxAzs: 2,
      natGateways: 1,
      vpcName: "ecs-vpc",
    });

    // ECSクラスタを作る
    const cluster = new ecs.Cluster(this, "playground", {
      vpc: vpc,
    });

    cluster.addCapacity('AsgSpot', {
      maxCapacity: 3,
      minCapacity: 0,
      desiredCapacity: 1,
      instanceType: new ec2.InstanceType('t3.small'),
      spotPrice: '0.01',
      spotInstanceDraining: true,
    });
  }
}
