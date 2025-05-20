namespace CosmoCargo.Utils;

public static class AuthorizationExtensions
{
    public static IServiceCollection AddCosmoCargoAuthorization(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
            options.AddPolicy("Pilot", policy => policy.RequireRole("Pilot"));
            options.AddPolicy("Customer", policy => policy.RequireRole("Customer"));
        });
        return services;
    }
}