using CosmoCargo.Data;
using CosmoCargo.Model;
using CosmoCargo.Model.Queries;
using Microsoft.EntityFrameworkCore;

namespace CosmoCargo.Services
{
    public class PilotService : IPilotService
    {
        private readonly AppDbContext _context;

        public PilotService(AppDbContext context)
        {
            _context = context;
        }

        private IQueryable<User> ApplyFilter(PilotsFilter filter)
        {
            var query = _context.Users
                .Where(u => u.Role == UserRole.Pilot)
                .AsQueryable();

            if (!string.IsNullOrEmpty(filter.Search))
            {
                query = query.Where(p =>
                    p.Name.Contains(filter.Search) ||
                    p.Email.Contains(filter.Search));
            }

            if (filter.Status.HasValue)
            {
                query = query.Where(p => p.Status == filter.Status.Value);
            }

            return query;
        }

        public async Task<PaginatedResult<User>> GetAllPilotsAsync(PilotsFilter filter)
        {
            var query = ApplyFilter(filter);
            
            var totalCount = await query.CountAsync();
            
            var pilots = await query
                .OrderBy(p => p.Name)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PaginatedResult<User>(
                items: pilots,
                totalCount: totalCount,
                page: filter.PageNumber,
                pageSize: filter.PageSize
            );
        }

        public async Task<User?> GetPilotByIdAsync(Guid id)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id && u.Role == UserRole.Pilot);
        }

        public async Task<bool> IsPilotAvailableAsync(Guid pilotId)
        {
            var activeShipments = await _context.Shipments
                .CountAsync(s => s.PilotId == pilotId && 
                                (s.Status == ShipmentStatus.Approved || 
                                 s.Status == ShipmentStatus.InTransit));

            return activeShipments < 3;
        }

        public async Task<int> GetPilotShipmentCountAsync(Guid pilotId)
        {
            return await _context.Shipments
                .CountAsync(s => s.PilotId == pilotId && 
                               (s.Status == ShipmentStatus.Approved || 
                                 s.Status == ShipmentStatus.InTransit));
        }

        public async Task<User?> UpdatePilotStatusAsync(Guid id, UserStatus status)
        {
            var pilot = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id && u.Role == UserRole.Pilot);
                
            if (pilot == null)
                return null;
                
            pilot.Status = status;
            pilot.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            return pilot;
        }
    }
} 