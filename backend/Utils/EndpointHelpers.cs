using System.Security.Claims;
using CosmoCargo.Model;

namespace CosmoCargo.Utils;

public static class EndpointHelpers
{
    public static IResult? TryGetUserIdOrUnauthorized(ClaimsPrincipal user, out Guid userId)
    {
        userId = default;
        var id = user.GetUserId();
        if (id == null)
            return Results.Unauthorized();
        userId = id.Value;
        return null;
    }

    public static IResult? TryGetUserRoleOrForbid(ClaimsPrincipal user, out UserRole role)
    {
        role = default;
        var roleString = user.GetRole();
        if (!Enum.TryParse(roleString, true, out role))
            return Results.Forbid();
        return null;
    }
}