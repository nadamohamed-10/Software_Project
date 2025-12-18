namespace CLINICSYSTEM.Models
{
    public class MedicalRecordModel
    {
        public int RecordId { get; set; }
        public int PatientId { get; set; }
        public int? ConsultationId { get; set; }
        public string? Allergies { get; set; }
        public string? ChronicConditions { get; set; }
        public string? CurrentMedications { get; set; }
        public string? SurgicalHistory { get; set; }
        public string? FamilyHistory { get; set; }
        public DateTime LastUpdated { get; set; }

        // Navigation properties
        public PatientModel? Patient { get; set; }
        public ConsultationModel? Consultation { get; set; }
    }
}
