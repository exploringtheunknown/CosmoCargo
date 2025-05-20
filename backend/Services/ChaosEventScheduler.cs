using CosmoCargo.Data;
using CosmoCargo.Model;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace CosmoCargo.Services;

/// <summary>
///     Background service that periodically applies chaos events to random shipments.
/// </summary>
public class ChaosEventScheduler : BackgroundService
{
    private readonly IConfiguration _configuration;
    private readonly bool _enabled;
    private readonly IHubContext<ChaosEventsHub> _hubContext;
    private readonly TimeSpan _interval;
    private readonly ILogger<ChaosEventScheduler> _logger;
    private readonly IServiceProvider _serviceProvider;

    public ChaosEventScheduler(IServiceProvider serviceProvider, ILogger<ChaosEventScheduler> logger,
        IConfiguration configuration, IHubContext<ChaosEventsHub> hubContext)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _configuration = configuration;
        _hubContext = hubContext;
        _interval = TimeSpan.FromSeconds(_configuration.GetValue("ChaosEngine:IntervalSeconds", 60));
        _enabled = _configuration.GetValue("ChaosEngine:Enabled", true);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_enabled)
        {
            _logger.LogInformation("Chaos event engine is disabled by configuration.");
            return;
        }

        _logger.LogInformation("Chaos event scheduler started. Interval: {Interval}s", _interval.TotalSeconds);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var engine = scope.ServiceProvider.GetRequiredService<ChaosEventEngine>();

                // Select a random eligible shipment (not Delivered or Cancelled) efficiently
                var shipment = await context.Shipments
                    .Where(s => s.Status != ShipmentStatus.Delivered && s.Status != ShipmentStatus.Cancelled)
                    .OrderBy(x => EF.Functions.Random())
                    .FirstOrDefaultAsync(stoppingToken);

                if (shipment == null)
                {
                    _logger.LogInformation("No eligible shipments for chaos event.");
                }
                else
                {
                    var (selectedEvent, logEntry) = await engine.SelectAndApplyChaosEventToShipmentAsync(shipment);
                    if (selectedEvent != null && logEntry != null)
                    {
                        _logger.LogInformation("Applied chaos event '{Event}' to shipment {ShipmentId}. LogId: {LogId}",
                            selectedEvent.Name, shipment.Id, logEntry.Id);
                        await _hubContext.Clients.All.SendAsync(
                            "ChaosEventOccurred",
                            new
                            {
                                id = logEntry.Id,
                                timestamp = logEntry.Timestamp,
                                shipmentId = logEntry.ShipmentId,
                                eventType = logEntry.EventType,
                                eventDescription = logEntry.EventDescription,
                                impactDetails = logEntry.ImpactDetails
                            },
                            stoppingToken
                        );
                    }
                    else
                    {
                        _logger.LogWarning("No chaos event applied to shipment {ShipmentId}.", shipment.Id);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in chaos event scheduler loop.");
            }

            await Task.Delay(_interval, stoppingToken);
        }
    }
}