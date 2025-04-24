using CosmoCargo.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace CosmoCargo.Endpoints
{
    public static class AuthEndpoints
    {
        public static async Task<IResult> Login(
            LoginRequest request,
            IUserService userService,
            HttpContext context)
        {
            Console.WriteLine($"Login request received: {request.Email + " " + request.Password}");
            if (!await userService.ValidateUserCredentialsAsync(request.Email, request.Password))
                return Results.Unauthorized();

            Console.WriteLine("Auth passed");
            var user = await userService.GetUserByEmailAsync(request.Email);
            if (user == null)
                return Results.Unauthorized();

            Console.WriteLine("User found");
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7),
                AllowRefresh = true
            };

            await context.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            Console.WriteLine("Signed in");

            return Results.Ok("");
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
