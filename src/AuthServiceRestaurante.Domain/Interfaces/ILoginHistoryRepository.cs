using AuthServiceRestaurante.Domain.Entities;

namespace AuthServiceRestaurante.Domain.Interfaces;

public interface ILoginHistoryRepository
{
    Task CreateAsync(LoginHistory loginHistory);
    Task<IEnumerable<LoginHistory>> GetByUserIdAsync(Guid userId);
}
