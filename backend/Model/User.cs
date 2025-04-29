using System.Text.Json.Serialization;

namespace CosmoCargo.Model
{
    public class User
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        [JsonIgnore]
        public string PasswordHash { get; set; } = string.Empty;
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public UserRole Role { get; set; }
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public UserStatus Status { get; set; } = UserStatus.Active;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

#region Pilot-specific properties
        public string? Experience { get; set; } = null;
        public bool? IsActive { get; set; } = null;
#endregion
        
        [JsonIgnore]
        public virtual ICollection<Shipment>? CustomerShipments { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<Shipment>? PilotShipments { get; set; }
    }
}
