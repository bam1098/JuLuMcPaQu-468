pipeline {
        agent {
                docker {
                        image: 'node:6-alpine'
                        args: '-p 3000:3000'
                }
        }
        environment {
                CI = 'true'
        }
        stages {
                stage('Build') {
                        steps {
                                git 'https://github.com/bam1098/JuLuMcPaQu-468'
                        }
                }
                stage('Test') {
                        steps {
                                echo 'Testing...'
                        }
                }
                stage('Deploy') {
                        steps {
                                sh 'sudo docker-compose up --build'
                        }
                }
        }
}