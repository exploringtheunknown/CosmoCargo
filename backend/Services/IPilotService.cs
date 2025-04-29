using CosmoCargo.Model;
using CosmoCargo.Model.Queries;

namespace CosmoCargo.Services
{
    public interface IPilotService
    {
        Task<PaginatedResult<User>> GetAllPilotsAsync(PilotsFilter filter);
        Task<User?> GetPilotByIdAsync(Guid id);
        Task<bool> IsPilotAvailableAsync(Guid pilotId);
        Task<int> GetPilotShipmentCountAsync(Guid pilotId);
        Task<User?> UpdatePilotStatusAsync(Guid id, UserStatus status);
    }
} 