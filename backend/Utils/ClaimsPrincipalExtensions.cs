using System.Security.Claims;

namespace CosmoCargo.Utils
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetRole(this ClaimsPrincipal user) => user.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
        public static Guid? GetUserId(this ClaimsPrincipal user)
        {
            var value = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(value, out var guid))
                return guid;
            return null;
        }


    }
}
