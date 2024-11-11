# Steps:
1. Downloaded the application and made sure it ran in my laptop, added the missing script in package.json "start": "node index.js"
2. Dockerise the application and push it to Dockerhub https://hub.docker.com/r/thasir/nodeapp
```
# Use an official Node.js runtime as a parent image
FROM node:23-alpine3.19

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json /app/

# Install any needed dependencies specified in package.json
RUN npm install 

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 6041

# Define the command to run the app
CMD ["npm", "start"]

```
3. Created Deployment file and Service Files for the application

```

apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-node-app
  labels:
    app: my-node-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-node-app
  template:
    metadata:
      labels:
        app: my-node-app
    spec:
      containers:
      - name: my-node-app
        image: docker.io/thasir/nodeapp:v1
        ports:
        - containerPort: 6041
          protocol: TCP
        resources:
          requests:
            cpu: "100m"
            memory: "100Mi"         
          limits:
            cpu: "500m"
            memory: "500Mi"
```

```
apiVersion: v1
kind: Service
metadata:
  name: my-node-app-service
spec:
  type: NodePort
  selector:
    app: my-node-app
  ports:
    - protocol: TCP
      port: 6041
      targetPort: 6041

```
4. Created an EKS Cluster with 3 nodes in AWS installed the above Deployment and Service as well as a metrics server for Horizontal pod autoscaling also created HPA.yaml for the same 
```
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-node-app
  minReplicas: 1
  maxReplicas: 3
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50

```
