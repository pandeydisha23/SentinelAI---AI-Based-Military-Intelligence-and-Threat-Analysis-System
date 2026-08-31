# SentinelAI — AI-Based Military Intelligence & Threat Analysis Dashboard

SentinelAI is an AI-powered military intelligence and threat analysis dashboard designed to analyze surveillance imagery, detect objects, assess potential threats, and provide explainable machine-learning insights through a real-time web interface.

The system combines **YOLO-based object detection, rule-based threat assessment, Random Forest classification, explainable ML, and a React dashboard** to provide an integrated threat-monitoring workflow.


🚀 Key Features

* 🛰️ **Surveillance Image Upload**
* 🎯 **YOLO-based Object Detection**
* 📦 Detection of objects from uploaded imagery
* ⚠️ **Threat Score Calculation**
* 🔴 Threat classification into:

  * HIGH
  * MEDIUM
  * LOW
* 🤖 **Random Forest Threat Classification**
* 📊 ML model performance evaluation
* 🔍 Feature importance analysis
* 🧠 Explainable AI / ML threat reasoning
* 📡 Real-time dashboard updates using WebSockets
* 📋 Mission history and mission reports
* 🖼️ Annotated images with detection bounding boxes
* 📈 Dashboard-based analytics
* ⚡ FastAPI backend with React frontend



 🏗️ System Architecture


                    ┌──────────────────────┐
                    │      React UI        │
                    │   SentinelAI         │
                    └──────────┬───────────┘
                               │
                         HTTP / WebSocket
                               │
                               ▼
                    ┌──────────────────────┐
                    │     FastAPI API      │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
      │ YOLO Object │   │   Threat    │   │   Mission   │
      │  Detection  │   │  Analysis   │   │   Database  │
      └──────┬──────┘   └──────┬──────┘   └─────────────┘
             │                 │
             └────────┬────────┘
                      ▼
              ┌───────────────┐
              │ Random Forest │
              │ Threat Model  │
              └───────┬───────┘
                      │
                      ▼
             ┌──────────────────┐
             │ Explainable ML   │
             │ Feature Analysis │
             └──────────────────┘

 🧠 How SentinelAI Works

 1. Image Upload

The user uploads a surveillance image through the React dashboard.

 2. Object Detection

The image is processed using a YOLO object-detection model.

The system identifies objects and records:

* Object class
* Detection confidence
* Number of detected objects
* Maximum detection confidence
* Average detection confidence

The system also generates an annotated image containing bounding boxes.

 3. Threat Analysis

Detected objects are evaluated using predefined threat rules.

The system calculates:

* Threat score
* Threat level
* Priority score
* Recommended action
* AI confidence

 4. ML Threat Classification

Mission-level features are passed to a trained **Random Forest classifier**.

The model predicts one of three threat classes:


HIGH
MEDIUM
LOW

 5. Explainable ML

The system analyzes the importance of features contributing to the threat classification.

Important features include:


threat_score
priority_score
average_detection_confidence
maximum_detection_confidence
ai_confidence
object_count


 6. Dashboard

The React dashboard displays the results through:

* Threat indicators
* Mission information
* Detection results
* ML performance
* Feature importance
* Threat reasoning
* Historical mission data


# 🛠️ Technology Stack

 # Frontend

* React 18
* React Router
* Axios
* Tailwind CSS
* Context API
* JavaScript
* HTML/CSS

# Backend

* Python
* FastAPI
* Uvicorn
* Pydantic
* SQLAlchemy
* Python Multipart
* WebSockets

# Artificial Intelligence / Machine Learning

* YOLO
* Ultralytics
* OpenCV
* NumPy
* Pandas
* Scikit-learn
* Random Forest Classifier
* Explainable ML

# Database

* SQLite
* SQLAlchemy ORM

# Development Tools

* Visual Studio Code
* PowerShell
* Git / GitHub
* Python Virtual Environment
* npm



# 📁 Project Structure

SentinelAI/
│
├── backend/
│   │
│   ├── app/
│   │   ├── data/
│   │   ├── models/
│   │   ├── routers/
│   │   │   ├── analytics_routes.py
│   │   │   ├── fire_routes.py
│   │   │   ├── mission_routes.py
│   │   │   └── ml_routes.py
│   │   │
│   │   ├── schemas/
│   │   └── services/
│   │       ├── fire_service.py
│   │       └── threat_ml_service.py
│   │
│   ├── ml_models/
│   │   ├── threat_classifier.joblib
│   │   └── threat_label_encoder.joblib
│   │
│   ├── models/
│   ├── datasets/
│   ├── uploads/
│   ├── outputs/
│   ├── reports/
│   ├── videos/
│   │
│   ├── train_ml_model.py
│   ├── sentinel.db
│   ├── yolov8n.pt
│   └── .env
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   │
│   ├── public/
│   └── package.json
│
└── README.md

# ⚙️ Installation & Setup

 Prerequisites

Install the following:

* Python 3.10+
* Node.js
* npm
* Git
* Visual Studio Code


# 🤖 Machine Learning Model

SentinelAI uses a Random Forest classifier to classify missions into threat levels.

