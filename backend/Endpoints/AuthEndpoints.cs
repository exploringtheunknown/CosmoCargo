using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using CosmoCargo.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace CosmoCargo.Endpoints;

public static class AuthEndpoints
{
    public static async Task<IResult> Login(
        LoginRequest request,
        IUserService userService,
        HttpContext context)
    {
        if (!await userService.ValidateUserCredentialsAsync(request.Email, request.Password))
            return Results.Unauthorized();

        var user = await userService.GetUserByEmailAsync(request.Email);
        if (user == null)
            return Results.Unauthorized();

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role.ToString())
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

        return Results.Ok("");
    }

    public static RouteGroupBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth");
        group.MapPost("/login", Login).AllowAnonymous();
        return group;
    }
}

public class LoginRequest
{
    [Required] [EmailAddress] public string Email { get; set; } = string.Empty;

    [Required] public string Password { get; set; } = string.Empty;
}