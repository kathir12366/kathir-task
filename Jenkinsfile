pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "660815084808"

        FRONTEND_REPO = "frontend-repo"
        BACKEND_REPO = "backend-repo"

        FRONTEND_IMAGE = "660815084808.dkr.ecr.ap-south-1.amazonaws.com/frontend-repo"
        BACKEND_IMAGE = "660815084808.dkr.ecr.ap-south-1.amazonaws.com/backend-repo"
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
                    660815084808.dkr.ecr.ap-south-1.amazonaws.com
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    docker build \
                    -t 660815084808.dkr.ecr.ap-south-1.amazonaws.com/frontend-repo:latest \
                    ./frontend
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                    docker build \
                    -t 660815084808.dkr.ecr.ap-south-1.amazonaws.com/backend-repo:latest \
                    ./backend
                '''
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh '''
                    docker push \
                    660815084808.dkr.ecr.ap-south-1.amazonaws.com/frontend-repo:latest
                '''
            }
        }

        stage('Push Backend Image') {
            steps {
                sh '''
                    docker push \
                    660815084808.dkr.ecr.ap-south-1.amazonaws.com/backend-repo:latest
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
