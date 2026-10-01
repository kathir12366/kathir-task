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
                    --region ap-south-1 | \
                    docker login \
                    --username AWS \
                    --password-stdin \
                    240571106446.dkr.ecr.ap-south-1.amazonaws.com
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    docker build \
                    -t 240571106446.dkr.ecr.ap-south-1.amazonaws.com/sabarifullstack-frontend:latest \
                    ./frontend
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                    docker build \
                    -t 240571106446.dkr.ecr.ap-south-1.amazonaws.com/sabarifullstack-backend:latest \
                    ./backend
                '''
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh '''
                    docker push \
                    240571106446.dkr.ecr.ap-south-1.amazonaws.com/sabarifullstack-frontend:latest
                '''
            }
        }

        stage('Push Backend Image') {
            steps {
                sh '''
                    docker push \
                    240571106446.dkr.ecr.ap-south-1.amazonaws.com/sabarifullstack-backend:latest
                '''
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Frontend and Backend images pushed to ECR successfully!'
        }
    }
}
```
