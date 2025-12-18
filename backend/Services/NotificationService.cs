using Microsoft.EntityFrameworkCore;
using CLINICSYSTEM.Data;
using CLINICSYSTEM.Data.DTOs;
using CLINICSYSTEM.Models;

namespace CLINICSYSTEM.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ClinicDbContext _context;

        public NotificationService(ClinicDbContext context)
        {
            _context = context;
        }

        public async Task<NotificationDTO?> CreateNotificationAsync(int userId, CreateNotificationRequest request)
        {
            var notification = new NotificationModel
            {
                UserId = userId,
                Title = request.Title,
                Message = request.Message,
                Type = request.Type,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return new NotificationDTO
            {
                NotificationId = notification.NotificationId,
                Title = notification.Title,
                Message = notification.Message,
                Type = notification.Type,
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt
            };
        }

        public async Task<List<NotificationDTO>> GetUserNotificationsAsync(int userId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NotificationDTO
                {
                    NotificationId = n.NotificationId,
                    Title = n.Title,
                    Message = n.Message,
                    Type = n.Type,
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<bool> MarkAsReadAsync(int notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification == null) return false;

            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;

            _context.Notifications.Update(notification);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteNotificationAsync(int notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification == null) return false;

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task SendAppointmentReminderAsync(int appointmentId)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                .Include(a => a.TimeSlot)
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);

            if (appointment?.Patient?.User == null || appointment.Doctor?.User == null) return;

            // Send reminder to patient
            await CreateNotificationAsync(appointment.Patient.User.UserId, new CreateNotificationRequest
            {
                Title = "Appointment Reminder",
                Message = $"Your appointment with Dr. {appointment.Doctor.User.FirstName} is on {appointment.TimeSlot.SlotDate:MMM dd, yyyy} at {appointment.TimeSlot.StartTime:HH:mm}",
                Type = "Appointment"
            });
        }
    }
}
