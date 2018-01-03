namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class State
    {
        public State()
        {
            Employees = new HashSet<Employee>();
        }

        [Key]
        public int Sate_ID { get; set; }

        [StringLength(2)]
        public string State_Short { get; set; }

        [StringLength(255)]
        public string State_Long { get; set; }

        public byte[] Flag_48px { get; set; }

        public byte[] Flag_24px { get; set; }

        [Column(TypeName = "timestamp")]
        [MaxLength(8)]
        [Timestamp]
        public byte[] SSMA_TimeStamp { get; set; }

        public virtual ICollection<Employee> Employees { get; set; }

        public virtual ICollection<Customer> Customers { get; set; }
    }
}
