# DuoKart Infrastructure as Code

## Overview
Terraform configuration to deploy DuoKart on AWS.

## Resources Created
- VPC (uses default)
- Security Group (ports 22, 80, 5001)
- ECR Repositories (backend + frontend)
- IAM Role + Instance Profile
- EC2 Instance (t2.micro)
- CloudWatch Log Groups (3)
- SNS Topic + CPU Alarm

## Usage

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## Outputs
- EC2 Public IP
- ECR Repository URLs
- Application URL