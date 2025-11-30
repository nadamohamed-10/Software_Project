namespace CLINICSYSTEM.Models
{
    public class TimeSlotModel
    {
        public int SlotId { get; set; }
        public int ScheduleId { get; set; }
        public DateTime SlotDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
