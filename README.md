# 🧯 FireGuard — Fire & Smoke Early Warning System

FireGuard is a modern, full-stack, AI-powered early warning system designed for real-time fire and smoke detection and environmental safety monitoring. By combining state-of-the-art computer vision (YOLOv8) with active environmental sensor telemetry, FireGuard provides instant visual alerts and telemetry tracking to mitigate hazards early.

---

## 👥 The Team & Roles

| GitHub Username | Role | Responsibility |
| :--- | :--- | :--- |
| [mohamedh9sham](https://github.com/mohamedh9sham) | **Team Lead** | Project management, system architecture, and overall coordination. |
| [Mahm0ud-1](https://github.com/Mahm0ud-1) | **ML Engineer** | Training, optimizing, and deploying the YOLOv8 model for smoke & fire detection. |
| [adelyousef278-cyber](https://github.com/adelyousef278-cyber) | **Backend Developer** | Designing secure and efficient FastAPI services and core system endpoints. |
| [Stars36](https://github.com/Stars36) | **Backend Developer** | Developing backend logic, image-saving pipelines, and integrating detector metrics. |
| [BahaaAlna](https://github.com/BahaaAlna) | **Frontend & DevOps** | Creating front-end layouts, component structure, CI/CD pipeline, and deployment. |
| [devElyas](https://github.com/devElyas) | **Frontend Developer** | Coding the live camera stream viewer, stats logger, and interactive UI components. |
| [islam-3](https://github.com/islam-3) | **UI / UX Designer** | Crafting premium aesthetics, design tokens, color palette, and user flows. |
| [balckBird1to](https://github.com/blackBird1to) | **Documentation & Testing** | Creating high-quality project documentation, test scripts, and system validation. |

---

## 🏗️ System Architecture

- **Frontend**: Built using React, Vite, Tailwind CSS, Lucide icons, and Chart.js.
- **Backend API**: Engineered using Python and FastAPI, running on Uvicorn.
- **Computer Vision**: Powered by an Ultralytics YOLOv8 object detection model fine-tuned for fire and smoke.

---

## ✨ Features

- **Live Camera AI Detection**: Captures real-time camera frames and performs object detection with annotated bounding boxes showing class (Fire/Smoke) and confidence score.
- **Telemetry Visualizations**: Graphical monitors tracking potential danger factors like Temperature (°C), Gas Concentration (PPM), Smoke level, and Flame sensors.
- **Annotated Snapshot Downloads**: One-click download of the annotated frames capturing active alerts.
- **Hardware Integrations Ready**: Easily plug-in real IoT devices (ESP32 / Raspberry Pi) in place of simulated sensors.

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js v18+

### 2. Backend Installation & Startup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

### 3. Frontend Installation & Startup
```bash
# Navigate to frontend directory
cd frontend

# Install packages
npm install

# Start the Vite development server
npm run dev
```
The application UI will be available at `http://localhost:5173`.
