<div align="center">
  <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000&auto=format&fit=crop" alt="RescueForce Hero" width="100%" style="border-radius: 20px; object-fit: cover; max-height: 300px; margin-bottom: 20px;" />

  <h1>🐾 RescueForce</h1>
  <p><strong>Next-Generation Pet Rescue & Emergency Response Platform</strong></p>

  <p>
    <a href="https://rescue-force-app.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
    <img src="https://img.shields.io/badge/GSAP-Animations-88CE02?style=for-the-badge&logo=greensock" alt="GSAP" />
    <img src="https://img.shields.io/badge/Aiven-MySQL-blue?style=for-the-badge&logo=mysql" alt="MySQL" />
  </p>
</div>
---
## 🌟 Overview

RescueForce is a full-stack web application designed to connect rescue centers, volunteers, and adoptive families. It leverages cutting-edge web technologies to deliver a cinematic experience, replacing boring web forms with interactive 3D galleries, real-time interactive mapping, and smooth GSAP/Framer Motion transitions.

## 🚀 Key Features
*   **🌍 Live Emergency Radar:** Built-in `Leaflet` maps that automatically ping the user's GPS location via the Browser Geolocation API and instantly Reverse-Geocode the coordinates into a street address for rapid emergency deployment.
*   **🐶 3D Animal Gallery:** Interactive 3D scrolling galleries utilizing `framer-motion` to showcase animals looking for their forever homes.
*   **⚡ 100% Serverless Backend:** Fully migrated from traditional PHP to blazingly fast Next.js Serverless Route Handlers (`/api/animals`, `/api/submit-report`).
*   **🗄️ Enterprise Database:** Powered by a highly-available, secure Aiven MySQL cloud database.

## 🛠️ Tech Stack

| Category         | Technology                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| **Frontend**     | Next.js (App Router), React 18, TypeScript, Tailwind CSS, Lucide React                                        |
| **Animations**   | GSAP (ScrollTrigger), Framer Motion, hls.js (Video Streaming)                                                 |
| **Mapping**      | Leaflet, React-Leaflet, OpenStreetMap (Nominatim API)                                                         |
| **Backend**      | Next.js Serverless APIs (`mysql2` connection pooling)                                                         |
| **Database**     | Aiven Cloud MySQL                                                                                             |
| **Deployment**   | Vercel (Frontend & Serverless Functions)                                                                      |

## 🗺️ Application Architecture

1.  **`/` (Home):** The interactive gallery showcasing animals currently up for adoption.
2.  **`/adopt`:** A premium application form with a masonry grid of past "Success Stories".
3.  **`/report`:** The "Command Center". An interface featuring the auto-tracking Leaflet map and CSS-animated emergency beacons.
4.  **`/admin`:** A secure, sleek data dashboard featuring animated stat counters and live incident feeds for rescue coordinators.

## 💻 Local Development Setup

To run RescueForce on your local machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/rescueforce.git
cd rescueforce/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your Aiven MySQL credentials:
```env
DB_HOST=your-aiven-host.aivencloud.com
DB_USER=avnadmin
DB_PASS=your-secure-password
DB_NAME=defaultdb
DB_PORT=20159
```

### 4. Start the development server
```bash
npm run dev
```

Your application will now be running on `http://localhost:3000`.

## 🎨 Design System

RescueForce utilizes a strictly enforced dark-theme aesthetic designed to evoke both urgency (in emergencies) and warmth (in adoptions).
*   **Primary Fonts:** `Inter` (Sans-serif) and `Instrument Serif` (Italics for elegant headings).
*   **Animations:** Extensive use of CSS `@keyframes` (e.g., `gradient-shift`, `role-fade-in`) paired with GSAP ScrollTriggers.

---

<div align="center">
  <p>Built with ❤️ by Maescoders to help animals find their forever homes.</p>
</div>
