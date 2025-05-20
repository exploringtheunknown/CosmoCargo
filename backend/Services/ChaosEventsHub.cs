using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace CosmoCargo.Services;

[Authorize(Policy = "Admin")]
public class ChaosEventsHub : Hub
{
    // No public methods needed for now; server will broadcast events.
}