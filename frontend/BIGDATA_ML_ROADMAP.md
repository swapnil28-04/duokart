# DuoKart — Big Data, AI & Real-Time Analytics Architecture

## Overview
This document outlines DuoKart's roadmap for integrating Big Data 
processing, ML-powered recommendations, and real-time stream 
analytics on AWS infrastructure.

## Planned Architecture

### 1. Real-Time Order Stream (AWS Kinesis Data Streams)
- Every order placed → published to Kinesis stream
- Consumers: Analytics service, Fraud detection, Recommendations
- Throughput: 1000 orders/sec capacity
- Retention: 24 hours

### 2. Data Warehouse (Amazon Redshift)
- ETL: Kinesis Firehose → S3 → Redshift via COPY commands
- Tables: orders_fact, products_dim, users_dim, sellers_dim
- Use case: Business analytics dashboards for sellers
- Daily aggregations for sales reporting

### 3. ML — Product Recommendations (Amazon SageMaker)
- Algorithm: Factorization Machines / Neural Collaborative Filtering
- Training data: User browsing + purchase history from MongoDB
- Endpoint: SageMaker hosted inference endpoint
- Latency: <100ms per recommendation

### 4. ML — B2B vs B2C Mode Prediction (SageMaker)
- Model predicts user's likely shopping mode based on:
  - Time of day
  - Past purchase patterns
  - Cart value
- Auto-suggests mode switch when confidence > 80%

### 5. Big Data Processing (AWS EMR — Spark)
- Daily batch jobs analyzing seller performance
- Demand forecasting per product category
- Geographic sales heatmaps

## Data Flow

User Action (Web/Mobile)
    ↓
Frontend (React) 
    ↓
Backend API (Node.js on EC2)
    ↓
    ├── MongoDB (transactional data)
    └── Kinesis Stream (event stream)
            ↓
            ├── Kinesis Firehose → S3 (raw events)
            │       ↓
            │       EMR Spark Jobs → Redshift
            └── Lambda (real-time alerts)
                    ↓
                    SNS (notifications)

SageMaker Endpoint ← Backend API (recommendations)

## Cost Estimate (Monthly)
- Kinesis: $30 (1 shard)
- Redshift: $180 (dc2.large single node) 
- SageMaker endpoint: $50 (ml.t2.medium)
- EMR: $40 (on-demand, ~10 hours/month)
- Total: ~$300/month at scale

## Implementation Phases
**Phase 1 (Month 1):** Kinesis stream + S3 archival
**Phase 2 (Month 2):** Redshift + analytics dashboard
**Phase 3 (Month 3):** SageMaker recommendation engine
**Phase 4 (Month 4):** EMR batch processing

## Technologies Demonstrated
- AWS Kinesis (real-time streaming)
- AWS Redshift (data warehouse)
- AWS SageMaker (ML training + inference)
- AWS EMR (Spark big data processing)
- AWS Lambda (event-driven processing)
- AWS S3 (data lake)