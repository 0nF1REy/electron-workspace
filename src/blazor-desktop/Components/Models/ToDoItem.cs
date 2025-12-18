using System;
using System.ComponentModel.DataAnnotations;

namespace blazor_desktop.Models
{
    public class ToDoItem
    {
        [Key]
        public string Id { get; set; }

        [StringLength(80)]
        [Required]
        public string Description { get; set; }

        public bool IsDone { get; set; }
    }
}
