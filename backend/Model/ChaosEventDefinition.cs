using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoCargo.Model
{
    /// <summary>
    /// Represents a chaos event definition, including its name, weight (probability), and description.
    /// </summary>
    public class ChaosEventDefinition
    {
        /// <summary>
        /// Primary key for the chaos event definition.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Name of the chaos event (e.g., "AsteroidStrike").
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Weight (probability) for random selection. Higher means more likely.
        /// </summary>
        [Required]
        public double Weight { get; set; }

        /// <summary>
        /// Optional human-readable description of the event.
        /// </summary>
        [MaxLength(500)]
        public string? Description { get; set; }
    }
} 