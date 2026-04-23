using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using PakTeachers.Api.Attributes;
using PakTeachers.Api.Services;

namespace PakTeachers.Api.Filters;

public class ConfigValidationFilter(IConfigurationService configService) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var errors = new Dictionary<string, string>();

        foreach (var (_, argument) in context.ActionArguments)
        {
            if (argument is null) continue;

            foreach (var prop in argument.GetType().GetProperties())
            {
                var attr = prop.GetCustomAttributes(typeof(ConfigValidationAttribute), inherit: true)
                               .FirstOrDefault() as ConfigValidationAttribute;
                if (attr is null) continue;

                var raw = prop.GetValue(argument);

                if (raw is null || raw is string s && string.IsNullOrWhiteSpace(s))
                {
                    if (!attr.AllowNull)
                        errors[prop.Name] = $"'{prop.Name}' is required.";
                    continue;
                }

                var value = raw.ToString()!;
                if (!configService.IsValid(attr.ConfigKey, value))
                    errors[prop.Name] = configService.InvalidMessage(attr.ConfigKey, value);
            }
        }

        if (errors.Count > 0)
        {
            context.Result = new UnprocessableEntityObjectResult(new
            {
                success = false,
                message = "Validation failed",
                source  = "ConfigValidationFilter",
                errors
            });
            return;
        }

        await next();
    }
}
