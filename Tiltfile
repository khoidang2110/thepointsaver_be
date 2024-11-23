# Define the Docker build context for your service
docker_build('thepointsaver', '.',  cache_from=['thepointsaver:latest'] )


# Optionally, you can define a kubernetes deployment if needed
k8s_yaml(['k8s/deployment.yaml', 'k8s/service.yaml' ,'k8s/hpa.yaml'])