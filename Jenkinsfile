pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "240571106446"

        FRONTEND_REPO = "sabarifullstack-frontend"
        BACKEND_REPO = "sabarifullstack-backend"

        FRONTEND_IMAGE = "240571106446.dkr.ecr.ap-south-1.amazonaws.com/sabarifullstack-frontend"
        BACKEND_IMAGE = "240571106446.dkr.ecr.ap-south-1.amazonaws.com/sabarifullstack-backend"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('ECR Login') {
            steps {
                sh '''
                    aws ecr get-login-password \
                    --region ${AWS_REGION} | \
                    docker login \
                    --username AWS \
                    --password-stdin \
                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    docker build \
                    -t ${FRONTEND_IMAGE}:latest \
                    ./frontend
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                    docker build \
                    -t ${BACKEND_IMAGE}:latest \
                    ./backend
                '''
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh '''
                    echo "======================================"
                    echo " Trivy Frontend Image Security Scan"
                    echo "======================================"

                    trivy image \
                    --format table \
                    --severity HIGH,CRITICAL \
                    ${FRONTEND_IMAGE}:latest

                    echo "======================================"
                    echo " Trivy Backend Image Security Scan"
                    echo "======================================"

                    trivy image \
                    --format table \
                    --severity HIGH,CRITICAL \
                    ${BACKEND_IMAGE}:latest
                '''
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh '''
                    docker push \
                    ${FRONTEND_IMAGE}:latest
                '''
            }
        }

        stage('Push Backend Image') {
            steps {
                sh '''
                    docker push \
                    ${BACKEND_IMAGE}:latest
                '''
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                    echo "======================================"
                    echo " Deploying Application"
                    echo "======================================"

                    docker compose pull
                    docker compose up -d

                    echo "======================================"
                    echo " Container Status"
                    echo "======================================"

                    docker compose ps
                '''
            }
        }

        stage('Application Health Check') {
            steps {
                sh '''
                    echo "======================================"
                    echo " Application Health Check"
                    echo "======================================"

                    echo "Waiting for services..."
                    sleep 15

                    echo "Checking Backend..."
                    curl -f http://localhost:3000

                    echo ""
                    echo "Checking Frontend..."
                    curl -f http://localhost:5173

                    echo ""
                    echo "Checking Container Health..."
                    docker compose ps

                    echo ""
                    echo "Application health check completed successfully!"
                '''
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Build, Trivy scan, ECR push, Docker Compose deployment and health checks completed successfully!'
        }

        failure {
            echo 'PIPELINE FAILED: Please check the failed stage logs.'
        }
    }
}
