using CosmoCargo.Data;
using CosmoCargo.Model;
using Microsoft.EntityFrameworkCore;

namespace CosmoCargo.Services;

/// <summary>
///     Engine for selecting and applying chaos events to shipments.
/// </summary>
public class ChaosEventEngine
{
    private readonly AppDbContext _context;
    private readonly WeightedRandomSelector _selector;

    public ChaosEventEngine(AppDbContext context, WeightedRandomSelector selector)
    {
        _context = context;
        _selector = selector;
    }

    /// <summary>
    ///     Selects a chaos event using weighted random selection and applies it to the given shipment.
    /// </summary>
    /// <param name="shipment">The shipment to mutate.</param>
    /// <returns>The selected event and the created log entry, or null if no event was selected.</returns>
    public async Task<(ChaosEventDefinition? SelectedEvent, ChaosEventLog? LogEntry)>
        SelectAndApplyChaosEventToShipmentAsync(Shipment shipment)
    {
        var events = await _context.ChaosEventDefinitions.ToListAsync();
        var selected = _selector.SelectEvent(events);
        if (selected == null)
            return (null, null);

        var impactDetails = string.Empty;
        var now = DateTime.UtcNow;

        // Mutate shipment based on event type
        switch (selected.Name)
        {
            case "AsteroidStrike":
                shipment.Status = ShipmentStatus.InTransit;
                shipment.UpdatedAt = now;
                impactDetails = "Shipment delayed by asteroid impact. Status set to InTransit.";
                break;
            case "PirateAttack":
                shipment.Status = ShipmentStatus.InTransit;
                shipment.UpdatedAt = now;
                impactDetails =
                    "Shipment attacked by pirates, delayed and flagged for review. Status set to InTransit.";
                break;
            case "SolarFlare":
                shipment.Status = ShipmentStatus.InTransit;
                shipment.UpdatedAt = now;
                impactDetails = "Solar flare caused communication blackout, delivery delayed. Status set to InTransit.";
                break;
            case "EngineFailure":
                shipment.Status = ShipmentStatus.InTransit;
                shipment.UpdatedAt = now;
                impactDetails = "Engine failure, shipment rerouted and delayed. Status set to InTransit.";
                break;
            case "CustomsInspection":
                shipment.Status = ShipmentStatus.InTransit;
                shipment.UpdatedAt = now;
                impactDetails = "Held for customs inspection, delivery delayed. Status set to InTransit.";
                break;
            default:
                impactDetails = $"No mutation logic defined for event type: {selected.Name}.";
                break;
        }

        // Save shipment mutation
        _context.Shipments.Update(shipment);

        // Log the event
        var log = new ChaosEventLog
        {
            Timestamp = now,
            ShipmentId = shipment.Id,
            EventType = selected.Name,
            EventDescription = selected.Description,
            ImpactDetails = impactDetails
        };
        _context.ChaosEventLogs.Add(log);
        await _context.SaveChangesAsync();
        return (selected, log);
    }
}