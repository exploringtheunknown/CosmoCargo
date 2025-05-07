using CosmoCargo.Data;
using CosmoCargo.Model;
using CosmoCargo.Services;
using CosmoCargo.Validation;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace CosmoCargo.Api
{
    public static class CustomsDeclarationEndpoints
    {
        public static void MapCustomsDeclarationEndpoints(this WebApplication app)
        {
            app.MapPost("/api/shipments/{shipmentId:guid}/customs-declaration", async (
                Guid shipmentId,
                CustomsDeclaration declaration,
                AppDbContext db,
                RiskAssessmentService riskService,
                CustomsDeclarationValidator validator) =>
            {
                var shipment = await db.Shipments
                    .Include(s => s.CustomsDeclaration)
                    .FirstOrDefaultAsync(s => s.Id == shipmentId);
                
                if (shipment == null)
                    return Results.NotFound("Frakten hittades inte");
                
                declaration.ShipmentId = shipmentId;
                
                var validationResult = await validator.ValidateAsync(declaration);
                if (!validationResult.IsValid)
                    return Results.BadRequest(validationResult.Errors);
                
                declaration.RiskLevel = riskService.AssessRisk(declaration);
                
                if (shipment.CustomsDeclaration != null)
                {
                    db.Entry(shipment.CustomsDeclaration).CurrentValues.SetValues(declaration);
                }
                else
                {
                    shipment.CustomsDeclaration = declaration;
                }
                
                await db.SaveChangesAsync();
                
                return Results.Ok(declaration);
            });
            app.MapGet("/api/shipments/{shipmentId:guid}/customs-declaration", async (
                Guid shipmentId,
                AppDbContext db) =>
            {
                var declaration = await db.CustomsDeclarations
                    .FirstOrDefaultAsync(c => c.ShipmentId == shipmentId);
                
                if (declaration == null)
                    return Results.NotFound("Ingen tulldeklaration hittades för denna frakt");
                
                return Results.Ok(declaration);
            });
        }
    }
} 