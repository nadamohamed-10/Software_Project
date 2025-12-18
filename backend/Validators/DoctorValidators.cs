using CLINICSYSTEM.Constants;
using CLINICSYSTEM.Data.DTOs;
using FluentValidation;

namespace CLINICSYSTEM.Validators;

/// <summary>
/// Validator for creating doctor schedules
/// </summary>
public class CreateDoctorScheduleDtoValidator : AbstractValidator<CreateDoctorScheduleDto>
{
    public CreateDoctorScheduleDtoValidator()
    {
        RuleFor(x => x.DayOfWeek)
            .NotEmpty().WithMessage(ValidationMessages.DayOfWeekRequired)
            .Must(day => new[] { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" }.Contains(day))
            .WithMessage(ValidationMessages.DayOfWeekInvalid);

        RuleFor(x => x.StartTime)
            .NotEmpty().WithMessage(ValidationMessages.StartTimeRequired);

        RuleFor(x => x.EndTime)
            .NotEmpty().WithMessage(ValidationMessages.EndTimeRequired)
            .GreaterThan(x => x.StartTime).WithMessage(ValidationMessages.EndTimeBeforeStartTime);

        RuleFor(x => x.SlotDurationMinutes)
            .GreaterThan(0)
            .LessThanOrEqualTo(120)
            .WithMessage("Slot duration must be between 1 and 120 minutes.");
    }
}
