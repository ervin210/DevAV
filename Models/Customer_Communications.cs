namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Customer_Communications
    {
        [Key]
        public int Comm_ID { get; set; }

        public int? Comm_Employee_ID { get; set; }

        public int? Comm_Customer_Employee_ID { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? Comm_Date { get; set; }

        [StringLength(25)]
        public string Comm_Type { get; set; }

        [StringLength(255)]
        public string Comm_Purpose { get; set; }

        public virtual Customer_Employees Customer_Employees { get; set; }

        public virtual Employee Employee { get; set; }
    }
}
