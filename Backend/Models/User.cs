using System.ComponentModel.DataAnnotations;

namespace RealPlaza.Backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public string? Email { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public string? Role { get; set; }

        public string? Department { get; set; }

        public string? PhoneNumber { get; set; }

        public bool CanEditUsers { get; set; } = false;

        public bool CanDeleteUsers { get; set; } = false;

        public bool CanViewReports { get; set; } = false;

        public DateTime? LastLogin { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
