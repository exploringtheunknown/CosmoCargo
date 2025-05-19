using System.ComponentModel.DataAnnotations;

namespace CosmoCargo.Utils;

public class ValidationFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        foreach (var arg in context.Arguments)
            if (arg is not null)
            {
                var validationContext = new ValidationContext(arg);
                var results = new List<ValidationResult>();
                if (!Validator.TryValidateObject(arg, validationContext, results, true))
                {
                    var errors = results
                        .SelectMany(r => r.MemberNames.Select(m => new { m, r.ErrorMessage }))
                        .GroupBy(x => x.m)
                        .ToDictionary(
                            g => g.Key,
                            g => g.Select(x => x.ErrorMessage ?? "Invalid value").ToArray()
                        );
                    return Results.ValidationProblem(errors);
                }
            }

        return await next(context);
    }
}