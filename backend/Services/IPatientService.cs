using CLINICSYSTEM.Data.DTOs;

namespace CLINICSYSTEM.Services
{
    public interface IPatientService
    {
        Task<PatientProfileDTO?> GetProfileAsync(int patientId);
        Task<bool> UpdateProfileAsync(int patientId, UpdatePatientProfileRequest request);
        Task<MedicalHistoryDTO?> GetMedicalHistoryAsync(int patientId);
        Task<bool> UpdateMedicalHistoryAsync(int patientId, UpdateMedicalHistoryRequest request);
        Task<List<AppointmentDTO>> GetAppointmentsAsync(int patientId);
        Task<List<PatientPrescriptionDTO>> GetPrescriptionsAsync(int patientId);
        Task<List<MedicalImageDTO>> GetMedicalImagesAsync(int patientId);
        Task<PatientConsultationHistoryDTO?> GetConsultationHistoryAsync(int patientId);
    }
}
