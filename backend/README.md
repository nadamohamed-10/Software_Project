# Clinic Information System - Backend API

A comprehensive ASP.NET Core 8.0 Web API for clinic management, designed for real-world deployment in collaboration with orthopedic specialist Dr. Ahmed Nabil.

## 🏥 Overview

This backend API provides a complete clinic management system with:
- Patient and doctor management
- Appointment scheduling and management
- Medical consultations with note-taking
- Prescription management with PDF generation
- Medical image upload and storage
- Real-time notifications
- Comprehensive security and audit logging

## � Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Deployment](#deployment)

## ✨ Features

### For Patients
- ✅ Register and manage profile
- ✅ Manage medical history
- ✅ Book, reschedule, and cancel appointments
- ✅ View prescriptions with PDF download
- ✅ Upload medical images (X-rays, MRIs)
- ✅ View consultation history

### For Doctors
- ✅ View daily appointments
- ✅ Start and manage consultations
- ✅ Search patient records
- ✅ View patient medical images
- ✅ Create prescriptions (single or bulk)
- ✅ Generate prescription PDFs
- ✅ Manage schedules

### Technical Features
- ✅ JWT Authentication
- ✅ Role-based Authorization
- ✅ Input Validation
- ✅ Rate Limiting
- ✅ Error Handling
- ✅ Audit Logging
- ✅ Performance Caching
- ✅ PDF Generation
- ✅ File Upload Management

## 🛠️ Technology Stack

- **Framework**: ASP.NET Core 8.0
- **Database**: SQL Server with Entity Framework Core 8.0
- **Authentication**: ASP.NET Core Identity + JWT
- **PDF Generation**: QuestPDF
- **Logging**: Serilog
- **API Documentation**: Swagger/OpenAPI
- **Caching**: In-Memory Cache
- **Security**: Rate Limiting, HTTPS/TLS

## 🏁 Getting Started

### Prerequisites

- .NET 8.0 SDK
- SQL Server (Express or Full)
- Visual Studio 2022 or VS Code (optional)

### Installation

1. **Clone the repository**
   ```powershell
   git clone <repository-url>
   cd backend
   ```

2. **Restore packages**
   ```powershell
   dotnet restore
   ```

3. **Configure database**
   Update `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=.;Database=ClinicSystemDb;Trusted_Connection=True;Encrypt=false;"
   }
   ```

