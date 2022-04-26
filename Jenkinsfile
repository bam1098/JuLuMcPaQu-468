pipeline {
    agent {
        docker { image 'node:16.13.1-alpine' }
    }
	environment {
			CI = 'true'
	}
    stages {
		stage('Build') {
			steps {
					bash 'install_docker.sh'
					echo '-- Building containers --'
					sh 'docker-compose build'
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
					sh 'docker-compose up'
			}
		}
	}
}