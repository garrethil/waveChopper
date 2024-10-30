# 🎶 WaveChopper

WaveChopper is a full-stack audio manipulation application that allows users to upload `.wav` files, reorder and manipulate audio data, and manage their creations with a user-friendly interface. Users can register, log in, and save their customized audio files to their library for future access.

## 📌 Project Overview

**What**:  
WaveChopper enables users to upload, edit, and save audio files, providing both a streamlined and powerful interface for audio manipulation and a secure environment for user data.

**Why**:  
This app is designed for those interested in experimenting with audio data. Whether you’re a music enthusiast, developer, or audio engineer, WaveChopper offers a unique platform to play with sound patterns.

**How**:  
The app uses the MERN stack for fast, scalable development and includes JWT authentication for user sessions. Audio data manipulation is handled with custom byte reordering algorithms in the backend.

## 🚀 Features

- **User Authentication**: Register and log in securely to access saved creations.
- **Audio Manipulation**: Upload `.wav` files and reorder audio bytes in creative ways.
- **Library of Creations**: Save, manage, and revisit your past audio manipulations.
- **Responsive Design**: Accessible across devices with a consistent UI experience.

## 🛠️ Tech Stack

| Tech                     
| ------------------------ 
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs) 
| ![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) 
| ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb) 
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react) 
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript) 
| ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON-web-tokens) 
| ![Multer](https://img.shields.io/badge/Multer-blue?style=for-the-badge)

## 📐 Architecture and Flow

1. **Frontend (React)**: Users interact with the UI, uploading files, viewing their library, and managing account settings. React and Tailwind CSS are used to create a responsive design.
2. **Backend (Express & MongoDB)**: The backend handles file uploads, audio manipulation, and database interactions. It securely stores user data and references to uploaded files.
3. **Audio Processing**: Custom manipulation logic reorders the audio bytes as per user-selected patterns. Manipulated files are served back to the client for preview and download.

## 🔒 Authentication and Security

- **Password Hashing**: User passwords are hashed using bcrypt for secure storage.
- **JWT**: JSON Web Tokens are used for user sessions, providing a stateless and secure authentication system.
- **CORS**: Configured for allowed origins to prevent unauthorized cross-origin requests.

## 📥 Installation and Setup

To get started with WaveChopper locally:

### Prerequisites

- **Node.js**: Version 14+
- **MongoDB**: Locally or hosted (e.g., MongoDB Atlas)

### Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/waveChopper.git
   cd waveChopper
