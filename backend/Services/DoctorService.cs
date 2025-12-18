using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using CLINICSYSTEM.Data;
using CLINICSYSTEM.Data.DTOs;
using CLINICSYSTEM.Models;

namespace CLINICSYSTEM.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly ClinicDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<DoctorService> _logger;

        public DoctorService(ClinicDbContext context, IMemoryCache cache, ILogger<DoctorService> logger)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
        }

        public async Task<DoctorProfileDTO?> GetProfileAsync(int doctorId)
        {
            var cacheKey = $"doctor_profile_{doctorId}";
            
            if (_cache.TryGetValue(cacheKey, out DoctorProfileDTO? cachedProfile))
            {
                _logger.LogInformation("Retrieved doctor profile from cache for DoctorId: {DoctorId}", doctorId);
                return cachedProfile;
            }

            var doctor = await _context.Doctors
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.DoctorId == doctorId);

            if (doctor?.User == null) return null;

            var profile = new DoctorProfileDTO
            {
                DoctorId = doctor.DoctorId,
                FirstName = doctor.User.FirstName,
                LastName = doctor.User.LastName,
                Email = doctor.User.Email,
                PhoneNumber = doctor.User.PhoneNumber,
                Specialization = doctor.Specialization,
                LicenseNumber = doctor.LicenseNumber
            };

            _cache.Set(cacheKey, profile, TimeSpan.FromMinutes(30));
            _logger.LogInformation("Cached doctor profile for DoctorId: {DoctorId}", doctorId);

            return profile;
        }

        public async Task<List<DayAppointmentDTO>> GetTodayAppointmentsAsync(int doctorId)
        {
            var today = DateTime.UtcNow.Date;
            return await GetAppointmentsAsync(doctorId, today);
        }

        public async Task<List<DayAppointmentDTO>> GetAppointmentsAsync(int doctorId, DateTime date)
        {
            return await _context.Appointments
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .Include(a => a.TimeSlot)
                .Where(a => a.DoctorId == doctorId && a.TimeSlot.SlotDate.Date == date.Date)
                .OrderBy(a => a.TimeSlot.StartTime)
                .Select(a => new DayAppointmentDTO
                {
                    AppointmentId = a.AppointmentId,
                    PatientName = a.Patient.User.FirstName + " " + a.Patient.User.LastName,
                    AppointmentDate = a.TimeSlot.SlotDate,
                    StartTime = a.TimeSlot.StartTime,
                    EndTime = a.TimeSlot.EndTime,
                    Status = a.Status,
                    ReasonForVisit = a.ReasonForVisit
                })
                .ToListAsync();
        }

        public async Task<PatientRecordDetailDTO?> GetPatientRecordAsync(int patientId)
        {
            var patient = await _context.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.PatientId == patientId);

            if (patient?.User == null) return null;

            var medicalRecord = await _context.MedicalRecords
                .Where(mr => mr.PatientId == patientId)
                .OrderByDescending(mr => mr.LastUpdated)
                .FirstOrDefaultAsync();

            return new PatientRecordDetailDTO
            {
                PatientId = patient.PatientId,
                FirstName = patient.User.FirstName,
                LastName = patient.User.LastName,
                DateOfBirth = patient.DateOfBirth,
                Gender = patient.Gender,
                Allergies = medicalRecord?.Allergies,
                ChronicConditions = medicalRecord?.ChronicConditions,
                CurrentMedications = medicalRecord?.CurrentMedications,
                SurgicalHistory = medicalRecord?.SurgicalHistory,
                FamilyHistory = medicalRecord?.FamilyHistory
            };
        }

        public async Task<List<PatientSearchDTO>> SearchPatientsAsync(string searchTerm)
        {
            return await _context.Patients
                .Include(p => p.User)
                .Where(p => p.User.FirstName.Contains(searchTerm) || 
                           p.User.LastName.Contains(searchTerm) ||
                           p.User.Email.Contains(searchTerm))
                .Select(p => new PatientSearchDTO
                {
                    PatientId = p.PatientId,
                    FirstName = p.User.FirstName,
                    LastName = p.User.LastName,
                    Email = p.User.Email
                })
                .ToListAsync();
        }

        public async Task<List<MedicalImageDTO>> GetPatientMedicalImagesAsync(int patientId)
        {
            return await _context.MedicalImages
                .Where(m => m.PatientId == patientId)
                .OrderByDescending(m => m.DateUploaded)
                .Select(m => new MedicalImageDTO
                {
                    ImageId = m.ImageId,
                    ImageType = m.ImageType,
                    FileName = m.FileName,
                    DateUploaded = m.DateUploaded,
                    FileSizeBytes = m.FileSizeBytes,
                    Description = m.Description
                })
                .ToListAsync();
        }

        public async Task<bool> CreateScheduleAsync(int doctorId, CreateScheduleRequest request)
        {
            var schedule = new DoctorSchedule
            {
                DoctorId = doctorId,
                DayOfWeek = request.DayOfWeek,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                SlotDurationMinutes = request.SlotDurationMinutes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.DoctorSchedules.Add(schedule);
            await _context.SaveChangesAsync();

            // Generate time slots for this schedule
            await GenerateTimeSlotsForScheduleAsync(schedule);

            return true;
        }

        public async Task<List<DoctorScheduleDTO>> GetSchedulesAsync(int doctorId)
        {
            return await _context.DoctorSchedules
                .Where(ds => ds.DoctorId == doctorId)
                .Select(ds => new DoctorScheduleDTO
                {
                    ScheduleId = ds.ScheduleId,
                    DayOfWeek = ds.DayOfWeek,
                    StartTime = ds.StartTime,
                    EndTime = ds.EndTime,
                    SlotDurationMinutes = ds.SlotDurationMinutes
                })
                .ToListAsync();
        }

        public async Task<bool> DeleteScheduleAsync(int scheduleId)
        {
            var schedule = await _context.DoctorSchedules.FindAsync(scheduleId);
            if (schedule == null) return false;

            _context.DoctorSchedules.Remove(schedule);
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task GenerateTimeSlotsForScheduleAsync(DoctorSchedule schedule)
        {
            // Generate time slots for the next 30 days
            var startDate = DateTime.UtcNow.Date;
            var daysOfWeek = new[] { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" };
            var dayOfWeekIndex = Array.IndexOf(daysOfWeek, schedule.DayOfWeek);

            for (int i = 0; i < 30; i++)
            {
                var currentDate = startDate.AddDays(i);
                if ((int)currentDate.DayOfWeek == dayOfWeekIndex || 
                    (dayOfWeekIndex == 0 && currentDate.DayOfWeek == DayOfWeek.Monday))
                {
                    var currentTime = schedule.StartTime;

                    while (currentTime < schedule.EndTime)
                    {
                        var slot = new TimeSlotModel
                        {
                            ScheduleId = schedule.ScheduleId,
                            SlotDate = currentDate,
                            StartTime = currentTime,
                            EndTime = currentTime.Add(TimeSpan.FromMinutes(schedule.SlotDurationMinutes)),
                            Status = "Available",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };

                        _context.TimeSlots.Add(slot);
                        currentTime = currentTime.Add(TimeSpan.FromMinutes(schedule.SlotDurationMinutes));
                    }
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
