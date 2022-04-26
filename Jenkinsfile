pipeline {
        agent any
        environment {
                CI = 'true'
        }
        stages {
                stage('Build') {
                        steps {
                                echo 'Building...'
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
