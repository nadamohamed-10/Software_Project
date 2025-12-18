namespace CLINICSYSTEM.Models
{
    public class MedicalImageModel
    {
        public int ImageId { get; set; }
        public int PatientId { get; set; }
        public int? ConsultationId { get; set; }
        public string ImageType { get; set; } = string.Empty; // X-ray, MRI, CT, etc.
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public DateTime DateUploaded { get; set; }
        public string? Description { get; set; }

        // Navigation properties
        public PatientModel? Patient { get; set; }
        public ConsultationModel? Consultation { get; set; }
    }
}
