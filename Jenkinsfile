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

        stage('Trivy Frontend Scan') {
            steps {
                sh '''
                    trivy image \
                    --severity HIGH,CRITICAL \
                    --format table \
                    ${FRONTEND_IMAGE}:latest
                '''
            }
        }

        stage('Trivy Backend Scan') {
            steps {
                sh '''
                    trivy image \
                    --severity HIGH,CRITICAL \
                    --format table \
                    ${BACKEND_IMAGE}:latest
                '''
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh '''
                    docker push ${FRONTEND_IMAGE}:latest
                '''
            }
        }

        stage('Push Backend Image') {
            steps {
                sh '''
                    docker push ${BACKEND_IMAGE}:latest
                '''
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                    docker compose down

                    docker compose pull

                    docker compose up -d
                '''
            }
        }

        stage('Wait for Containers') {
            steps {
                sh '''
                    echo "Waiting for containers to start..."
                    sleep 15
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Checking Container Status..."

                    docker compose ps

                    echo ""
                    echo "Checking Backend Container..."
                    BACKEND_STATUS=$(docker inspect -f '{{.State.Status}}' backend-container)
                    echo "Backend Status: ${BACKEND_STATUS}"

                    if [ "${BACKEND_STATUS}" != "running" ]; then
                        echo "Backend container is not running!"
                        exit 1
                    fi

                    echo ""
                    echo "Checking Frontend Container..."
                    FRONTEND_STATUS=$(docker inspect -f '{{.State.Status}}' frontend-container)
                    echo "Frontend Status: ${FRONTEND_STATUS}"

                    if [ "${FRONTEND_STATUS}" != "running" ]; then
                        echo "Frontend container is not running!"
                        exit 1
                    fi

                    echo ""
                    echo "Checking MySQL Container..."
                    MYSQL_STATUS=$(docker inspect -f '{{.State.Status}}' mysql)
                    echo "MySQL Status: ${MYSQL_STATUS}"

                    if [ "${MYSQL_STATUS}" != "running" ]; then
                        echo "MySQL container is not running!"
                        exit 1
                    fi

                    echo ""
                    echo "All containers are running successfully."
                '''
            }
        }

        stage('Cleanup Old Images') {
            steps {
                sh '''
                    docker image prune -f
                '''
            }
        }
    }

    post {
        success {
            echo '======================================'
            echo 'Jenkins Pipeline Completed Successfully'
            echo 'Docker Compose Deployment Successful'
            echo 'All Containers Are Running'
            echo '======================================'
        }

        failure {
            echo '======================================'
            echo 'Jenkins Pipeline Failed'
            echo 'Please check the stage logs'
            echo '======================================'
        }

        always {
            sh 'docker ps -a || true'
        }
    }
}
```
