using CosmoCargo.Model;
using CosmoCargo.Model.Queries;
using CosmoCargo.Services;
using CosmoCargo.Utils;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;
namespace CosmoCargo.Endpoints
{
    public static class ShipmentEndpoints
    {
        public static async Task<IResult> GetShipments(
            IShipmentService shipmentService,
            [AsParameters] ShipmentsFilter filter,
            ClaimsPrincipal user)
        {
            var unauthorized = EndpointHelpers.TryGetUserIdOrUnauthorized(user, out var userId);
            if (unauthorized != null)
                return unauthorized;

            var forbidden = EndpointHelpers.TryGetUserRoleOrForbid(user, out var role);
            if (forbidden != null)
                return forbidden;

            PaginatedResult<Shipment> result;
            switch (role)
            {
                case UserRole.Admin:
                    result = await shipmentService.GetShipmentsAsync(filter);
                    break;
                case UserRole.Pilot:
                    result = await shipmentService.GetShipmentsByPilotIdAsync(userId, filter);
                    break;
                case UserRole.Customer:
                    result = await shipmentService.GetShipmentsByCustomerIdAsync(userId, filter);
                    break;
                default:
                    return Results.Forbid();
            }

            return Results.Ok(result);
        }

        public static async Task<IResult> GetShipmentById(
            Guid id,
            IShipmentService shipmentService,
            ClaimsPrincipal user)
        {
            var shipment = await shipmentService.GetShipmentByIdAsync(id);
            if (shipment == null)
                return Results.NotFound();

            var unauthorized = EndpointHelpers.TryGetUserIdOrUnauthorized(user, out var userId);
            if (unauthorized != null)
                return unauthorized;

            var forbidden = EndpointHelpers.TryGetUserRoleOrForbid(user, out var role);
            if (forbidden != null)
                return forbidden;

            if (role == UserRole.Admin)
                return Results.Ok(shipment);
            else if (role == UserRole.Pilot && shipment.PilotId == userId)
                return Results.Ok(shipment);
            else if (role == UserRole.Customer && shipment.CustomerId == userId)
                return Results.Ok(shipment);

            return Results.NotFound();
        }

        public static async Task<IResult> CreateShipment(
            CreateShipmentRequest request,
            IShipmentService shipmentService,
            ClaimsPrincipal user)
        {
            var unauthorized = EndpointHelpers.TryGetUserIdOrUnauthorized(user, out var userId);
            if (unauthorized != null)
                return unauthorized;

            var forbidden = EndpointHelpers.TryGetUserRoleOrForbid(user, out var role);
            if (forbidden != null)
                return forbidden;

            var shipment = new Shipment
            {
                Id = Guid.NewGuid(),
                CustomerId = userId,
                Sender = new ShipmentContact
                {
                    Name = request.Origin.Name,
                    Email = request.Origin.Email,
                    Planet = request.Origin.Planet,
                    Station = request.Origin.Station
                },
                Receiver = new ShipmentContact
                {
                    Name = request.Destination.Name,
                    Email = request.Destination.Email,
                    Planet = request.Destination.Planet,
                    Station = request.Destination.Station
                },
                Weight = request.Weight,
                Category = request.Category,
                Priority = request.Priority,
                Description = request.Description,
                HasInsurance = request.HasInsurance,
            };

            var createdShipment = await shipmentService.CreateShipmentAsync(shipment);
            return Results.Created($"/api/shipments/{createdShipment.Id}", createdShipment);
        }

        public static async Task<IResult> UpdateShipmentStatus(
            Guid id,
            UpdateShipmentStatusRequest request,
            IShipmentService shipmentService,
            ClaimsPrincipal user)
        {
            var unauthorized = EndpointHelpers.TryGetUserIdOrUnauthorized(user, out var userId);
            if (unauthorized != null)
                return unauthorized;

            var forbidden = EndpointHelpers.TryGetUserRoleOrForbid(user, out var role);
            if (forbidden != null)
                return forbidden;

            var shipment = await shipmentService.GetShipmentByIdAsync(id);
            if (shipment == null)
                return Results.NotFound();

            if (role == UserRole.Pilot && shipment.PilotId != userId)
                return Results.Forbid();

            var updatedShipment = await shipmentService.UpdateShipmentStatusAsync(id, request.Status);
            if (updatedShipment == null)
                return Results.NotFound();

            return Results.Ok(updatedShipment);
        }

        public static async Task<IResult> AssignPilot(
            Guid id,
            AssignPilotRequest request,
            IShipmentService shipmentService,
            ClaimsPrincipal user)
        {
            var forbidden = EndpointHelpers.TryGetUserRoleOrForbid(user, out var role);
            if (forbidden != null)
                return forbidden;

            if (role != UserRole.Admin)
                return Results.Forbid();

            var updatedShipment = await shipmentService.AssignPilotAsync(id, request.PilotId);
            if (updatedShipment == null)
                return Results.NotFound();

            return Results.Ok(updatedShipment);
        }

        public static RouteGroupBuilder MapShipmentEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/shipments");
            group.MapGet("/", GetShipments);
            group.MapGet("/{id}", GetShipmentById);
            group.MapPost("/", CreateShipment).RequireAuthorization("Customer");
            group.MapPut("/{id}/status", UpdateShipmentStatus).RequireAuthorization("Pilot", "Admin");
            group.MapPut("/{id}/assign", AssignPilot).RequireAuthorization("Admin");
            return group;
        }
    }

    public class LocationDto
    {
        [Required]
        [MinLength(3)]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
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

    public class CreateShipmentRequest
    {
        [Required]
        public LocationDto Origin { get; set; } = new();
        [Required]
        public LocationDto Destination { get; set; } = new();
        [Required]
        [Range(0.01, 100000)]
        public decimal Weight { get; set; }
        [Required]
        [MinLength(2)]
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;
        [Required]
        [MinLength(2)]
        [MaxLength(50)]
        public string Priority { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? Description { get; set; }
        public bool HasInsurance { get; set; }
    }

    public class UpdateShipmentStatusRequest
    {
        [Required]
        public ShipmentStatus Status { get; set; }
    }

    public class AssignPilotRequest
    {
        [Required]
        public Guid PilotId { get; set; }
    }
}
