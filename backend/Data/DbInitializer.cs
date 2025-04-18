using CosmoCargo.Model;
using System.Security.Cryptography;
using System.Text;

namespace CosmoCargo.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            if (context.Users.Any())
                return;

            var users = new List<User>
            {
                new User
                {
                    Id = Guid.NewGuid(),
                    Name = "Johan Andersson",
                    Email = "user@example.com",
                    PasswordHash = Utils.Crypto.HashPassword("mKv2P8dXrL9F"),
                    Role = UserRole.Customer,
                    Experience = "5 years in logistics",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    Name = "Erik Nilsson",
                    Email = "pilot@example.com",
                    PasswordHash = Utils.Crypto.HashPassword("zH7yB3tR5wQ9s"),
                    Role = UserRole.Pilot,
                    Experience = "10 years of space piloting",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    Name = "Maria Johansson",
                    Email = "admin@example.com",
                    PasswordHash = Utils.Crypto.HashPassword("eT4xD6cV2gN8p"),
                    Role = UserRole.Admin,
                    Experience = "8 years in space logistics management",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    Name = "Anna Karlsson",
                    Email = "anna.karlsson@cosmocargo.com",
                    PasswordHash = Utils.Crypto.HashPassword("pilot123"),
                    Role = UserRole.Pilot,
                    Experience = "7 years of interplanetary transport",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    Name = "Marcus Lindqvist",
                    Email = "marcus.lindqvist@cosmocargo.com",
                    PasswordHash = Utils.Crypto.HashPassword("pilot123"),
                    Role = UserRole.Pilot,
                    Experience = "12 years of deep space navigation",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    Name = "Elsa Berg",
                    Email = "elsa.berg@cosmocargo.com",
                    PasswordHash = Utils.Crypto.HashPassword("pilot123"),
                    Role = UserRole.Pilot,
                    Experience = "6 years of cargo transport experience",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.Users.AddRange(users);
            context.SaveChanges();

            var shipments = new List<Shipment>
            {
                new Shipment
                {
                    Id = Guid.NewGuid(),
                    CustomerId = users.First(u => u.Name == "Johan Andersson").Id,
                    PilotId = users.First(u => u.Role == UserRole.Pilot).Id,
                    Origin = "Stockholm, Sweden",
                    Destination = "Lunar Colony Alpha",
                    Weight = 100,
                    Cargo = "Scientific Equipment",
                    Priority = "Normal",
                    Status = ShipmentStatus.Pending,
                    RiskLevel = RiskLevel.Low,
                    ScheduledDate = DateTime.UtcNow.AddDays(7),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Shipment
                {
                    Id = Guid.NewGuid(),
                    CustomerId = users.First(u => u.Name == "Maria Johansson").Id,
                    PilotId = users.First(u => u.Role == UserRole.Pilot).Id,
                    Origin = "Gothenburg, Sweden",
                    Destination = "Mars Base One",
                    Weight = 75,
                    Cargo = "Medical Supplies",
                    Priority = "High",
                    Status = ShipmentStatus.InProgress,
                    RiskLevel = RiskLevel.Low,
                    ScheduledDate = DateTime.UtcNow.AddDays(3),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Shipment
                {
                    Id = Guid.NewGuid(),
                    CustomerId = users.First(u => u.Name == "Erik Nilsson").Id,
                    PilotId = users.First(u => u.Role == UserRole.Pilot).Id,
                    Origin = "Malmö, Sweden",
                    Destination = "Titan Research Station",
                    Weight = 200,
                    Cargo = "Construction Materials",
                    Priority = "Normal",
                    Status = ShipmentStatus.Pending,
                    RiskLevel = RiskLevel.Low,
                    ScheduledDate = DateTime.UtcNow.AddDays(14),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Shipment
                {
                    Id = Guid.NewGuid(),
                    CustomerId = users.First(u => u.Name == "Johan Andersson").Id,
                    PilotId = users.First(u => u.Name == "Anna Karlsson").Id,
                    Origin = "Jorden, Alpha Station",
                    Destination = "Mars, Olympus Station",
                    Weight = 150,
                    Cargo = "General Cargo",
                    Priority = "Normal",
                    Status = ShipmentStatus.InProgress,
                    RiskLevel = RiskLevel.Low,
                    ScheduledDate = DateTime.Parse("2023-04-10").ToUniversalTime(),
                    CreatedAt = DateTime.Parse("2023-04-10").ToUniversalTime(),
                    UpdatedAt = DateTime.Parse("2023-04-10").ToUniversalTime()
                },
                new Shipment
                {
                    Id = Guid.NewGuid(),
                    CustomerId = users.First(u => u.Name == "Maria Johansson").Id,
                    PilotId = users.First(u => u.Name == "Marcus Lindqvist").Id,
                    Origin = "Jorden, Beta Station",
                    Destination = "Europa, Ice Harbor",
                    Weight = 120,
                    Cargo = "General Cargo",
                    Priority = "Normal",
                    Status = ShipmentStatus.Pending,
                    RiskLevel = RiskLevel.Low,
                    ScheduledDate = DateTime.Parse("2023-04-12").ToUniversalTime(),
                    CreatedAt = DateTime.Parse("2023-04-12").ToUniversalTime(),
                    UpdatedAt = DateTime.Parse("2023-04-12").ToUniversalTime()
                },
                new Shipment
                {
                    Id = Guid.NewGuid(),
                    CustomerId = users.First(u => u.Name == "Erik Nilsson").Id,
                    PilotId = users.First(u => u.Name == "Elsa Berg").Id,
                    Origin = "Mars, Olympus Station",
                    Destination = "Jorden, Gamma Station",
                    Weight = 180,
                    Cargo = "General Cargo",
                    Priority = "Normal",
                    Status = ShipmentStatus.InProgress,
                    RiskLevel = RiskLevel.Low,
                    ScheduledDate = DateTime.Parse("2023-04-08").ToUniversalTime(),
                    CreatedAt = DateTime.Parse("2023-04-08").ToUniversalTime(),
                    UpdatedAt = DateTime.Parse("2023-04-08").ToUniversalTime()
                }
            };

            context.Shipments.AddRange(shipments);
            context.SaveChanges();
        }
    }
}
