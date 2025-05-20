using CosmoCargo.Data;
using CosmoCargo.Model;

namespace CosmoCargo.Services;

public class AppSettingsService
{
    private readonly IConfiguration _config;
    private readonly AppDbContext _db;

    public AppSettingsService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<int> GetIntValueAsync(string key, int fallback)
    {
        var setting = await _db.AppSettings.FindAsync(key);
        if (setting != null && int.TryParse(setting.Value, out var val))
            return val;
        // fallback to config
        var configVal = _config[key];
        if (int.TryParse(configVal, out var configInt))
            return configInt;
        return fallback;
    }

    public async Task SetIntValueAsync(string key, int value)
    {
        var setting = await _db.AppSettings.FindAsync(key);
        if (setting == null)
        {
            setting = new AppSetting { Key = key, Value = value.ToString() };
            _db.AppSettings.Add(setting);
        }
        else
        {
            setting.Value = value.ToString();
            _db.AppSettings.Update(setting);
        }

        await _db.SaveChangesAsync();
    }
}