namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Employee
    {
        public Employee()
        {
            Customer_Communications = new HashSet<Customer_Communications>();
            PersonEvaluations = new HashSet<Evaluation>();
            CreatedEvaluations = new HashSet<Evaluation>();
            Orders = new HashSet<Order>();
            SupportManagerProducts = new HashSet<Product>();
            EngineerProducts = new HashSet<Product>();
            Quotes = new HashSet<Quote>();
            OwnerTasks = new HashSet<Task>();
            ResponsibleTasks = new HashSet<Task>();
        }

        [Key]
        public int Employee_ID { get; set; }

        [StringLength(255)]
        public string Employee_First_Name { get; set; }

        [StringLength(255)]
        public string Employee_Last_Name { get; set; }

        [StringLength(255)]
        public string Employee_Full_Name { get; set; }

        [StringLength(5)]
        public string Employee_Prefix { get; set; }

        [StringLength(25)]
        public string Employee_Title { get; set; }

        public byte[] Employee_Picture { get; set; }

        [StringLength(255)]
        public string Employee_Address { get; set; }

        [StringLength(255)]
        public string Employee_City { get; set; }

        public int? Employee_State_ID { get; set; }

        public int? Employee_Zipcode { get; set; }

        [StringLength(100)]
        public string Employee_Email { get; set; }

        [StringLength(100)]
        public string Employee_Skype { get; set; }

        [StringLength(25)]
        public string Employee_Mobile_Phone { get; set; }

        [StringLength(255)]
        public string Employee_Home_Phone { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? Employee_Birth_Date { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? Employee_Hire_Date { get; set; }

        public int? Employee_Department_ID { get; set; }

        [StringLength(25)]
        public string Employee_Status { get; set; }

        public string Employee_Personal_Profile { get; set; }

        public int? Probation_Reason { get; set; }

        [Column(TypeName = "timestamp")]
        [MaxLength(8)]
        [Timestamp]
        public byte[] SSMA_TimeStamp { get; set; }

        public virtual ICollection<Customer_Communications> Customer_Communications { get; set; }

        public virtual Department Department { get; set; }

        public virtual State State { get; set; }

        public virtual ICollection<Evaluation> PersonEvaluations { get; set; }

        public virtual ICollection<Evaluation> CreatedEvaluations { get; set; }

        public virtual ICollection<Order> Orders { get; set; }

        public virtual ICollection<Product> SupportManagerProducts { get; set; }

        public virtual ICollection<Product> EngineerProducts { get; set; }

        public virtual ICollection<Quote> Quotes { get; set; }

        public virtual ICollection<Task> OwnerTasks { get; set; }

        public virtual ICollection<Task> ResponsibleTasks { get; set; }
    }
}
