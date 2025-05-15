using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace CosmoCargo.Utils
{
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
    }
} 