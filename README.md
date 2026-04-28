# VaxSafe 🛡️

**Cold Chain Intelligence Platform**

VaxSafe is a self-healing, trust-aware cold chain intelligence platform that predicts disruptions and dynamically reconfigures vaccine delivery routes to prevent spoilage and delays.

VaxSafe is a comprehensive vaccine cold chain logistics platform designed to ensure vaccines are transported and stored within safe temperature ranges (2–8°C). The platform provides real-time monitoring, digital twin simulation, route optimization, anomaly detection, and an immutable blockchain audit trail.

This repository contains the interactive frontend web application, built as a robust demonstration of the platform's capabilities across six deployment phases from foundational simulation to market-readiness.

## ✨ Key Features
- **Adaptive Intelligence Layer:** Combines anomaly detection and route optimization to detect disruptions, evaluate node reliability (trust), and dynamically reroute shipments to maintain cold chain integrity.
- **Command Center Dashboard:** An interactive overview of the entire operation featuring KPI scorecards, live temperature streams, and multi-dimensional reliability tracking.
- **Digital Twin Simulation:** Interactive SVG network graph of 25 cold chain nodes visualizing route flows, node capacities, and simulated status disruptions.
- **Route Optimizer:** Compare legacy routes with RL-optimized paths directly on a Leaflet map, visualizing predicted improvements in transit times and risk reduction.
- **Fleet Monitor:** Detailed real-time tracking of 20 simulated vehicles, complete with battery and signal stats, individual temperature profiles, and progress indicators.
- **Anomaly Detection:** AI-driven alerts log identifying temperature excursions and predictive spoilage risks using static thresholds and simulated machine learning patterns.
- **Blockchain Audit Trail:** An immutable block explorer interface representing chain-of-custody transfer logs, ensuring complete compliance transparency.
- **Driver App:** A responsive, mobile-first view featuring turn-by-turn tracking, delivery checklists, and prominent safe-temperature indicators.
- **Project Roadmap:** A visually engaging step-by-step flowchart of the 6 core development phases to transform the MVP into a market-ready platform.

## 🛠️ Technology Stack

- **Framework:** React 19, Vite 8
- **Routing:** React Router v7
- **Styling:** Custom Vanilla CSS (Premium dark theme, glassmorphism UI)
- **Data Visualization:** Recharts, custom SVGs
- **Mapping:** React Leaflet
- **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/sm-28601/VaxSafe.git
   cd VaxSafe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5175/` (or the port specified in your terminal).

## 🗂️ Project Structure
- `src/components/`: Reusable UI components (Sidebar, Charts, Cards)
- `src/pages/`: The 8 core interactive views
- `src/data/`: Data generators creating realistic streams for nodes, routes, sensors, and alerts.
- `src/hooks/`: Custom React hooks, including `useSensorStream` for simulating real-time telemetry.
- `src/utils/`: Constants, layout thresholds, and formatting helpers.

## 💡 Note on Data
Currently, the application runs entirely on the client side using sophisticated simulated data streams (found in `src/data/`) to emulate real-world IoT telemetry continuously pushing temperature and GPS updates. 

*Designed and engineered as a market-ready conceptual build.*
