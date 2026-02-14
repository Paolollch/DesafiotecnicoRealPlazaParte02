using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealPlaza.Backend.Data;
using RealPlaza.Backend.Models;

namespace RealPlaza.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public UsersController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_db.Users.ToList());

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var u = _db.Users.Find(id);
            if (u == null) return NotFound();
            return Ok(u);
        }

        public class CreateUserDto 
        { 
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public string? Email { get; set; }
            public DateTime? DateOfBirth { get; set; }
            public string? Role { get; set; }
            public string? Department { get; set; }
            public string? PhoneNumber { get; set; }
            public bool CanEditUsers { get; set; } = false;
            public bool CanDeleteUsers { get; set; } = false;
            public bool CanViewReports { get; set; } = false;
            public bool IsActive { get; set; } = true;
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateUserDto dto)
        {
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userRole != "admin") return Forbid();

            if (_db.Users.Any(u => u.Username == dto.Username)) return BadRequest(new { message = "El usuario ya existe" });

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Email = dto.Email,
                DateOfBirth = dto.DateOfBirth.HasValue ? DateTime.SpecifyKind(dto.DateOfBirth.Value, DateTimeKind.Utc) : null,
                Role = dto.Role,
                Department = dto.Department,
                PhoneNumber = dto.PhoneNumber,
                CanEditUsers = dto.CanEditUsers,
                CanDeleteUsers = dto.CanDeleteUsers,
                CanViewReports = dto.CanViewReports,
                IsActive = dto.IsActive
            };

            _db.Users.Add(user);
            _db.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CreateUserDto dto)
        {
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userRole != "admin") return Forbid();

            var user = _db.Users.Find(id);
            if (user == null) return NotFound();

            user.Email = dto.Email;
            user.DateOfBirth = dto.DateOfBirth.HasValue ? DateTime.SpecifyKind(dto.DateOfBirth.Value, DateTimeKind.Utc) : null;
            user.Role = dto.Role;
            user.Department = dto.Department;
            user.PhoneNumber = dto.PhoneNumber;
            user.CanEditUsers = dto.CanEditUsers;
            user.CanDeleteUsers = dto.CanDeleteUsers;
            user.CanViewReports = dto.CanViewReports;
            user.IsActive = dto.IsActive;
            if (!string.IsNullOrWhiteSpace(dto.Password)) user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            _db.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userRole != "admin") return Forbid();

            var user = _db.Users.Find(id);
            if (user == null) return NotFound();
            _db.Users.Remove(user);
            _db.SaveChanges();
            return NoContent();
        }
    }
}
