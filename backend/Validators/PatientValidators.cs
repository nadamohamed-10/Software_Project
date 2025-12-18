using CLINICSYSTEM.Constants;
using CLINICSYSTEM.Data.DTOs;
using FluentValidation;

namespace CLINICSYSTEM.Validators;

/// <summary>
/// Validator for updating patient profile
/// </summary>
public class UpdatePatientProfileDtoValidator : AbstractValidator<UpdatePatientProfileDto>
{
    public UpdatePatientProfileDtoValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage(ValidationMessages.NameRequired)
            .Length(2, 50).WithMessage(ValidationMessages.NameLength);

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage(ValidationMessages.NameRequired)
            .Length(2, 50).WithMessage(ValidationMessages.NameLength);

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage(ValidationMessages.PhoneRequired)
            .Matches(@"^(\+20|0)?1[0125]\d{8}$").WithMessage(ValidationMessages.PhoneInvalid);

        RuleFor(x => x.Gender)
            .NotEmpty().WithMessage(ValidationMessages.GenderRequired)
            .Must(gender => gender == "Male" || gender == "Female" || gender == "Other")
            .WithMessage("Gender must be 'Male', 'Female', or 'Other'.");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage(ValidationMessages.AddressRequired)
            .Length(5, 200).WithMessage(ValidationMessages.AddressLength);

        RuleFor(x => x.EmergencyContact)
            .MaximumLength(100);
    }
}

/// <summary>
/// Validator for updating medical history
/// </summary>
public class UpdateMedicalHistoryDtoValidator : AbstractValidator<UpdateMedicalHistoryDto>
{
    public UpdateMedicalHistoryDtoValidator()
    {
        RuleFor(x => x.Allergies)
            .MaximumLength(1000);

        RuleFor(x => x.ChronicConditions)
            .MaximumLength(1000);

        RuleFor(x => x.SurgicalHistory)
            .MaximumLength(1000);

        RuleFor(x => x.CurrentMedications)
            .MaximumLength(1000);

        RuleFor(x => x.FamilyHistory)
            .MaximumLength(1000);
    }
}
