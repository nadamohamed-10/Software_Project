namespace CLINICSYSTEM.Models
{
    public class AppointmentsModel
    {
        public int AppointmentId { get; set; }
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
        public int SlotId { get; set; }
        public string Status { get; set; }
        public DateTime BookedAt { get; set; }
        public DateTime? CanceledAt { get; set; }  
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }  
        public string? ReasonForVisit { get; set; } 
    }
}
