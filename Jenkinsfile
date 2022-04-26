pipeline {
	agent any
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
