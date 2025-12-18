using Microsoft.EntityFrameworkCore;
using CLINICSYSTEM.Data;
using CLINICSYSTEM.Data.DTOs;
using CLINICSYSTEM.Models;

namespace CLINICSYSTEM.Services
{
    public class PatientService : IPatientService
    {
        private readonly ClinicDbContext _context;

        public PatientService(ClinicDbContext context)
        {
            _context = context;
        }

        public async Task<PatientProfileDTO?> GetProfileAsync(int patientId)
        {
            var patient = await _context.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.PatientId == patientId);

            if (patient?.User == null) return null;

            return new PatientProfileDTO
            {
                PatientId = patient.PatientId,
                FirstName = patient.User.FirstName,
                LastName = patient.User.LastName,
                Email = patient.User.Email,
                PhoneNumber = patient.User.PhoneNumber,
                Gender = patient.Gender,
                Address = patient.Address,
                EmergencyContact = patient.EmergencyContact,
                DateOfBirth = patient.DateOfBirth
            };
        }

        public async Task<bool> UpdateProfileAsync(int patientId, UpdatePatientProfileRequest request)
        {
            var patient = await _context.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.PatientId == patientId);

            if (patient == null) return false;

            patient.Gender = request.Gender;
            patient.Address = request.Address;
            patient.EmergencyContact = request.EmergencyContact;
            patient.UpdatedAt = DateTime.UtcNow;

            if (patient.User != null)
            {
                patient.User.FirstName = request.FirstName;
                patient.User.LastName = request.LastName;
                patient.User.PhoneNumber = request.PhoneNumber;
                patient.User.UpdatedAt = DateTime.UtcNow;
            }

            _context.Patients.Update(patient);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<MedicalHistoryDTO?> GetMedicalHistoryAsync(int patientId)
        {
            var record = await _context.MedicalRecords
                .Where(r => r.PatientId == patientId)
                .OrderByDescending(r => r.LastUpdated)
                .FirstOrDefaultAsync();

            if (record == null) return null;

            return new MedicalHistoryDTO
            {
                Allergies = record.Allergies,
                ChronicConditions = record.ChronicConditions,
                CurrentMedications = record.CurrentMedications,
                SurgicalHistory = record.SurgicalHistory,
                FamilyHistory = record.FamilyHistory
            };
        }

        public async Task<bool> UpdateMedicalHistoryAsync(int patientId, UpdateMedicalHistoryRequest request)
        {
            var record = await _context.MedicalRecords
                .FirstOrDefaultAsync(r => r.PatientId == patientId);

            if (record == null)
            {
                record = new MedicalRecordModel
                {
                    PatientId = patientId,
                    LastUpdated = DateTime.UtcNow
                };
                _context.MedicalRecords.Add(record);
            }
            else
            {
                record.LastUpdated = DateTime.UtcNow;
            }

            record.Allergies = request.Allergies;
            record.ChronicConditions = request.ChronicConditions;
            record.CurrentMedications = request.CurrentMedications;
            record.SurgicalHistory = request.SurgicalHistory;
            record.FamilyHistory = request.FamilyHistory;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<AppointmentDTO>> GetAppointmentsAsync(int patientId)
        {
            return await _context.Appointments
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                .Include(a => a.TimeSlot)
                .Where(a => a.PatientId == patientId)
                .OrderByDescending(a => a.TimeSlot.SlotDate)
                .Select(a => new AppointmentDTO
                {
                    AppointmentId = a.AppointmentId,
                    DoctorName = a.Doctor.User.FirstName + " " + a.Doctor.User.LastName,
                    PatientName = "",
                    AppointmentDate = a.TimeSlot.SlotDate,
                    StartTime = a.TimeSlot.StartTime,
                    EndTime = a.TimeSlot.EndTime,
                    Status = a.Status,
                    ReasonForVisit = a.ReasonForVisit
                })
                .ToListAsync();
        }

        public async Task<List<PatientPrescriptionDTO>> GetPrescriptionsAsync(int patientId)
        {
            return await _context.Prescriptions
                .Include(p => p.Consultation)
                    .ThenInclude(c => c.Appointment)
                .Where(p => p.Consultation.Appointment.PatientId == patientId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new PatientPrescriptionDTO
                {
                    PrescriptionId = p.PrescriptionId,
                    DateIssued = p.CreatedAt,
                    MedicationName = p.MedicationName,
                    Dosage = p.Dosage,
                    Frequency = p.Frequency,
                    DurationDays = p.DurationDays,
                    Status = p.Status
                })
                .ToListAsync();
        }

        public async Task<List<MedicalImageDTO>> GetMedicalImagesAsync(int patientId)
        {
            return await _context.MedicalImages
                .Where(m => m.PatientId == patientId)
                .OrderByDescending(m => m.DateUploaded)
                .Select(m => new MedicalImageDTO
                {
                    ImageId = m.ImageId,
                    ImageType = m.ImageType,
                    FileName = m.FileName,
                    DateUploaded = m.DateUploaded,
                    FileSizeBytes = m.FileSizeBytes,
                    Description = m.Description
                })
                .ToListAsync();
        }

        public async Task<PatientConsultationHistoryDTO?> GetConsultationHistoryAsync(int patientId)
        {
            var consultation = await _context.Consultations
                .Include(c => c.Appointment)
                    .ThenInclude(a => a.Doctor)
                        .ThenInclude(d => d.User)
                .Where(c => c.Appointment.PatientId == patientId && c.Status == "Completed")
                .OrderByDescending(c => c.ConsultationDate)
                .FirstOrDefaultAsync();

            if (consultation == null) return null;

            return new PatientConsultationHistoryDTO
            {
                ConsultationId = consultation.ConsultationId,
                ConsultationDate = consultation.ConsultationDate,
                DoctorName = consultation.Appointment.Doctor.User.FirstName + " " + consultation.Appointment.Doctor.User.LastName,
                Diagnosis = consultation.Diagnosis,
                Notes = consultation.Notes
            };
        }
    }
}
