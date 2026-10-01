```groovy
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
    }

    post {
        success {
            echo 'SUCCESS: Frontend and Backend images built, scanned and pushed to ECR successfully!'
        }

        failure {
            echo 'PIPELINE FAILED: Please check the stage logs for details.'
        }
    }
}
```
