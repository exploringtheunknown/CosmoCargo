using CosmoCargo.Model;

namespace CosmoCargo.Services
{
    public class RiskAssessmentService
    {
        public RiskLevel AssessRisk(CustomsDeclaration declaration)
        {
            if (declaration.IsPlasmaActive && 
                declaration.PlasmaStabilityLevel < 5 && 
                declaration.ContainsLifeforms)
            {
                return RiskLevel.Critical;
            }
            
            if (declaration.ContainsLifeforms && 
                (string.IsNullOrWhiteSpace(declaration.LifeformType) || 
                 declaration.LifeformType.ToLower().Contains("okänd")))
            {
                return RiskLevel.High;
            }
            
            if (declaration.IsPlasmaActive && 
                declaration.PlasmaStabilityLevel >= 5 && 
                declaration.PlasmaStabilityLevel <= 7)
            {
                return RiskLevel.Medium;
            }
            
            return RiskLevel.Low;
        }
    }
} 