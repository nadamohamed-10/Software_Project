using CLINICSYSTEM.Data.DTOs;

namespace CLINICSYSTEM.Services
{
    public interface IPatientService
    {
        Task<PatientProfileDTO?> GetProfileAsync(int userId);
        Task<bool> UpdateProfileAsync(int userId, UpdatePatientProfileRequest request);
        Task<MedicalHistoryDTO?> GetMedicalHistoryAsync(int userId);
        Task<bool> UpdateMedicalHistoryAsync(int userId, UpdateMedicalHistoryRequest request);
        Task<List<AppointmentDTO>> GetAppointmentsAsync(int userId);
        Task<List<PatientPrescriptionDTO>> GetPrescriptionsAsync(int userId);
        Task<List<MedicalImageDTO>> GetMedicalImagesAsync(int userId);
        Task<PatientConsultationHistoryDTO?> GetConsultationHistoryAsync(int userId);
    }
}
