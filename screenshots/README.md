# Project Proof: Screenshots to Capture

For a Cloud/DevOps Engineer resume, showcasing visual proof of a working project is highly recommended. Take screenshots of the following steps and save them in this directory (`screenshots/`) to add visual credibility to your GitHub repository or personal portfolio.

---

### 1. Amazon ECR Repository Setup
* **What to capture:** The Amazon ECR console showing your repository list and details.
* **Filename suggestion:** `01_amazon_ecr_repo.png`
* **Key details to show:** Repository name matching your configuration and permissions settings.

### 2. AWS EC2 Instance & IAM Role Configuration
* **What to capture:** The EC2 console dashboard detail pane.
* **Filename suggestion:** `02_aws_ec2_details.png`
* **Key details to show:** Ubuntu 22.04 OS, Instance State `Running`, the associated Security Group (ports 22 and 8000 open), and the IAM instance profile/role attached to the instance.

### 3. GitHub Secrets Configurations
* **What to capture:** The "Settings" -> "Secrets and Variables" -> "Actions" page of your GitHub repository.
* **Filename suggestion:** `03_github_secrets.png`
* **Key details to show:** List of repository secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_ACCOUNT_ID`, `ECR_REPOSITORY`, `EC2_HOST`, `EC2_USERNAME`, and `SSH_PRIVATE_KEY` (no values visible, just the keys).

### 4. Successful GitHub Actions CI/CD Pipeline Run
* **What to capture:** The GitHub Actions workflow page.
* **Filename suggestion:** `04_github_actions_workflow.png`
* **Key details to show:** Green checkmark status showing all 13 pipeline steps completed successfully, with logs showing Docker build, ECR push, and the SSH execution script output.

### 5. Running Container on EC2
* **What to capture:** Your local terminal window SSH'd into the EC2 instance.
* **Filename suggestion:** `05_docker_ps_on_ec2.png`
* **Key details to show:** The command `docker ps -a` running, displaying the active container named `fastapi_app` mapping port `8000:8000` with the status `Up (Healthy)`.

### 6. Live API Test & Swagger UI Documentation
* **What to capture:** A web browser displaying the live endpoints.
* **Filename suggestion:** `06_api_endpoints.png`
* **Key details to show:**
  * Endpoint `http://<YOUR-EC2-PUBLIC-IP>:8000/health` responding with:
    ```json
    {
      "status": "healthy",
      "timestamp": "2026-07-15T...",
      "environment": "production"
    }
    ```
  * Endpoint `http://<YOUR-EC2-PUBLIC-IP>:8000/docs` displaying the interactive FastAPI Swagger UI.