The trained model is stored as:


backend/ml_models/threat_classifier.joblib

The label encoder is stored as:

backend/ml_models/threat_label_encoder.joblib


The model uses the following features:

1. threat_score
2. ai_confidence
3. object_count
4. average_detection_confidence
5. maximum_detection_confidence
6. priority_score

# 📊 Model Evaluation

The current prototype was evaluated using **28 labelled missions**.

Total samples     : 28
Training samples  : 21
Testing samples   : 7


The evaluation produced:

| Metric    | Result |
| --------- | -----: |
| Accuracy  | 85.71% |
| Precision | 88.57% |
| Recall    | 85.71% |
| F1 Score  | 84.13% |

### Threat Class Distribution

HIGH    : 15
MEDIUM  : 8
LOW     : 5


# Confusion Matrix

[[4, 0, 0],
 [0, 1, 0],
 [1, 0, 1]]


# Feature Importance


threat_score                    : 30.59%
priority_score                 : 23.73%
average_detection_confidence   : 15.58%
maximum_detection_confidence   : 14.64%
ai_confidence                  : 11.83%
object_count                   : 3.63%


# 📡 WebSocket Communication

SentinelAI uses WebSockets to provide real-time dashboard updates.

The frontend establishes a WebSocket connection with the backend.

After a new mission is successfully created, the backend broadcasts an event similar to:

{
  "type": "NEW_MISSION"
}


The React dashboard receives the event and refreshes the mission-related information without requiring a manual browser refresh.


# 🎯 Threat Classification

The system currently supports three threat levels:

# 🔴 HIGH

Indicates a potentially significant threat requiring increased attention.

# 🟠 MEDIUM

Indicates a suspicious or potentially relevant situation requiring monitoring.

# 🟢 LOW

Indicates a low-risk detection requiring routine monitoring.

Threat scores are generated using object-specific threat rules and mission-level features.


# 🧠 Explainable AI

One of SentinelAI's objectives is to make the ML prediction more understandable.

Instead of displaying only:


Prediction: HIGH


the system is designed to provide information such as:


Prediction: HIGH

Confidence: 92.4%

Threat Score: 85

Top contributing factors:
- threat_score
- priority_score
- average_detection_confidence

Model:
Random Forest Classifier


This helps users understand which mission features contributed most strongly to the classification.


# 📸 Object Detection Pipeline

Upload Image
      ↓
Image Preprocessing
      ↓
YOLO Detection
      ↓
Detected Objects
      ↓
Confidence Calculation
      ↓
Threat Score
      ↓
Threat Classification
      ↓
ML Prediction
      ↓
Explainable Analysis
      ↓
Dashboard

# 📈 Dashboard Modules

SentinelAI provides a centralized dashboard containing:

# Dashboard

Overall system status and current threat information.

# Missions

Historical and latest mission information.

# Intelligence

Threat and AI-generated intelligence information.

# Analytics

Machine-learning performance and mission analytics.

# Settings

System configuration.


# 🔐 Security Considerations

The application is designed as a prototype and should not be considered a production military intelligence system.

For production deployment, additional security mechanisms would be required, including:

* Authentication
* Role-Based Access Control
* HTTPS
* Secure WebSocket connections
* API authorization
* Encryption
* Secure model storage
* Audit logging
* Input validation
* Secure database configuration


# ⚠️ Evaluation Limitation

The current ML evaluation uses only **28 labelled missions**, with 7 missions used for testing.

Therefore, the reported:

85.71% Accuracy
88.57% Precision
85.71% Recall
84.13% F1 Score


should be interpreted as **prototype evaluation results**, not evidence of production-level reliability.

A larger and more diverse dataset, cross-validation, additional real-world samples, and independent testing would be required before making stronger claims about model performance.


# 🚀 Future Enhancements

Possible future improvements include:

* Larger mission dataset
* Real-time video-stream detection
* Improved YOLO model training
* Advanced threat classification
* SHAP-based explanations
* More detailed mission reports
* Multi-user authentication
* RBAC
* Cloud deployment
* PostgreSQL/MongoDB production database
* Secure API gateway
* Model monitoring
* Continuous model evaluation
* Satellite/drone imagery integration
* Automated intelligence report generation



# 👩‍💻 Development

SentinelAI was developed as an AI/ML-based software project combining computer vision, machine learning, backend APIs, and a modern web dashboard.

The project demonstrates the integration of:

Computer Vision
       +
Machine Learning
       +
Explainable AI
       +
FastAPI
       +
React
       +
WebSockets
       +
Database
       =
SentinelAI


# 📜 Disclaimer

SentinelAI is an academic/prototype project intended for research, demonstration, and educational purposes.

It should not be used as an operational military decision-making system or as a replacement for qualified human analysis.


# ⭐ Project Summary

**SentinelAI** is an AI-powered military intelligence and threat analysis dashboard that combines YOLO-based object detection with threat scoring, Random Forest classification, explainable ML, FastAPI APIs, WebSocket-based real-time updates, and a React dashboard to provide an integrated prototype for surveillance-image analysis and threat assessment.

