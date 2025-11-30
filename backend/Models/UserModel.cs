namespace CLINICSYSTEM.Models
{
    public class UserModel
    {
        public int user_ID { get; set; }
        public string Email { get; set; }
        public string phoneNumber { get; set; }
        public string password { get; set; }
        public string role { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }


    }
}
