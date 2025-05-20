using CosmoCargo.Model;
using CosmoCargo.Services;

namespace CosmoCargo.UnitTests;

public class WeightedRandomSelectorTests
{
    [Fact]
    public void SelectEvent_ReturnsNull_ForEmptyList()
    {
        var selector = new WeightedRandomSelector();
        var result = selector.SelectEvent(new List<ChaosEventDefinition>());
        Assert.Null(result);
    }

    [Fact]
    public void SelectEvent_ReturnsNull_ForAllZeroWeights()
    {
        var selector = new WeightedRandomSelector();
        var events = new List<ChaosEventDefinition>
        {
            new() { Name = "A", Weight = 0 },
            new() { Name = "B", Weight = 0 }
        };
        var result = selector.SelectEvent(events);
        Assert.Null(result);
    }

    [Fact]
    public void SelectEvent_ReturnsOnlyEvent_IfOnePresent()
    {
        var selector = new WeightedRandomSelector();
        var single = new ChaosEventDefinition { Name = "Solo", Weight = 42 };
        var result = selector.SelectEvent(new[] { single });
        Assert.Equal(single, result);
    }

    [Fact]
    public void SelectEvent_WeightedDistribution_IsRoughlyCorrect()
    {
        var selector = new WeightedRandomSelector();
        var events = new List<ChaosEventDefinition>
        {
            new() { Name = "A", Weight = 1 },
            new() { Name = "B", Weight = 3 }
        };
        var counts = new Dictionary<string, int> { { "A", 0 }, { "B", 0 } };
        for (var i = 0; i < 10000; i++)
        {
            var result = selector.SelectEvent(events);
            Assert.NotNull(result);
            counts[result!.Name]++;
        }

        // B should be about 3x as likely as A
        Assert.True(counts["B"] > counts["A"] * 2.5 && counts["B"] < counts["A"] * 3.5);
    }
}