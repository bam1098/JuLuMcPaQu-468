pipeline {
	agent {
		kubernetes {
			inheritFrom 'agent-template'
		}
	}
	stages {
		stage('Build') {
			steps {
				echo 'building...'
			}
		}
		stage('Test') {
			steps {
				echo 'Testing...'
			}
		}
		stage('Deploy') {
			steps {
				echo 'Deploying...'
			}
		}
	}
}
