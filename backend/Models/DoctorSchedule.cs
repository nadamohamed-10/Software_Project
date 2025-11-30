namespace CLINICSYSTEM.Models
{
    public class DoctorSchedule
    {
        public int ScheduleId { get; set; }
        public int DoctorId { get; set; }
        public string Day { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
