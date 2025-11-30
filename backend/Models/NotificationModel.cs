namespace CLINICSYSTEM.Models
{
    public class NotificationModel
    {
        public int NotificationId { get; set; }
        public int PatientId { get; set; }
        public int? AppointmentId { get; set; }     
        public int? ConsultationId { get; set; }   
        public DateTime SendDateTime { get; set; }
        public bool IsRead { get; set; }         
        public DateTime CreatedAt { get; set; }
    }
}
