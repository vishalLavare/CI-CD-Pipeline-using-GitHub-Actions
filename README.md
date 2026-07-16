# 🚀 Full-Stack CI/CD Pipeline using GitHub Actions, Docker, Amazon ECR, EC2, S3 & CloudFront

> Production-ready DevOps project demonstrating automated deployment of
> a React frontend and FastAPI backend on AWS using GitHub Actions.

## ✨ Features

-   Automated CI/CD with GitHub Actions
-   React + Vite frontend hosted on Amazon S3
-   Global content delivery using Amazon CloudFront
-   FastAPI backend containerized with Docker
-   Docker images stored in Amazon ECR
-   Backend deployed on Amazon EC2
-   Health check endpoint (`/health`)
-   CRUD REST API
-   CORS enabled for frontend integration
-   Docker-based deployment with zero manual steps

## 🏗️ Architecture

``` text
Developer
    │
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
 ├──────────────┐
 ▼              ▼
S3 + CloudFront ECR
                  │
                  ▼
              EC2 + Docker
                  │
                  ▼
              FastAPI (8000)
```

## 🛠 Tech Stack

  Category     Technologies
  ------------ -------------------------------------------
  Frontend     React, Vite, JavaScript
  Backend      FastAPI, Python
  Containers   Docker
  CI/CD        GitHub Actions
  Cloud        Amazon EC2, ECR, S3, CloudFront, IAM, ALB

## 📁 Project Structure

``` text
.
├── .github/workflows/deploy.yml
├── frontend/
├── backend/
├── scripts/deploy.sh
└── README.md
```

## 🔄 CI/CD Workflow

1.  Push code to `main`
2.  GitHub Actions starts
3.  Build React frontend
4.  Upload frontend to S3
5.  Invalidate CloudFront cache
6.  Build Docker image
7.  Push image to Amazon ECR
8.  SSH into EC2
9.  Pull latest image
10. Restart Docker container
11. Verify `/health`

## ☁️ AWS Services

-   Amazon EC2
-   Amazon ECR
-   Amazon S3
-   Amazon CloudFront
-   Application Load Balancer
-   IAM

## 🐳 Run Locally

### Backend

``` bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r app/requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

``` bash
cd frontend
npm install
npm run dev
```

## 🚀 API

  Method   Endpoint             Description
  -------- -------------------- --------------
  GET      /                    Welcome
  GET      /health              Health check
  GET      /api/v1/items        List items
  POST     /api/v1/items        Create item
  PUT      /api/v1/items/{id}   Update item
  DELETE   /api/v1/items/{id}   Delete item

## 🔐 Security

-   IAM roles for AWS access
-   Private Docker images in Amazon ECR
-   CloudFront Origin Access Control (OAC)
-   FastAPI CORS middleware
-   Security Groups for network isolation

## ⚠️ Challenges & Solutions

  Challenge                 Solution
  ------------------------- -------------------------------------
  CloudFront AccessDenied   Configured OAC and S3 bucket policy
  Mixed Content             Planned HTTPS via ALB + ACM
  CORS errors               Added FastAPI CORSMiddleware
  Deployment automation     GitHub Actions + Docker + ECR

## 📸 Screenshots

Add screenshots for: - GitHub Actions - CloudFront - S3 - ECR - EC2 -
ALB - Application Dashboard

## 📈 Future Improvements

-   HTTPS with ACM
-   Route 53 custom domain
-   Auto Scaling Group
-   Terraform IaC
-   CloudWatch monitoring
-   Blue/Green deployment

## 💼 Resume Summary

**Full-Stack CI/CD Pipeline \| GitHub Actions, Docker, FastAPI, React,
Amazon EC2, Amazon ECR, Amazon S3, CloudFront**

Designed and implemented a production-style CI/CD pipeline that
automatically builds, tests, containerizes, and deploys a React frontend
and FastAPI backend on AWS. Automated deployments using GitHub Actions,
Docker, Amazon ECR, EC2, S3, and CloudFront while implementing health
monitoring, CORS configuration, and secure cloud infrastructure.

## 👨‍💻 Author

**Vishal Lavare**

Cloud Engineer \| AWS \| Docker \| GitHub Actions \| FastAPI \| React

⭐ If you found this project useful, consider starring the repository.
