# Pipeline

## Instructions
ssh into head node

run: bash /local/repository/launch_jenkins.sh

run: kubectl exec $(kubectl get pods -n jenkins | grep jenkins | awk '{print $1}') -n jenkins -- cat /var/jenkins_home/secrets/initialAdminPassword

Follow slides

## To-do list:
  -Build out Jenkinsfile in main
  
  -Follow slides to set up pipeline
