namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Department
    {
        public Department()
        {
            Employees = new HashSet<Employee>();
        }

        [Key]
        public int Department_ID { get; set; }

        [StringLength(25)]
        public string Department_Name { get; set; }

        public virtual ICollection<Employee> Employees { get; set; }
    }
}
