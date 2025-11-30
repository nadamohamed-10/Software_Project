namespace CLINICSYSTEM.Models
{
    public class PatientModel
    {
        public int patient_ID { get; set; }
        public int user_ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string? Emergency_contact { get; set; }
        public DateTime Date_Of_Birth { get; set; }

    }
}
