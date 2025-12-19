# Clinic Information System

A full-stack clinic management system that enables patients to book and manage appointments, while doctors can manage their schedules, view consultations, access medical records, and provide comprehensive care through a dedicated dashboard.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [CI/CD](#cicd)
- [Production / GitHub Link](#production--github-link)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview
This project is a **Clinic Information System** with role-based functionality:  
- **Patients** can register, login, view available doctors, book, reschedule, or cancel appointments, and access their medical records.  
- **Doctors** can manage schedules, view upcoming consultations, access patient medical histories, and provide care using a dedicated dashboard.  

The backend is built with **ASP.NET Core Web API**, providing secure RESTful endpoints with **JWT authentication**.  
The frontend is built using **React Native** for mobile devices.

---

## Features
### Patient Features:
- Signup / login / JWT-based authentication
- View available doctors and appointment slots
- Book, reschedule, or cancel appointments
- Access personal medical records
- View consultation history

### Doctor Features:
- Manage availability and schedules
- View upcoming patient appointments
- Access patient consultations and medical records
- Dashboard to monitor clinic activities

### General Features:
- Role-based access control (Doctor / Patient)
- Global exception handling & logging with Serilog
- Rate limiting to prevent API abuse
- API documentation via Swagger/OpenAPI

---

## Technologies Used
- **Frontend:** React Native  
- **Backend:** ASP.NET Core 8  
- **Authentication:** JWT, ASP.NET Identity  
- **Database:** SQLite (EF Core)  
- **API Documentation:** Swagger/OpenAPI  
- **Validation:** FluentValidation    
- **CI/CD:** GitHub Actions  

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/nadamohamed-10/Software_Project.git
cd Software_Project
