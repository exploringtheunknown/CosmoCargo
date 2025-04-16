using CosmoCargo.Model;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using Npgsql;

namespace CosmoCargo.Data
{
    public static class DbInitializer
    {
        private static readonly Random _random = new Random();
        private static readonly ConcurrentDictionary<string, byte> _takenEmails = new ConcurrentDictionary<string, byte>();
        private const int BatchSize = 50_000;
        private const int MaxRetries = 5;
        private const int MaxDegreeOfParallelism = 3;
        private const int DeadlockRetryDelay = 2000;
        private static readonly string[] _origins = new[]
        {
            "Stockholm, Sweden", "Gothenburg, Sweden", "Malmö, Sweden",
            "Jorden, Alpha Station", "Jorden, Beta Station", "Jorden, Gamma Station",
            "Mars, Olympus Station", "Mars Base One", "Lunar Colony Alpha",
            "Titan Research Station", "Europa, Ice Harbor", "Ganymede Outpost",
            "Callisto Mining Facility", "Io Research Base", "Enceladus Station"
        };

        private static readonly string[] _destinations = new[]
        {
            "Mars, Olympus Station", "Mars Base One", "Lunar Colony Alpha",
            "Titan Research Station", "Europa, Ice Harbor", "Ganymede Outpost",
            "Callisto Mining Facility", "Io Research Base", "Enceladus Station",
            "Triton Research Base", "Pluto Station", "Charon Outpost",
            "Ceres Mining Facility", "Vesta Research Station", "Pallas Colony"
        };

        private static readonly string[] _cargoTypes = new[]
        {
            "Scientific Equipment", "Medical Supplies", "Construction Materials",
            "Food Supplies", "Mining Equipment", "Research Samples",
            "Spare Parts", "Personal Effects", "Industrial Machinery",
            "Water Supplies", "Oxygen Tanks", "Fuel Cells",
            "Electronics", "Raw Materials", "Agricultural Products"
        };

        private static readonly string[] _firstNames = new[]
        {
            "Erik", "Anna", "Maria", "Johan", "Anders", "Karin", "Lars", "Sofia",
            "Mikael", "Emma", "Per", "Lisa", "Karl", "Eva", "Peter", "Linda",
            "Andreas", "Sara", "Thomas", "Jenny", "Daniel", "Maria", "Fredrik",
            "Emma", "Magnus", "Anna", "Jonas", "Sofia", "Martin", "Karin"
        };

        private static readonly string[] _lastNames = new[]
        {
            "Andersson", "Johansson", "Karlsson", "Nilsson", "Eriksson", "Larsson",
            "Olsson", "Persson", "Svensson", "Gustafsson", "Pettersson", "Jonsson",
            "Jansson", "Hansson", "Bengtsson", "Jönsson", "Lindberg", "Jakobsson",
            "Magnusson", "Olofsson", "Lindström", "Lindqvist", "Lindgren", "Axelsson",
            "Berg", "Bergström", "Lundberg", "Lundgren", "Lundqvist", "Mattsson"
        };

        private static readonly string[] _experienceLevels = new[]
        {
            "1 year", "2 years", "3 years", "4 years", "5 years", "6 years",
            "7 years", "8 years", "9 years", "10 years", "11 years", "12 years",
            "13 years", "14 years", "15 years", "16 years", "17 years", "18 years",
            "19 years", "20 years"
        };

        private static readonly string[] _industries = new[]
        {
            "logistics", "space transport", "interplanetary shipping", "cargo management",
            "space logistics", "freight forwarding", "supply chain", "transportation",
            "space operations", "cargo operations", "shipping management", "space navigation",
            "cargo handling", "space logistics management", "interplanetary operations"
        };

        private static string GenerateUniqueEmail(string firstName, string lastName, string domain)
        {
            var baseEmail = $"{firstName.ToLower()}.{lastName.ToLower()}";
            var email = $"{baseEmail}@{domain}";
            var counter = 2;

            while (!_takenEmails.TryAdd(email, 0))
            {
                email = $"{baseEmail}.{counter}@{domain}";
                counter++;
            }

            return email;
        }

        private static void Log(string message)
        {
            Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] {message}");
        }

        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            if (await context.Users.AnyAsync())
                return;

            Log("DATABASE: Start seeding");

            await SeedCustomers(serviceProvider);
            await SeedPilots(serviceProvider);
            await SeedAdmins(serviceProvider);
            await SeedShipments(serviceProvider);

