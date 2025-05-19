namespace CosmoCargo.Model
{
    public class CustomsDeclaration
    {
        public int Id { get; set; }
        public Guid ShipmentId { get; set; }
        
        public bool ContainsLifeforms { get; set; }
        public string? LifeformType { get; set; }
        public bool IsPlasmaActive { get; set; }
        public int? PlasmaStabilityLevel { get; set; }
        public bool QuarantineRequired { get; set; }
        public bool OriginPlanetLawsConfirmed { get; set; }
        public string? CustomsNotes { get; set; }
        public RiskLevel RiskLevel { get; set; }
        
        public Shipment Shipment { get; set; } = null!;
    }
} 