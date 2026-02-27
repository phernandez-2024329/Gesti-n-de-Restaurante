using AuthServiceRestaurante.Domain.Entities;
using AuthServiceRestaurante.Domain.Interfaces;
using AuthServiceRestaurante.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace AuthServiceRestaurante.Persistence.Repositories;

public class LoginHistoryRepository(ApplicationDbContext context) : ILoginHistoryRepository
{
    public async Task CreateAsync(LoginHistory loginHistory)
    {
        context.LoginHistories.Add(loginHistory);
        await context.SaveChangesAsync();
    }

    public async Task<IEnumerable<LoginHistory>> GetByUserIdAsync(Guid userId)
    {
        return await context.LoginHistories
            .Where(lh => lh.UserId == userId)
            .OrderByDescending(lh => lh.LoginDate)
            .ToListAsync();
    }
}
