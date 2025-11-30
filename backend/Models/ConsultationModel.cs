namespace CLINICSYSTEM.Models
{
    public class ConsultationModel
    {
        public int ConsultationId { get; set; }
        public int AppointmentId { get; set; }
        public DateTime ConsultationDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }    
        public string? Notes { get; set; }         
        public string? Symptoms { get; set; }      
        public string? Diagnosis { get; set; }
    }
}
