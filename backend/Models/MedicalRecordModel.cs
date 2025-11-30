namespace CLINICSYSTEM.Models
{
    public class MedicalRecordModel
    {
        public int RecordId { get; set; }
        public int PatientId { get; set; }
        public int ConsultationId { get; set; }
        public string? Diagnosis { get; set; }        
        public string? Treatments { get; set; }        
        public string? Allergies { get; set; }         
        public string? ChronicConditions { get; set; } 
        public DateTime LastUpdated { get; set; }
    }
}
