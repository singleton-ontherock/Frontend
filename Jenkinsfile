pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-hub-haejun'
        GITLAB_CREDENTIALS_ID = 'gitlab-access-u1qns'
        DOCKERHUB_REPO = 'seajun/front'
        GITLAB_REPO = 'https://lab.ssafy.com/s11-webmobile1-sub2/S11P12A801.git'
        BRANCH = 'frontend'
        DOCKER_IMAGE = "seajun/on-the-rock-app"
        DOCKER_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git credentialsId: "${GITLAB_CREDENTIALS_ID}", branch: "${BRANCH}", url: "${GITLAB_REPO}"
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('frontend/on-the-rock-app') {
                    script {
                        docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('', "${DOCKER_CREDENTIALS_ID}") {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push("latest")
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                sshagent(['ssafy-ec2-ssh']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@43.203.243.78 '
                            docker pull ${DOCKER_IMAGE}:${DOCKER_TAG}
                            docker stop on-the-rock-app || true
                            docker rm on-the-rock-app || true
                            docker run -d --name on-the-rock-app -p 80:80 -p 443:443 -v /etc/letsencrypt:/etc/letsencrypt ${DOCKER_IMAGE}:${DOCKER_TAG}
                        '
                    """
                }
            }
        }
    }

    post {
        always {
            // 빌드 완료 후 정리 작업
            sh 'docker system prune -af'
        }
        success {
            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'good',
                message: "빌드 성공 :good_good_cat: : ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID} (<${env.BUILD_URL}|Details>)",
                endpoint: 'https://meeting.ssafy.com/hooks/yza83hn9sp8qic7fqfiadq58hw',
                channel: 'A801_jenkins'
                )
            }
        }
        failure {
            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'danger',
                message: "빌드 실패 :cryingpatamon: : ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID} (<${env.BUILD_URL}|Details>)",
                endpoint: 'https://meeting.ssafy.com/hooks/yza83hn9sp8qic7fqfiadq58hw',
                channel: 'A801_jenkins'
                )
            }
        }
    }
    
}
