using CosmoCargo.Model;
using FluentValidation;

namespace CosmoCargo.Validation
{
    public class CustomsDeclarationValidator : AbstractValidator<CustomsDeclaration>
    {
        public CustomsDeclarationValidator()
        {
            RuleFor(x => x.LifeformType)
                .NotEmpty()
                .When(x => x.ContainsLifeforms)
                .WithMessage("Beskrivning av livsform krävs när frakten innehåller levande varelser");

            RuleFor(x => x.PlasmaStabilityLevel)
                .NotNull()
                .When(x => x.IsPlasmaActive)
                .WithMessage("Stabilitetsnivå krävs för plasmaaktiva material");
                
            RuleFor(x => x.PlasmaStabilityLevel)
                .InclusiveBetween(1, 10)
                .When(x => x.IsPlasmaActive && x.PlasmaStabilityLevel.HasValue)
                .WithMessage("Stabilitetsnivå måste vara mellan 1 och 10");

            RuleFor(x => x.QuarantineRequired)
                .Equal(true)
                .When(x => x.IsPlasmaActive && x.PlasmaStabilityLevel < 4)
                .WithMessage("Karantän krävs för plasmaaktiva material med stabilitetsnivå under 4");

            RuleFor(x => x.OriginPlanetLawsConfirmed)
                .Equal(true)
                .WithMessage("Du måste intyga att exporten är laglig enligt ursprungsplanetens lagar");
        }
    }
} 