# Udagram Image Application: Microservices Deployment

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

The project is split into three parts:
1. [The Simple Frontend](/udacity-c3-frontend)
A basic Ionic client web application which consumes the RestAPI Backend. 
2. [The RestAPI Feed Backend](/udacity-c3-restapi-feed), a Node-Express feed microservice.
3. [The RestAPI User Backend](/udacity-c3-restapi-user), a Node-Express user microservice.


### Setup and deployment

#### Running the application with docker

The Docker images are publicly available, you can find them in ```https://hub.docker.com/search?q=cpenaloza%2F&type=image```

1. Export the necessary environment variables. Your AWS credentials must already be set in the ```~.aws/credentials``` file. This variables are used in the ```docker-compose.yaml``` file inside of the deployment directory:
   ```
    export POSTGRESS_USERNAME=yourusername;
    export POSTGRESS_PASSWORD=yourpassword;
    export POSTGRESS_DB=postgresdbname;
    export POSTGRESS_HOST=postgreshost;
    export AWS_REGION=awsregion;
    export AWS_PROFILE=default;
    export AWS_BUCKET=udagramdemo;
    export JWT_SECRET=helloworld;
   ```

2. Build the images for each of the application's services, using the command:
   ```
   docker-compose -f docker-compose-build.yaml build --parallel
    ```
3. Run a container for each of the services (you may use detached mode to run containers in the background adding the -d flag):
   ```
   docker-compose up
   ```
4. Go to the browser and open ```http://localhost:8100/``` to see the Udagram application
5. When you wish to stop the container use:
   ```
    docker-compose stop
    # Or, to remove (and stop) the container:
    docker-compose down
    ```

#### Running the application with Kubernetes

1. Export the necessary environment variables. These include the ones shown above in the Docker section. In addition to those, add a CREDENTIALS environment variable with the value obtained from running (base64 encoding of your aws credentials file):
   ```
    cat ~/.aws/credentials | base64
   ```
These variables are used by the ```deployment.yaml``` files in the ```deployment/k8s``` directory.
2. cd into the ```udacity-cr-deployment/k8s``` directory
2. Define the kubernetes services:
   ```
   kubectl apply -f backend-feed-service.yaml 
   kubectl apply -f backend-user-service.yaml 
   kubectl apply -f frontend-service.yaml 
   kubectl apply -f reverseproxy-service.yaml 
   ```
3. Carry out the deployments:
   ```
   kubectl apply -f backend-user-deployment.yaml 
   kubectl apply -f backend-user-deployment.yaml 
   kubectl apply -f frontend-deployment.yaml 
   kubectl apply -f reverseproxy-deployment.yaml 
   ```
4. Check that all the pods are running:
   ```
   kubectl get pod
   ```
5. To test locally run:
   ```
   kubectl port-forward service/frontend 8100:8100
   kubectl port-forward service/reverseproxy 8080:8080
   ```
6. Go to the browser and open ```http://localhost:8100/``` to see the Udagram application
   