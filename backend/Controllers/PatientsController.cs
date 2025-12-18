using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CLINICSYSTEM.Data.DTOs;
using CLINICSYSTEM.Services;

namespace CLINICSYSTEM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Patient")]
    public class PatientsController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientsController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        private int GetPatientId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null && int.TryParse(userIdClaim.Value, out var id) ? id : 0;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetPatientId();
            if (userId == 0) return Unauthorized();

            var profile = await _patientService.GetProfileAsync(userId);
            if (profile == null) return NotFound();

            return Ok(profile);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdatePatientProfileRequest request)
        {
            var userId = GetPatientId();
            if (userId == 0) return Unauthorized();

            var result = await _patientService.UpdateProfileAsync(userId, request);
            if (!result) return BadRequest("Failed to update profile");

            return Ok(new { message = "Profile updated successfully" });
        }

        [HttpGet("medical-history")]
        public async Task<IActionResult> GetMedicalHistory()
        {
            var userId = GetPatientId();
            if (userId == 0) return Unauthorized();

            var history = await _patientService.GetMedicalHistoryAsync(userId);
            return Ok(history ?? new MedicalHistoryDTO());
        }

        [HttpPut("medical-history")]
        public async Task<IActionResult> UpdateMedicalHistory([FromBody] UpdateMedicalHistoryRequest request)
        {
            var userId = GetPatientId();
            if (userId == 0) return Unauthorized();

            var result = await _patientService.UpdateMedicalHistoryAsync(userId, request);
            if (!result) return BadRequest("Failed to update medical history");

            return Ok(new { message = "Medical history updated successfully" });
        }

        [HttpGet("appointments")]
        public async Task<IActionResult> GetAppointments()
        {
            var userId = GetPatientId();
            if (userId == 0) return Unauthorized();

            var appointments = await _patientService.GetAppointmentsAsync(userId);
            return Ok(appointments);
        }

        [HttpGet("prescriptions")]
        public async Task<IActionResult> GetPrescriptions()
        {
            var userId = GetPatientId();
            if (userId == 0) return Unauthorized();

            var prescriptions = await _patientService.GetPrescriptionsAsync(userId);
            return Ok(prescriptions);
        }

        [HttpGet("medical-images")]
        public async Task<IActionResult> GetMedicalImages()
        {
            var userId = GetPatientId();
            if (userId == 0) return Unauthorized();

            var images = await _patientService.GetMedicalImagesAsync(userId);
            return Ok(images);
        }

        [HttpGet("consultation-history")]
        public async Task<IActionResult> GetConsultationHistory()
        {
            var userId = GetPatientId();
            if (userId == 0) return Unauthorized();

            var history = await _patientService.GetConsultationHistoryAsync(userId);
            return Ok(history);
        }
    }
}
