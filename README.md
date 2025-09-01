
# Expense Tracker App

A cloud-native expense tracking application developed using Next.js and deployed on Google Cloud Run, exemplifying secure development and DevSecOps best practices.

Designed both as a personal expense management tool and a demonstration of security-first engineering, this project integrates static application security testing (SAST), dynamic application security testing (DAST), container vulnerability scanning, secrets management, and monitoring within a modern CI/CD pipeline.
## Features
Track expenses with categories, transaction types, and date filters
Secure authentication 
Cloud-native deployment on Google Cloud Run with MongoDB Atlas backend
Integrated DevSecOps pipeline with automated security checks
Visual reports for expense analysis

## Architecture
The application follows a secure, cloud-native architecture.
- Architecture Diagram: [View Here](https://psudhakar963.atlassian.net/wiki/external/OTk2MzdhZmY3MDEyNDgyODkxMDJmZjg4OTViNmI1MjU)
- Entity Relationship Diagram (ERD): [View Here](https://psudhakar963.atlassian.net/wiki/external/NTAyZDQ3YzU2M2YzNDAwNGE5MzQxNTJkYjc0MDEzNTA)

## DevSecOps Practices
- This project demonstrates how to integrate security into every stage of the SDLC:
- SAST: SonarCloud for static code analysis & quality gates\
- DAST: OWASP ZAP for runtime security testing
- Container Scanning: Trivy & Docker Scout for image vulnerability checks
- Secrets Management: Google Secret Manager for secure storage of credentials
- Monitoring & Logging: GCP Cloud Monitoring for system health and security posture
- CI/CD: Google Cloud Build with automated build → scan → deploy workflow

## Tech Stack

- Frontend: Next.js, Tailwind CSS
- Backend: Next.js API routes, MongoDB Atlas
- Infrastructure: Google Cloud Run, Docker, Artifact Registry
- DevSecOps Tooling: SonarCloud, OWASP ZAP, Trivy, Docker Scout, Google Secret Manager, GCP Cloud Build
- Deploy to Cloud Run (via CI/CD pipeline)
  - Push changes → GitHub → GCP Cloud Build runs automated pipeline:
    - SAST(SonarCloud) → Build → SAST/DAST Container scan/OWASP ZAP → Push to Artifact Registry → Deploy to Cloud Run

## Reports & Analytics
- Transaction breakdown by type and date range
-  Interactive charts for expense visualization
-  Exportable data for personal finance tracking

## Why This Project
This project is not just a simple expense tracker —  it is a hands-on demonstration of expertise in developing robust backend REST services, advanced frontend applications with Next.js, secure coding practices, and integrated DevSecOps principles.:
- Security integrated into the CI/CD pipeline
- Cloud-native, containerized deployment
- Real-world monitoring, logging, and compliance practices