using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CosmoCargo.Data;
using CosmoCargo.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace CosmoCargo.Services
{
    /// <summary>
    /// Background service that periodically applies chaos events to random shipments.
    /// </summary>
    public class ChaosEventScheduler : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ChaosEventScheduler> _logger;
        private readonly IConfiguration _configuration;
        private readonly TimeSpan _interval;
        private readonly bool _enabled;

        public ChaosEventScheduler(IServiceProvider serviceProvider, ILogger<ChaosEventScheduler> logger, IConfiguration configuration)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _configuration = configuration;
            _interval = TimeSpan.FromSeconds(_configuration.GetValue<int>("ChaosEngine:IntervalSeconds", 60));
            _enabled = _configuration.GetValue<bool>("ChaosEngine:Enabled", true);
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
                            _logger.LogInformation("Applied chaos event '{Event}' to shipment {ShipmentId}. LogId: {LogId}", selectedEvent.Name, shipment.Id, logEntry.Id);
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
} 