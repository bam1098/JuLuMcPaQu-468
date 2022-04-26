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
					curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
					chmod +x /usr/local/bin/docker-compose
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