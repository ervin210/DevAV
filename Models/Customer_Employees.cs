namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Customer_Employees
    {
        public Customer_Employees()
        {
            Customer_Communications = new HashSet<Customer_Communications>();
            Tasks = new HashSet<Task>();
        }

        [Key]
        public int Customer_Employee_ID { get; set; }

        public int? Customer_ID { get; set; }

        public int? Customer_Store_ID { get; set; }

        [StringLength(255)]
        public string Customer_Employee_First_Name { get; set; }

        [StringLength(255)]
        public string Customer_Employee_Last_Name { get; set; }

        [StringLength(255)]
        public string Customer_Employee_Full_Name { get; set; }

        [StringLength(15)]
        public string Customer_Employee_Prefix { get; set; }

        [StringLength(25)]
        public string Customer_Employee_Position { get; set; }

        [StringLength(255)]
        public string Customer_Employee_Mobile_Phone { get; set; }

        [StringLength(100)]
        public string Customer_Employee_Email { get; set; }

        public bool? Customer_Purchase_Authority { get; set; }

        public byte[] Customer_Employee_Picture { get; set; }

        [Column(TypeName = "timestamp")]
        [MaxLength(8)]
        [Timestamp]
        public byte[] SSMA_TimeStamp { get; set; }

        public virtual ICollection<Customer_Communications> Customer_Communications { get; set; }

        public virtual Customer Customer { get; set; }

        public virtual Customer_Store_Locations Store { get; set; }

        public virtual ICollection<Task> Tasks { get; set; }
    }
}
