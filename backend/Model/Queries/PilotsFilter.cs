namespace CosmoCargo.Model.Queries
{
    public class PilotsFilter : PaginationParams
    {
        public string? Search { get; set; }
        public UserStatus? Status { get; set; }
    }
} 