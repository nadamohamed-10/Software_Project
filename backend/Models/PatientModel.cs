namespace CLINICSYSTEM.Models
{
    public class PatientModel
    {
        public int PatientId { get; set; }
        public int UserId { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string? EmergencyContact { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation properties
        public UserModel? User { get; set; }
        public ICollection<AppointmentModel>? Appointments { get; set; }
        public ICollection<MedicalRecordModel>? MedicalRecords { get; set; }
        public ICollection<MedicalImageModel>? MedicalImages { get; set; }
    }
}
