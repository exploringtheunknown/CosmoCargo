using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoCargo.Model
{
    /// <summary>
    /// Represents a log entry for a chaos event affecting a shipment.
    /// </summary>
    public class ChaosEventLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Timestamp { get; set; }

        [Required]
        public Guid ShipmentId { get; set; }

        /// <summary>
        /// Type of chaos event (e.g., "AsteroidStrike", "PirateAttack").
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string EventType { get; set; } = string.Empty;

        /// <summary>
        /// Human-readable description of the event.
        /// </summary>
        [MaxLength(500)]
        public string? EventDescription { get; set; }

        /// <summary>
        /// Details about the impact of the event (could be JSON or text).
        /// </summary>
        [MaxLength(2000)]
        public string? ImpactDetails { get; set; }

        // Navigation property (optional, if you want to link to Shipment entity)
        [ForeignKey("ShipmentId")]
        public virtual Shipment? Shipment { get; set; }
    }
} 