4. **Create database**
   ```powershell
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

5. **Run the application**
   ```powershell
   dotnet run
   ```

6. **Access Swagger UI**
   Navigate to: https://localhost:5001/swagger

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](QUICKSTART.md) | 5-minute quick start guide |
| [SETUP.md](SETUP.md) | Detailed setup instructions |
| [API_TESTING.md](API_TESTING.md) | API testing guide with examples |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment guide |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Complete feature list and architecture |

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile

### Patient Endpoints
- `GET /api/patients/profile` - Get patient profile
- `PUT /api/patients/profile` - Update patient profile
- `GET /api/patients/medical-history` - Get medical history
- `PUT /api/patients/medical-history` - Update medical history
- `GET /api/patients/appointments` - Get patient appointments
- `GET /api/patients/prescriptions` - Get patient prescriptions
- `GET /api/patients/medical-images` - Get patient medical images

### Doctor Endpoints
- `GET /api/doctors/profile` - Get doctor profile
- `GET /api/doctors/appointments/today` - Get today's appointments
- `GET /api/doctors/patients/{id}` - Get patient record
- `GET /api/doctors/patients/search` - Search patients
- `POST /api/doctors/schedule` - Create schedule
- `GET /api/doctors/schedule` - Get schedules

### Appointment Endpoints
- `GET /api/appointments/available-slots` - Get available time slots
- `POST /api/appointments/book` - Book appointment
- `PUT /api/appointments/reschedule` - Reschedule appointment
- `PUT /api/appointments/cancel` - Cancel appointment

### Consultation Endpoints
- `POST /api/consultations/start` - Start consultation
- `PUT /api/consultations/{id}` - Update consultation
- `PUT /api/consultations/{id}/end` - End consultation
- `GET /api/consultations/{id}` - Get consultation details

### Prescription Endpoints
- `POST /api/prescriptions` - Create prescription
- `POST /api/prescriptions/bulk` - Create bulk prescriptions
- `GET /api/prescriptions/{id}` - Get prescription details
- `GET /api/prescriptions/{id}/pdf` - Generate prescription PDF

### Medical Image Endpoints
- `POST /api/medical-images/upload` - Upload medical image
- `GET /api/medical-images` - Get patient images
- `GET /api/medical-images/{id}/download` - Download image
- `DELETE /api/medical-images/{id}` - Delete image

### Notification Endpoints
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark notification as read
- `DELETE /api/notifications/{id}` - Delete notification

## 🔒 Security

### Authentication & Authorization
- JWT Bearer token authentication
- Role-based access control (Doctor/Patient)
- Token expiration: 24 hours (configurable)

### Data Protection
- HTTPS/TLS encryption enforced
- Sensitive data encrypted at rest
- SQL injection prevention via EF Core
- XSS protection enabled
- CSRF protection for sensitive operations

### Rate Limiting
- 100 requests per minute per user (configurable)
- Prevents abuse and DDoS attacks

### Input Validation
- All DTOs validated with DataAnnotations
- File upload validation (size and type)
- Custom validation attributes

### Audit Logging
- All security-critical actions logged
- Serilog structured logging
- Log retention and rotation

## 📊 Database Schema

Key entities:
- **Users** - Base user authentication
- **Patients** - Patient profiles and medical data
- **Doctors** - Doctor profiles and schedules
- **Appointments** - Appointment records
- **Consultations** - Consultation details
- **Prescriptions** - Medication prescriptions
- **MedicalRecords** - Patient medical history
- **MedicalImages** - Uploaded medical images
- **Notifications** - User notifications

## 🚢 Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for detailed deployment instructions for:
- IIS
- Azure App Service
- Docker
- Linux servers

### Environment Variables

For production, set these environment variables:
```powershell
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=<your-connection-string>
JwtSettings__SecretKey=<your-secret-key>
```

## 🧪 Testing

### Using Swagger UI
1. Navigate to https://localhost:5001/swagger
2. Register a user via `/api/auth/register`
3. Login via `/api/auth/login` to get token
4. Click "Authorize" and enter: `Bearer {token}`
5. Test protected endpoints

### Using PowerShell
See **[API_TESTING.md](API_TESTING.md)** for sample PowerShell scripts.

## 📈 Performance

- Asynchronous operations throughout
- Memory caching for frequently accessed data
- Optimized database queries
- Connection pooling enabled
- Response compression ready

## 🔧 Configuration

### appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=ClinicSystemDb;Trusted_Connection=True;Encrypt=false;"
  },
  "JwtSettings": {
    "SecretKey": "YourSecretKey",
    "ExpirationMinutes": 1440
  }
}
```

### Rate Limiting
Configure in Program.cs:
```csharp
PermitLimit = 100,
Window = TimeSpan.FromMinutes(1)
```

## 📝 Logging

Logs are stored in `backend/logs/` directory:
- Format: `clinic-api-YYYYMMDD.txt`
- Rolling interval: Daily
- Includes: Errors, warnings, information, and audit trails

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

[Specify your license]

## 👥 Team

- Development Team: [Your team]
- Medical Advisor: Dr. Ahmed Nabil (Orthopedic Specialist)

## 📞 Support

- Documentation: See documentation files in `backend/`
- Issues: [Your issue tracker]
- Email: [Your support email]

## 🎯 Roadmap

### Completed ✅
- All core features implemented
- Security hardening complete
- Performance optimization done
- Documentation complete

### Future Enhancements
- [ ] Email/SMS notifications
- [ ] Payment gateway integration
- [ ] Real-time updates with SignalR
- [ ] Advanced reporting and analytics
- [ ] DICOM support for medical imaging
- [ ] Multi-language support
- [ ] Mobile app push notifications

## 🙏 Acknowledgments

- ASP.NET Core Team
- Entity Framework Core Team
- QuestPDF Library
- Serilog Community
- Dr. Ahmed Nabil for medical consultation

---

**Built with ❤️ for better healthcare management**
