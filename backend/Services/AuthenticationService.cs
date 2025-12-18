using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CLINICSYSTEM.Data;
using CLINICSYSTEM.Data.DTOs;
using CLINICSYSTEM.Models;

namespace CLINICSYSTEM.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ClinicDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthenticationService(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, 
            ClinicDbContext context, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            try
            {
                if (await IsEmailExistsAsync(request.Email))
                    return new AuthResponse { Success = false, Message = "Email already exists" };

                var identityUser = new IdentityUser 
                { 
                    UserName = request.Email, 
                    Email = request.Email 
                };

                var result = await _userManager.CreateAsync(identityUser, request.Password);
                
                if (!result.Succeeded)
                    return new AuthResponse { Success = false, Message = "Registration failed" };

                await _userManager.AddToRoleAsync(identityUser, request.Role);

                var user = new UserModel
                {
                    Email = request.Email,
                    PhoneNumber = request.PhoneNumber,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Role = request.Role,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                if (request.Role == "Patient")
                {
                    var patient = new PatientModel
                    {
                        UserId = user.UserId,
                        Gender = request.Gender ?? string.Empty,
                        DateOfBirth = request.DateOfBirth ?? DateTime.MinValue,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Patients.Add(patient);
                }
                else if (request.Role == "Doctor")
                {
                    var doctor = new DoctorModel
                    {
                        UserId = user.UserId,
                        Specialization = request.Specialization ?? "Orthopedic Specialist",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Doctors.Add(doctor);
                }

                await _context.SaveChangesAsync();

                var token = GenerateToken(user);

                return new AuthResponse
                {
                    Success = true,
                    Token = token,
                    User = new UserDTO
                    {
                        UserId = user.UserId,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        PhoneNumber = user.PhoneNumber,
                        Role = user.Role
                    }
                };
            }
            catch (Exception ex)
            {
                return new AuthResponse { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
                
                if (user == null)
                    return new AuthResponse { Success = false, Message = "Invalid email or password" };

                var identityUser = await _userManager.FindByEmailAsync(request.Email);
                if (identityUser == null || !await _userManager.CheckPasswordAsync(identityUser, request.Password))
                    return new AuthResponse { Success = false, Message = "Invalid email or password" };

                var token = GenerateToken(user);

                return new AuthResponse
                {
                    Success = true,
                    Token = token,
                    User = new UserDTO
                    {
                        UserId = user.UserId,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        PhoneNumber = user.PhoneNumber,
                        Role = user.Role
                    }
                };
            }
            catch (Exception ex)
            {
                return new AuthResponse { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        private string GenerateToken(UserModel user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings["SecretKey"] ?? ""));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpirationMinutes"] ?? "1440")),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
