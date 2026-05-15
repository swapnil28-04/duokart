# 🛒 DuoKart — Unified B2B/B2C Marketplace

A full-stack containerized marketplace where users can shop as either **Customer (B2C)** or **Business (B2B)** — same products, different pricing logic.

## 🎯 Live Demo
🌍 **[Visit DuoKart](http://13.232.194.14)** (deployed on AWS EC2)

## 🛠️ Tech Stack

### Frontend
- React 18 with React Router
- Context API for state management
- Axios for API calls
- Nginx for production serving

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- bcrypt password hashing

### DevOps
- Docker (multi-stage builds)
- Docker Compose orchestration
- AWS EC2 (deployment)
- AWS ECR (container registry)
- AWS IAM (security)
- GitHub Actions (CI/CD)

## ✨ Features
- 🔐 JWT-based authentication
- 🛍️ B2C and B2B shopping modes
- 💰 Dynamic pricing (retail vs wholesale)
- 🛒 Smart cart with mode-aware pricing
- 📊 GST calculations for B2B
- 🚚 Free delivery thresholds
- 🔍 Search & category filters
- 📱 Fully responsive design

## 🚀 Quick Start (Local Development)

```bash
# Clone the repo
git clone https://github.com/swapnil28-04/duokart.git
cd duokart

# Start with Docker Compose
docker compose up -d --build

# Seed products (after registering a user)
docker exec -it duokart-backend node seedProducts.js

# Open in browser
open http://localhost:3000
```

## 📦 Architecture




## 🎓 Project Context
Cloud Computing major project demonstrating Docker containerization, multi-service orchestration, AWS cloud deployment, container registry workflows, and CI/CD best practices.

## 👤 Author
**Swapnil Roy** — [@swapnil28-04](https://github.com/swapnil28-04)

## 📄 License
MIT