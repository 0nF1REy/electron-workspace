using System;
using blazor_desktop.Models;
using Microsoft.EntityFrameworkCore;

namespace blazor_desktop.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {}

        public DbSet<ToDoItem> Items { get; set; }
    }
}
