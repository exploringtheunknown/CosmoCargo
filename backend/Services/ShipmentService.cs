using CosmoCargo.Data;
using CosmoCargo.Model;
using CosmoCargo.Model.Queries;
using Microsoft.EntityFrameworkCore;

namespace CosmoCargo.Services
{
    public class ShipmentService : IShipmentService
    {
        private readonly AppDbContext _context;

        public ShipmentService(AppDbContext context)
        {
            _context = context;
        }

        private IQueryable<Shipment> ApplyFilter(ShipmentsFilter filter)
        {
            var query = _context.Shipments.AsQueryable();

            if (!string.IsNullOrEmpty(filter.Search))
            {
                query = query.Where(s =>
                    s.Id.ToString().Contains(filter.Search) ||
                    s.Sender.Name.Contains(filter.Search) ||
                    s.Sender.Email.Contains(filter.Search) ||
                    s.Sender.Planet.Contains(filter.Search) ||
                    s.Sender.Station.Contains(filter.Search) ||
                    s.Receiver.Name.Contains(filter.Search) ||
                    s.Receiver.Email.Contains(filter.Search) ||
                    s.Receiver.Planet.Contains(filter.Search) ||
                    s.Receiver.Station.Contains(filter.Search));
            }

            if (filter.Status.HasValue)
            {
                query = query.Where(s => s.Status == filter.Status.Value);
            }

            return query;
        }

        public async Task<IEnumerable<Shipment>> GetShipmentsAsync(ShipmentsFilter filter)
        {
            return await ApplyFilter(filter).ToListAsync();
        }

        public async Task<IEnumerable<Shipment>> GetShipmentsByCustomerIdAsync(Guid customerId, ShipmentsFilter filter)
        {
            return await ApplyFilter(filter)
                .Where(s => s.CustomerId == customerId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Shipment>> GetShipmentsByPilotIdAsync(Guid pilotId, ShipmentsFilter filter)
        {
            return await ApplyFilter(filter)
                .Include(s => s.Customer)
                .Where(s => s.PilotId == pilotId)
                .ToListAsync();
        }

        public async Task<Shipment?> GetShipmentByIdAsync(Guid id)
        {
            return await _context.Shipments
                .Include(s => s.Customer)
                .Include(s => s.Pilot)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Shipment> CreateShipmentAsync(Shipment shipment)
        {
            shipment.Id = Guid.NewGuid();
            shipment.CreatedAt = DateTime.UtcNow;
            shipment.UpdatedAt = DateTime.UtcNow;
            shipment.Status = ShipmentStatus.WaitingForApproval;
            shipment.PilotId = null;

            _context.Shipments.Add(shipment);
            await _context.SaveChangesAsync();

            return shipment;
        }

        public async Task<Shipment?> UpdateShipmentStatusAsync(Guid id, ShipmentStatus status)
        {
            var shipment = await _context.Shipments.FindAsync(id);
            if (shipment == null)
                return null;

            shipment.Status = status;
            shipment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return shipment;
        }

        public async Task<Shipment?> AssignPilotAsync(Guid shipmentId, Guid pilotId)
        {
            var shipment = await _context.Shipments.FindAsync(shipmentId);
            if (shipment == null)
                return null;

            var pilot = await _context.Users.FirstOrDefaultAsync(u => u.Id == pilotId && u.Role == UserRole.Pilot);
            if (pilot == null)
                return null;

            shipment.PilotId = pilotId;
            shipment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return shipment;
        }
    }
}
