using CosmoCargo.Data;
using CosmoCargo.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using CosmoCargo.Services;

namespace CosmoCargo.Endpoints
{
    public static class ChaosEventEndpoints
    {
        public static async Task<IResult> GetChaosEventLogs(
            [AsParameters] ChaosEventLogFilter filter,
            AppDbContext db,
            ClaimsPrincipal user)
        {
            var query = db.ChaosEventLogs.AsQueryable();
            if (filter.ShipmentId.HasValue)
                query = query.Where(e => e.ShipmentId == filter.ShipmentId);
            if (!string.IsNullOrEmpty(filter.EventType))
                query = query.Where(e => e.EventType == filter.EventType);
            if (filter.From.HasValue)
                query = query.Where(e => e.Timestamp >= filter.From);
            if (filter.To.HasValue)
                query = query.Where(e => e.Timestamp <= filter.To);

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(e => e.Timestamp)
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return Results.Ok(new { Total = total, Items = items });
        }

        public static IResult GetChaosEngineStatus(IConfiguration config, ClaimsPrincipal user)
        {
            var enabled = config.GetValue<bool>("ChaosEngine:Enabled", true);
            var interval = config.GetValue<int>("ChaosEngine:IntervalSeconds", 60);
            return Results.Ok(new { Enabled = enabled, IntervalSeconds = interval });
        }

        public static IResult EnableChaosEngine(IConfiguration config, ClaimsPrincipal user)
        {
            // NOTE: This only updates in-memory config. For persistent change, update appsettings or use DB flag.
            config["ChaosEngine:Enabled"] = "true";
            return Results.Ok(new { Enabled = true });
        }

        public static IResult DisableChaosEngine(IConfiguration config, ClaimsPrincipal user)
        {
            config["ChaosEngine:Enabled"] = "false";
            return Results.Ok(new { Enabled = false });
        }

        public static async Task<IResult> TriggerChaosEvent(
            TriggerChaosEventRequest request,
            AppDbContext db,
            ChaosEventEngine engine,
            ClaimsPrincipal user)
        {
            var shipment = await db.Shipments.FindAsync(request.ShipmentId);
            if (shipment == null)
                return Results.NotFound($"Shipment {request.ShipmentId} not found.");
            var (selectedEvent, logEntry) = await engine.SelectAndApplyChaosEventToShipmentAsync(shipment);
            if (selectedEvent == null || logEntry == null)
                return Results.BadRequest("No chaos event could be applied.");
            return Results.Ok(new { Event = selectedEvent, Log = logEntry });
        }

        public static IResult UpdateChaosEngineInterval(
            IConfiguration config,
            IntervalRequest request,
            ClaimsPrincipal user)
        {
            config["ChaosEngine:IntervalSeconds"] = request.IntervalSeconds.ToString();
            return Results.Ok(new { IntervalSeconds = request.IntervalSeconds });
        }

        public static RouteGroupBuilder MapChaosEventEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/chaos-events");
            group.MapGet("/logs", GetChaosEventLogs).RequireAuthorization("Admin");
            group.MapGet("/status", GetChaosEngineStatus).RequireAuthorization("Admin");
            group.MapPost("/enable", EnableChaosEngine).RequireAuthorization("Admin");
            group.MapPost("/disable", DisableChaosEngine).RequireAuthorization("Admin");
            group.MapPost("/trigger", TriggerChaosEvent).RequireAuthorization("Admin");
            group.MapPost("/interval", UpdateChaosEngineInterval).RequireAuthorization("Admin");
            return group;
        }

        private static bool IsAdmin(ClaimsPrincipal user)
        {
            return user.IsInRole("Admin") || user.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "Admin");
        }
    }

    public class ChaosEventLogFilter
    {
        public Guid? ShipmentId { get; set; }
        public string? EventType { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    public class IntervalRequest
    {
        public int IntervalSeconds { get; set; }
    }

    public class TriggerChaosEventRequest
    {
        public Guid ShipmentId { get; set; }
    }
} 