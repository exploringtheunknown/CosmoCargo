namespace CosmoCargo.Endpoints;

public static class HealthcheckEndpoints
{
    public static IResult Ping()
    {
        return Results.Ok();
    }

    public static RouteGroupBuilder MapHealthcheckEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/healthcheck");
        group.MapGet("/ping", Ping).AllowAnonymous();
        return group;
    }
}