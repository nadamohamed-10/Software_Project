using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CLINICSYSTEM.Data.DTOs;
using CLINICSYSTEM.Services;

namespace CLINICSYSTEM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Doctor")]
    public class DoctorsController : ControllerBase
    {
        private readonly IDoctorService _doctorService;

        public DoctorsController(IDoctorService doctorService)
        {
            _doctorService = doctorService;
        }

        private int GetDoctorId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null && int.TryParse(userIdClaim.Value, out var id) ? id : 0;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetDoctorId();
            if (userId == 0) return Unauthorized();

            var profile = await _doctorService.GetProfileAsync(userId);
            if (profile == null) return NotFound();

            return Ok(profile);
        }

        [HttpGet("appointments/today")]
        public async Task<IActionResult> GetTodayAppointments()
        {
            var userId = GetDoctorId();
            if (userId == 0) return Unauthorized();

            var appointments = await _doctorService.GetTodayAppointmentsAsync(userId);
            return Ok(appointments);
        }

        [HttpGet("appointments")]
        public async Task<IActionResult> GetAppointments([FromQuery] DateTime date)
        {
            var userId = GetDoctorId();
            if (userId == 0) return Unauthorized();

            if (date == DateTime.MinValue) date = DateTime.UtcNow.Date;

            var appointments = await _doctorService.GetAppointmentsAsync(userId, date);
            return Ok(appointments);
        }

        [HttpGet("patients/{patientId}")]
        public async Task<IActionResult> GetPatientRecord([FromRoute] int patientId)
        {
            var record = await _doctorService.GetPatientRecordAsync(patientId);
            if (record == null) return NotFound();

            return Ok(record);
        }

        [HttpGet("patients/search")]
        public async Task<IActionResult> SearchPatients([FromQuery] string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
                return BadRequest("Search term is required");

            var patients = await _doctorService.SearchPatientsAsync(searchTerm);
            return Ok(patients);
        }

        [HttpGet("patients/{patientId}/images")]
        public async Task<IActionResult> GetPatientMedicalImages([FromRoute] int patientId)
        {
            var images = await _doctorService.GetPatientMedicalImagesAsync(patientId);
            return Ok(images);
        }

        [HttpPost("schedule")]
        public async Task<IActionResult> CreateSchedule([FromBody] CreateScheduleRequest request)
        {
            var userId = GetDoctorId();
            if (userId == 0) return Unauthorized();

            var result = await _doctorService.CreateScheduleAsync(userId, request);
            if (!result) return BadRequest("Failed to create schedule");

            return Ok(new { message = "Schedule created successfully" });
        }

        [HttpGet("schedule")]
        public async Task<IActionResult> GetSchedules()
        {
            var userId = GetDoctorId();
            if (userId == 0) return Unauthorized();

            var schedules = await _doctorService.GetSchedulesAsync(userId);
            return Ok(schedules);
        }

        [HttpDelete("schedule/{scheduleId}")]
        public async Task<IActionResult> DeleteSchedule([FromRoute] int scheduleId)
        {
            var result = await _doctorService.DeleteScheduleAsync(scheduleId);
            if (!result) return NotFound();

            return Ok(new { message = "Schedule deleted successfully" });
        }
    }
}
