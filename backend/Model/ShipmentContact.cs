using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace CosmoCargo.Model
{
    public class ShipmentContact
    {
        [Required]
        [MinLength(3)]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;
        [Required]
        [MinLength(2)]
        [MaxLength(100)]
        public string Planet { get; set; } = string.Empty;
        [Required]
        [MinLength(2)]
        [MaxLength(100)]
        public string Station { get; set; } = string.Empty;
    }
} 