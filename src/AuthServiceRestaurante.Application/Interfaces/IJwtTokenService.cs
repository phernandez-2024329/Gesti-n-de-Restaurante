
using AuthServiceRestaurante.Domain.Entities;

namespace AuthServiceRestaurante.Application.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}