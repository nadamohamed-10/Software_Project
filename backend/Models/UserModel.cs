namespace CLINICSYSTEM.Models
{
    public class UserModel
    {
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // "Doctor" or "Patient"
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public PatientModel? PatientProfile { get; set; }
        public DoctorModel? DoctorProfile { get; set; }
    }
}

