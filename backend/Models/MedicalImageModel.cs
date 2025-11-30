namespace CLINICSYSTEM.Models
{
    public class MedicalImageModel
    {
        public int ImageId { get; set; }
        public int PatientId { get; set; }
        public int? ConsultationId { get; set; }  
        public string ImageType { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public DateTime DateUploaded { get; set; }
    }
}
