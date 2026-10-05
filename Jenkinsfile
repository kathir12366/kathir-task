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
                aws ecr get-login-password --region ${AWS_REGION} |
                docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
            '''
        }
    }

    stage('Build Frontend Image') {
        steps {
            sh 'docker build -t ${FRONTEND_IMAGE}:latest ./frontend'
        }
    }

    stage('Build Backend Image') {
        steps {
            sh 'docker build -t ${BACKEND_IMAGE}:latest ./backend'
        }
    }

    stage('Trivy Frontend Scan') {
        steps {
            sh 'trivy image --severity HIGH,CRITICAL --format table ${FRONTEND_IMAGE}:latest'
        }
    }

    stage('Trivy Backend Scan') {
        steps {
            sh 'trivy image --severity HIGH,CRITICAL --format table ${BACKEND_IMAGE}:latest'
        }
    }

    stage('Push Frontend Image') {
        steps {
            sh 'docker push ${FRONTEND_IMAGE}:latest'
        }
    }

    stage('Push Backend Image') {
        steps {
            sh 'docker push ${BACKEND_IMAGE}:latest'
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
            sh 'sleep 15'
        }
    }

    stage('Health Check') {
        steps {
            sh '''
                docker compose ps

                for service in mysql backend frontend
                do
                    CID=$(docker compose ps -q "$service")

                    if [ -z "$CID" ]; then
                        echo "$service container not found"
                        exit 1
                    fi

                    STATUS=$(docker inspect -f '{{.State.Status}}' "$CID")
                    HEALTH=$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$CID")

                    echo "$service -> Status: $STATUS | Health: $HEALTH"

                    if [ "$STATUS" != "running" ]; then
                        exit 1
                    fi

                    if [ "$HEALTH" != "healthy" ]; then
                        exit 1
                    fi
                done

                echo "ALL 3 CONTAINERS ARE HEALTHY"
            '''
        }
    }

    stage('Cleanup Old Images') {
        steps {
            sh 'docker image prune -f'
        }
    }
}

post {
    success {
        echo "JENKINS PIPELINE SUCCESS"
    }

    failure {
        echo "JENKINS PIPELINE FAILED"
    }

    always {
        sh 'docker ps -a || true'
    }
}

}