            Log("DATABASE: Seeding completed!");
        }

        private static async Task BulkInsertUsersAsync(AppDbContext context, List<User> users)
        {
            var connection = (NpgsqlConnection)context.Database.GetDbConnection();
            if (connection.State != System.Data.ConnectionState.Open)
                await connection.OpenAsync();

            using var writer = await connection.BeginBinaryImportAsync(
                "COPY users (id, name, email, password_hash, role, experience, is_active, created_at) FROM STDIN (FORMAT BINARY)");

            foreach (var user in users)
            {
                await writer.StartRowAsync();
                await writer.WriteAsync(user.Id);
                await writer.WriteAsync(user.Name);
                await writer.WriteAsync(user.Email);
                await writer.WriteAsync(user.PasswordHash);
                await writer.WriteAsync(user.Role.ToString());
                await writer.WriteAsync(user.Experience);
                await writer.WriteAsync(user.IsActive);
                await writer.WriteAsync(user.CreatedAt);
            }

            await writer.CompleteAsync();
        }

        private static async Task BulkInsertShipmentsAsync(AppDbContext context, List<Shipment> shipments)
        {
            var connection = (NpgsqlConnection)context.Database.GetDbConnection();
            if (connection.State != System.Data.ConnectionState.Open)
                await connection.OpenAsync();

            using var writer = await connection.BeginBinaryImportAsync(
                "COPY shipments (id, customer_id, pilot_id, origin, destination, weight, cargo, priority, status, risk_level, scheduled_date, created_at, updated_at) FROM STDIN (FORMAT BINARY)");

            foreach (var shipment in shipments)
            {
                await writer.StartRowAsync();
                await writer.WriteAsync(shipment.Id);
                await writer.WriteAsync(shipment.CustomerId);
                await writer.WriteAsync(shipment.PilotId);
                await writer.WriteAsync(shipment.Origin);
                await writer.WriteAsync(shipment.Destination);
                await writer.WriteAsync(shipment.Weight);
                await writer.WriteAsync(shipment.Cargo);
                await writer.WriteAsync(shipment.Priority);
                await writer.WriteAsync(shipment.Status.ToString());
                await writer.WriteAsync(shipment.RiskLevel.ToString());
                await writer.WriteAsync(shipment.ScheduledDate);
                await writer.WriteAsync(shipment.CreatedAt);
                await writer.WriteAsync(shipment.UpdatedAt);
            }

            await writer.CompleteAsync();
        }

        private static async Task SeedCustomers(IServiceProvider serviceProvider)
        {
            int totalCustomers = Random.Shared.Next(500_000, 700_000);
            var batches = (int)Math.Ceiling((double)totalCustomers / BatchSize);

            Log($"Starting to seed {totalCustomers:N0} customers");

            var options = new ParallelOptions { MaxDegreeOfParallelism = MaxDegreeOfParallelism };
            await Parallel.ForEachAsync(Enumerable.Range(0, batches), options, async (batch, ct) =>
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var customers = new List<User>(BatchSize);
                var now = DateTime.UtcNow;
                var batchSize = Math.Min(BatchSize, totalCustomers - batch * BatchSize);

                for (int i = 0; i < batchSize; i++)
                {
                    var firstName = _firstNames[_random.Next(_firstNames.Length)];
                    var lastName = _lastNames[_random.Next(_lastNames.Length)];
                    var experience = $"{_experienceLevels[_random.Next(_experienceLevels.Length)]} in {_industries[_random.Next(_industries.Length)]}";
                    var userNumber = batch * BatchSize + i + 1;

                    customers.Add(new User
                    {
                        Id = Guid.NewGuid(),
                        Name = $"{firstName} {lastName}",
                        Email = GenerateUniqueEmail(firstName, lastName, "example.com"),
                        PasswordHash = Utils.Crypto.HashPassword($"Customer{userNumber}"),
                        Role = UserRole.Customer,
                        Experience = experience,
                        IsActive = _random.Next(100) < 95,
                        CreatedAt = now.AddDays(-_random.Next(0, 365))
                    });
                }

                for (int retry = 0; retry < MaxRetries; retry++)
                {
                    try
                    {
                        using var transaction = await context.Database.BeginTransactionAsync();
                        try
                        {
                            await BulkInsertUsersAsync(context, customers);
                            await transaction.CommitAsync();
                            break;
                        }
                        catch
                        {
                            await transaction.RollbackAsync();
                            throw;
                        }
                    }
                    catch (Exception ex) when (IsDeadlockException(ex) && retry < MaxRetries - 1)
                    {
                        Log($"> Deadlock detected on customer batch {batch + 1}, retry {retry + 1}");
                        await Task.Delay(DeadlockRetryDelay * (retry + 1));
                    }
                    catch (Exception ex) when (retry < MaxRetries - 1)
                    {
                        Log($"> Retry {retry + 1} for customer batch {batch + 1} due to: {ex.Message}");
                        await Task.Delay(1000 * (retry + 1));
                    }
                }

                if ((batch + 1) % 5 == 0)
                {
                    Log($"> Processed {(batch + 1) * BatchSize:N0} customers");
                }
            });

            Log("Customer seeding completed!");
        }

        private static bool IsDeadlockException(Exception ex)
        {
            return ex is PostgresException pgEx && pgEx.SqlState == "40P01";
        }

        private static async Task SeedPilots(IServiceProvider serviceProvider)
        {
            int totalPilots = Random.Shared.Next(300_000, 400_000);
            var batches = (int)Math.Ceiling((double)totalPilots / BatchSize);

            Log($"Starting to seed {totalPilots:N0} pilots");

            var options = new ParallelOptions { MaxDegreeOfParallelism = MaxDegreeOfParallelism };
            await Parallel.ForEachAsync(Enumerable.Range(0, batches), options, async (batch, ct) =>
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var pilots = new List<User>(BatchSize);
                var now = DateTime.UtcNow;
                var batchSize = Math.Min(BatchSize, totalPilots - batch * BatchSize);

                for (int i = 0; i < batchSize; i++)
                {
                    var firstName = _firstNames[_random.Next(_firstNames.Length)];
                    var lastName = _lastNames[_random.Next(_lastNames.Length)];
                    var experience = $"{_experienceLevels[_random.Next(_experienceLevels.Length)]} of space piloting";
                    var userNumber = batch * BatchSize + i + 1;

                    pilots.Add(new User
                    {
                        Id = Guid.NewGuid(),
                        Name = $"{firstName} {lastName}",
                        Email = GenerateUniqueEmail(firstName, lastName, "cosmocargo.com"),
                        PasswordHash = Utils.Crypto.HashPassword($"Pilot{userNumber}"),
                        Role = UserRole.Pilot,
                        Experience = experience,
                        IsActive = _random.Next(100) < 90,
                        CreatedAt = now.AddDays(-_random.Next(0, 365))
                    });
                }

                for (int retry = 0; retry < MaxRetries; retry++)
                {
                    try
                    {
                        using var transaction = await context.Database.BeginTransactionAsync();
                        try
                        {
                            await BulkInsertUsersAsync(context, pilots);
                            await transaction.CommitAsync();
                            break;
                        }
                        catch
                        {
                            await transaction.RollbackAsync();
                            throw;
                        }
                    }
                    catch (Exception ex) when (IsDeadlockException(ex) && retry < MaxRetries - 1)
                    {
                        Log($"> Deadlock detected on pilot batch {batch + 1}, retry {retry + 1}");
                        await Task.Delay(DeadlockRetryDelay * (retry + 1));
                    }
                    catch (Exception ex) when (retry < MaxRetries - 1)
                    {
                        Log($"> Retry {retry + 1} for pilot batch {batch + 1} due to: {ex.Message}");
                        await Task.Delay(1000 * (retry + 1));
                    }
                }

                if ((batch + 1) % 5 == 0)
                {
                    Log($"> Processed {(batch + 1) * BatchSize:N0} pilots");
                }
            });

            Log("Pilot seeding completed!");
        }

        private static async Task SeedAdmins(IServiceProvider serviceProvider)
        {
            int totalAdmins = Random.Shared.Next(100_000, 200_000);
            var batches = (int)Math.Ceiling((double)totalAdmins / BatchSize);

            Log($"Starting to seed {totalAdmins:N0} admins");

            var options = new ParallelOptions { MaxDegreeOfParallelism = MaxDegreeOfParallelism };
            await Parallel.ForEachAsync(Enumerable.Range(0, batches), options, async (batch, ct) =>
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var admins = new List<User>(BatchSize);
                var now = DateTime.UtcNow;
                var batchSize = Math.Min(BatchSize, totalAdmins - batch * BatchSize);

                for (int i = 0; i < batchSize; i++)
                {
                    var firstName = _firstNames[_random.Next(_firstNames.Length)];
                    var lastName = _lastNames[_random.Next(_lastNames.Length)];
                    var experience = $"{_experienceLevels[_random.Next(_experienceLevels.Length)]} in space logistics management";
                    var userNumber = batch * BatchSize + i + 1;

                    admins.Add(new User
                    {
                        Id = Guid.NewGuid(),
                        Name = $"{firstName} {lastName}",
                        Email = GenerateUniqueEmail(firstName, lastName, "cosmocargo.com"),
                        PasswordHash = Utils.Crypto.HashPassword($"Admin{userNumber}"),
                        Role = UserRole.Admin,
                        Experience = experience,
                        IsActive = _random.Next(100) < 98,
                        CreatedAt = now.AddDays(-_random.Next(0, 365))
                    });
                }

                for (int retry = 0; retry < MaxRetries; retry++)
                {
                    try
                    {
                        using var transaction = await context.Database.BeginTransactionAsync();
                        try
                        {
                            await BulkInsertUsersAsync(context, admins);
                            await transaction.CommitAsync();
                            break;
                        }
                        catch
                        {
                            await transaction.RollbackAsync();
                            throw;
                        }
                    }
                    catch (Exception ex) when (IsDeadlockException(ex) && retry < MaxRetries - 1)
                    {
                        Log($"> Deadlock detected on admin batch {batch + 1}, retry {retry + 1}");
                        await Task.Delay(DeadlockRetryDelay * (retry + 1));
                    }
                    catch (Exception ex) when (retry < MaxRetries - 1)
                    {
                        Log($"> Retry {retry + 1} for admin batch {batch + 1} due to: {ex.Message}");
                        await Task.Delay(1000 * (retry + 1));
                    }
                }

                if ((batch + 1) % 5 == 0)
                {
                    Log($"> Processed {(batch + 1) * BatchSize:N0} admins");
                }
            });

            Log("Admin seeding completed!");
        }

        private static async Task SeedShipments(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var customerIds = await context.Users
                .Where(u => u.Role == UserRole.Customer)
                .Select(u => u.Id)
                .ToListAsync();

            var pilotIds = await context.Users
                .Where(u => u.Role == UserRole.Pilot)
                .Select(u => u.Id)
                .ToListAsync();

            var statuses = Enum.GetValues<ShipmentStatus>();
            var riskLevels = Enum.GetValues<RiskLevel>();
            var priorities = new[] { "Low", "Normal", "High", "Urgent" };

            int totalShipments = Random.Shared.Next(12_000_000, 16_000_000);
            var batches = (int)Math.Ceiling((double)totalShipments / BatchSize);

            Log($"Starting to seed {totalShipments:N0} shipments");

            var options = new ParallelOptions { MaxDegreeOfParallelism = MaxDegreeOfParallelism };
            await Parallel.ForEachAsync(Enumerable.Range(0, batches), options, async (batch, ct) =>
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var shipments = new List<Shipment>(BatchSize);
                var now = DateTime.UtcNow;
                var batchSize = Math.Min(BatchSize, totalShipments - batch * BatchSize);

                for (int i = 0; i < batchSize; i++)
                {
                    var scheduledDate = now.AddDays(_random.Next(-365, 365));
                    var createdAt = scheduledDate.AddDays(-_random.Next(1, 30));
                    var updatedAt = createdAt.AddDays(_random.Next(0, 30));
                    var status = statuses[_random.Next(statuses.Length)];

                    shipments.Add(new Shipment
                    {
                        Id = Guid.NewGuid(),
                        CustomerId = customerIds[_random.Next(customerIds.Count)],
                        PilotId = status == ShipmentStatus.Assigned 
                            || status == ShipmentStatus.InTransit 
                            || status == ShipmentStatus.Delivered ? pilotIds[_random.Next(pilotIds.Count)] : null,
                        Origin = _origins[_random.Next(_origins.Length)],
                        Destination = _destinations[_random.Next(_destinations.Length)],
                        Weight = _random.Next(50, 1000),
                        Cargo = _cargoTypes[_random.Next(_cargoTypes.Length)],
                        Priority = priorities[_random.Next(priorities.Length)],
                        Status = status,
                        RiskLevel = riskLevels[_random.Next(riskLevels.Length)],
                        ScheduledDate = scheduledDate,
                        CreatedAt = createdAt,
                        UpdatedAt = updatedAt
                    });
                }

                for (int retry = 0; retry < MaxRetries; retry++)
                {
                    try
                    {
                        using var transaction = await context.Database.BeginTransactionAsync();
                        try
                        {
                            await BulkInsertShipmentsAsync(context, shipments);
                            await transaction.CommitAsync();
                            break;
                        }
                        catch
                        {
                            await transaction.RollbackAsync();
                            throw;
                        }
                    }
                    catch (Exception ex) when (IsDeadlockException(ex) && retry < MaxRetries - 1)
                    {
                        Log($"> Deadlock detected on shipment batch {batch + 1}, retry {retry + 1}");
                        await Task.Delay(DeadlockRetryDelay * (retry + 1));
                    }
                    catch (Exception ex) when (retry < MaxRetries - 1)
                    {
                        Log($"> Retry {retry + 1} for shipment batch {batch + 1} due to: {ex.Message}");
                        await Task.Delay(1000 * (retry + 1));
                    }
                }

                if ((batch + 1) % 5 == 0)
                {
                    Log($"> Processed {(batch + 1) * BatchSize:N0} shipments");
                }
            });

            Log("Shipment seeding completed!");
        }
    }
}
