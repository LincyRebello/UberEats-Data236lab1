## Uber Eats Clone Project

Welcome to the Uber Eats Clone project! This repository contains the code for a food delivery application that mimics the functionality of Uber Eats, using Django for the backend and React for the frontend.

## Project Overview

This project is an attempt to replicate the core features of a food delivery service like Uber Eats. It provides functionalities for users to browse restaurants, view menus, place orders, and track delivery status. The backend is powered by Django, providing a robust API and database management, while the frontend is built with React to offer a dynamic and responsive user interface.

The Demo of the project is available at: https://youtu.be/x1u_P5Q84SQ

## Features

- User Registration and Login
- Restaurant Dashboard
- Menu Management
- Order Tracking
- User Profiles and Preferences
- Ratings and Reviews on Restaurants

## Tech Stack

- **Backend:** Django
- **Frontend:** React
- **Database:** SQLite for development
## Installation

### Prerequisites

Ensure you have the following installed on your machine:

- Python 3.x
- Node.js and npm

### Backend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/leoncorreia/data236-lab1.git
   cd data236-lab1
   ```

2. **Create a virtual environment and activate it:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Run migrations:**

   ```bash
   cd uber_eats
   python manage.py migrate
   ```

5. **Start the development server:**

   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

## Usage

Once both servers are running, you can access the application by navigating to `http://localhost:3000` in your web browser. Use the admin panel at `http://localhost:8000/admin` to manage restaurants and menus. API documentation is available at `http://localhost:8000/swagger/` and alternatively at `http://localhost:8000/redoc/` also as a json file for postman import.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---
#Enhancements To the existing Project

## Project Overview
This project enchances our food delivery platform using microservices architecture with containerization, Kubernetes orchestration, and event-driven messaging.

## Prerequisites
- Docker
- Kubernetes (Minikube)
- Docker Hub Account

## Docker Commands

### Build and Push Images
```bash
# Backend Image
docker build -t backend:latest .
docker tag backend:latest <docker-username>/backend:latest
docker push <docker-username>/backend:latest

# Frontend Image
docker build -t frontend:latest .
docker tag frontend:latest <docker-username>/frontend:latest 
docker push <docker-username>/frontend:latest
```

### Run Docker Containers
```bash
# Run Backend
docker run -d -p 8000:8000 backend:latest

# Run Frontend
docker run -d -p 3000:3000 frontend:latest
```

## Docker Compose

### Start Services
```bash
# Start Individual Services
docker-compose up -d mongodb
docker-compose up -d kafka
docker-compose up -d redis
docker-compose up -d backend
docker-compose up -d frontend

# Alternatively, start all services
docker-compose up -d
```

## Kubernetes Deployment

### Initial Setup
```bash
# Start Minikube
minikube start

# Apply Kubernetes Configurations (in kubernetes folder)
kubectl apply -f mongo-pvc.yaml
kubectl apply -f mongo-app.yaml
kubectl apply -f redis-app.yaml
kubectl apply -f kafka-app.yaml
kubectl apply -f backend-app.yaml
kubectl apply -f frontend-app.yaml

# Enable External Access
minikube tunnel
```

### Restart Deployments
```bash
# Restart Backend and Frontend Deployments
kubectl rollout restart deployment backend
kubectl rollout restart deployment frontend
```

## Kubernetes Utility Commands

### Pod Management
```bash
# List Pods
kubectl get pods

# Access Pod Shell
kubectl exec -it <pod-name> -- /bin/sh

# View Pod Logs
kubectl logs -f <pod-name>

# View Logs for Specific Container
kubectl logs -f <pod-name> -c <container-name>
```

## Kafka Commands

### Topic Management
```bash
# Describe Kafka Topics
kafka-topics.sh --describe --bootstrap-server kafka-service:9092

# Describe Specific Topic
kafka-topics.sh --describe --bootstrap-server kafka-service:9092 --topic orders

# Create New Topic
kafka-topics.sh --create \
  --bootstrap-server kafka-service:9092 \
  --replication-factor 1 \
  --partitions 3 \
  --topic orders
```

### Kafka Producer and Consumer
```bash
# Start Kafka Producer
kafka-console-producer.sh --broker-list kafka-service:9092 --topic orders

# Start Kafka Consumer
kafka-console-consumer.sh \
  --bootstrap-server kafka-service:9092 \
  --topic orders \
  --from-beginning
```

## Project Structure
```
project-root/
│
├── docker-compose.yml
├── kubernetes/
│   ├── mongo-pvc.yaml
│   ├── mongo-app.yaml
│   ├── redis-app.yaml
│   ├── kafka-app.yaml
│   ├── backend-app.yaml
│   └── frontend-app.yaml
│
├── backend/
│   ├── Dockerfile
│   └── ...
│
└── frontend/
    ├── Dockerfile
    └── ...
```

## Troubleshooting
- Ensure Docker and Minikube are running
- Check container/pod logs for errors
- Verify network configurations
- Confirm all required services are running

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
```