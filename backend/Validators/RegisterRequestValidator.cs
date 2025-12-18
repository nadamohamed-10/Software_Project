using CLINICSYSTEM.Data.DTOs;
using FluentValidation;

namespace CLINICSYSTEM.Validators
{
    /// <summary>
    /// Validator for user registration requests
    /// </summary>
    public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
    {
        public RegisterRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format")
                .MaximumLength(100).WithMessage("Email must not exceed 100 characters");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters")
                .MaximumLength(100).WithMessage("Password must not exceed 100 characters");

            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name is required")
                .Length(2, 50).WithMessage("First name must be between 2 and 50 characters")
                .Matches(@"^[a-zA-Z\s]+$").WithMessage("First name can only contain letters and spaces");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name is required")
                .Length(2, 50).WithMessage("Last name must be between 2 and 50 characters")
                .Matches(@"^[a-zA-Z\s]+$").WithMessage("Last name can only contain letters and spaces");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Phone number is required")
                .Matches(@"^(\+20|0)?1[0125]\d{8}$").WithMessage("Invalid Egyptian phone number format");

            RuleFor(x => x.Role)
                .NotEmpty().WithMessage("Role is required")
                .Must(role => role == "Doctor" || role == "Patient")
                .WithMessage("Role must be either 'Doctor' or 'Patient'");

            // Optional date of birth validation
            RuleFor(x => x.DateOfBirth)
                .Must(BeValidDateFormat)
                .WithMessage("Invalid date format. Use formats like: 17/6/2005, 2005/6/17, or 17-6-2005")
                .When(x => !string.IsNullOrWhiteSpace(x.DateOfBirth));

            // Optional gender validation
            RuleFor(x => x.Gender)
                .Must(gender => gender == null || new[] { "Male", "Female", "Other" }.Contains(gender))
                .WithMessage("Gender must be 'Male', 'Female', or 'Other'")
                .When(x => !string.IsNullOrWhiteSpace(x.Gender));
        }

        private bool BeValidDateFormat(string? dateString)
        {
            if (string.IsNullOrWhiteSpace(dateString))
                return true;

            return CLINICSYSTEM.Helpers.DateTimeHelper.ParseFlexibleDate(dateString) != null;
        }
    }

    /// <summary>
    /// Validator for user login requests
    /// </summary>
    public class LoginRequestValidator : AbstractValidator<LoginRequest>
    {
        public LoginRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required");
        }
    }
}