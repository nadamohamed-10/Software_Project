namespace CLINICSYSTEM.Constants;

/// <summary>
/// Application-wide constants
/// </summary>
public static class AppConstants
{
    /// <summary>
    /// JWT token configuration constants
    /// </summary>
    public static class JwtSettings
    {
        public const int AccessTokenExpirationMinutes = 60;
        public const int RefreshTokenExpirationDays = 7;
        public const string Issuer = "ClinicSystemAPI";
        public const string Audience = "ClinicSystemClient";
    }

    /// <summary>
    /// Appointment-related constants
    /// </summary>
    public static class Appointments
    {
        public const int DefaultAppointmentDurationMinutes = 30;
        public const int MaxAppointmentsPerDay = 20;
        public const int MinutesBeforeCancellation = 60; // 1 hour
        public const int MinutesBeforeRescheduling = 120; // 2 hours
        public const int AppointmentReminderHours = 24;
    }

    /// <summary>
    /// Consultation-related constants
    /// </summary>
    public static class Consultations
    {
        public const int MaxConsultationDurationMinutes = 120;
        public const int MinConsultationDurationMinutes = 10;
    }

    /// <summary>
    /// Prescription-related constants
    /// </summary>
    public static class Prescriptions
    {
        public const int MaxMedicationsPerPrescription = 10;
        public const int PrescriptionValidityDays = 30;
        public const int MaxInstructionsLength = 1000;
    }

    /// <summary>
    /// Caching constants
    /// </summary>
    public static class Cache
    {
        public const int DefaultCacheDurationMinutes = 30;
        public const int DoctorProfileCacheDurationMinutes = 30;
        public const int PatientProfileCacheDurationMinutes = 30;
        public const int AppointmentsCacheDurationMinutes = 5;
        
        public const string DoctorProfileKeyPrefix = "doctor_profile_";
        public const string PatientProfileKeyPrefix = "patient_profile_";
        public const string AppointmentsKeyPrefix = "appointments_";
    }

    /// <summary>
    /// Pagination constants
    /// </summary>
    public static class Pagination
    {
        public const int DefaultPageSize = 10;
        public const int MaxPageSize = 100;
        public const int MinPageSize = 1;
    }

    /// <summary>
    /// Date and time constants
    /// </summary>
    public static class DateTime
    {
        public const string DateFormat = "yyyy-MM-dd";
        public const string TimeFormat = "HH:mm";
        public const string DateTimeFormat = "yyyy-MM-dd HH:mm:ss";
        public const string EgyptTimeZoneId = "Egypt Standard Time";
    }

    /// <summary>
    /// User-related constants
    /// </summary>
    public static class Users
    {
        public const int MinPasswordLength = 8;
        public const int MaxPasswordLength = 100;
        public const int MaxLoginAttempts = 5;
        public const int LockoutDurationMinutes = 15;
    }
}
