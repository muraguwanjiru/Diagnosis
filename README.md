# Diagnosis

**Diagnos** is an advanced clinical decision-support system designed to serve as a secondary validation tool for neuroradiologists classifying brain MRIs. By integrating computer vision into the clinical workflow, Diagnos acts as an automated safety net to reduce diagnostic fatigue, minimize cognitive bias, and enhance patient diagnostic accuracy.

## System Architecture Overview

The platform is structured within an Nx Monorepo to maintain isolation and scalability between layers:

*   **Frontend Workspace:** A responsive, dark-mode React application providing an intuitive clinical canvas. It enables seamless drag-and-drop file staging, image manipulation, and visual telemetry mapping for AI confidence vectors.
*   **Backend Workspace:** A highly responsive Python application built with FastAPI. It manages asynchronous file pipelines, interfaces with a containerized PostgreSQL persistence layer, and serves deep-learning inferences.
*   **AI Engine:** A custom-engineered DenseNet-121 deep neural network trained on a high-fidelity multi-class imaging dataset.

##  Clinical Capabilities

The core model classifies structural pathographies across four specific anatomical states:
*   **Gliomas:** Primary brain tumors originating within the glial cells.
*   **Meningiomas:** Typically benign tumors arising from the meningeal layers protecting the central nervous system.
*   **Pituitary Tumors:** Abnormal growths developing inside the pituitary gland pouch.
*   **Normal Anatomy:** Brain architecture showing no clear indicators of neoplastic processes.

##  Tech Stack & Software Frameworks

### Core Stack
*   **Monorepo Engine:** Nx Workspace Tools
*   **UI Architecture:** React / Tailwind CSS
*   **Application Server:** Python FastAPI / Uvicorn Server Engine
*   **Database Engine:** PostgreSQL 15 Running inside Docker Containers
*   **ORM Middleware:** SQLAlchemy Database Client
*   **Model Framework:** PyTorch / Core Computer Vision Architecture

### Clean Architectural Design Patterns
To achieve strict separation of concerns, the backend codebase operates across decoupled architectural modules:
1.  **Routers:** Pure traffic controllers handling network boundaries and request schemas.
2.  **Services:** The orchestration hub enforcing medical validation and business rules.
3.  **Repositories:** Isolated, transaction-safe database query contexts.
4.  **Core Component:** Central operational layer managing system variables and JWT infrastructure.

##  Security & Data Compliance Framework

*   **Anonymization Constraints:** Designed with HIPAA-aware principles to filter demographic tracking structures.
*   **Authentication Pipeline:** Managed via encrypted stateless JSON Web Tokens (JWT) using secure `HS256` hashing mechanics.
*   **Decoupled Variables:** System variables, tokens, and cryptographic keys are isolated inside an explicit environment layer (`.env`) to eliminate vulnerabilities.

##  Regulatory Disclaimer
Diagnos is configured strictly as a Class II decision-support tool to supply secondary confirmation overlays. It does not replace independent clinical judgment or primary diagnostic evaluations by certified medical practitioners.# Diagnos
