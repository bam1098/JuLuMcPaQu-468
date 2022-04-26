pipeline {
	agent {
			docker {
					image 'node:6-alpine'
					args '-p 3000:3000'
			}
	}
	environment {
			CI = 'true'
	}
    stages {
		stage('Build') {
			steps {
					echo '-- Building containers --'
					sh 'sudo docker-compose build'
			}
		}
		stage('Test') {
			steps {
					echo 'Testing...'
			}
		}
		stage('Deploy') {
			steps {
					echo '-- Deploying containers --'
					sh 'sudo docker-compose up'
			}
		}
	}
}