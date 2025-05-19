using CosmoCargo.Model;

namespace CosmoCargo.Services;

/// <summary>
///     Provides weighted random selection of chaos events based on their probability weights.
/// </summary>
public class WeightedRandomSelector
{
    private readonly Random _random;

    /// <summary>
    ///     Initializes a new instance of the <see cref="WeightedRandomSelector" /> class.
    /// </summary>
    public WeightedRandomSelector()
    {
        _random = new Random();
    }

    /// <summary>
    ///     Selects a chaos event from the provided list, weighted by the Weight property.
    /// </summary>
    /// <param name="events">A collection of ChaosEventDefinition objects with weights.</param>
    /// <returns>A randomly selected ChaosEventDefinition, or null if the list is empty or all weights are zero.</returns>
    /// <remarks>
    ///     Algorithm:
    ///     1. Sum all weights.
    ///     2. Generate a random number between 0 and total weight.
    ///     3. Iterate through the events, subtracting each weight, and return the event where the running total crosses the
    ///     random value.
    /// </remarks>
    public ChaosEventDefinition? SelectEvent(IEnumerable<ChaosEventDefinition> events)
    {
        var eventList = events.ToList();
        if (!eventList.Any())
            return null;

        var totalWeight = eventList.Sum(e => e.Weight);
        if (totalWeight <= 0)
            return null;

        var r = _random.NextDouble() * totalWeight;
        double cumulative = 0;
        foreach (var e in eventList)
        {
            cumulative += e.Weight;
            if (r < cumulative)
                return e;
        }

        // Fallback (should not happen)
        return eventList.Last();
    }
}