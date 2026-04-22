namespace PakTeachers.Api.Wrappers;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Message { get; set; }
    public object? Errors { get; set; }
    public IEnumerable<string>? Warnings { get; set; }

    public ApiResponse(T data, string? message = null)
    {
        Success = true;
        Data = data;
        Message = message;
    }

    public ApiResponse(string message, object? errors = null)
    {
        Success = false;
        Message = message;
        Errors = errors;
    }
}