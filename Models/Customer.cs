namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Customer
    {
        public Customer()
        {
            Customer_Employees = new HashSet<Customer_Employees>();
            Customer_Store_Locations = new HashSet<Customer_Store_Locations>();
            Orders = new HashSet<Order>();
            Quotes = new HashSet<Quote>();
        }

        [Key]
        public int Customer_ID { get; set; }

        [StringLength(255)]
        public string Customer_Name { get; set; }

        [StringLength(255)]
        public string Customer_Address { get; set; }

        [StringLength(50)]
        public string Customer_CIty { get; set; }

        public int? Customer_State { get; set; }

        public int? Customer_Zipcode { get; set; }

        [StringLength(255)]
        public string Customer_Billing_Address { get; set; }

        [StringLength(255)]
        public string Customer_Billing_City { get; set; }

        public int? Customer_Billing_State { get; set; }

        public int? Customer_Billing_Zipcode { get; set; }

        [StringLength(25)]
        public string Customer_Phone { get; set; }

        [StringLength(25)]
        public string Customer_Fax { get; set; }

        [StringLength(100)]
        public string Customer_Website { get; set; }

        [Column(TypeName = "money")]
        public decimal? Customer_Annual_Revenue { get; set; }

        public int? Customer_Total_Stores { get; set; }

        public int? Customer_Total_Employees { get; set; }

        [StringLength(25)]
        public string Customer_Status { get; set; }

        public byte[] Customer_Logo { get; set; }

        public string Customer_Profile { get; set; }

        [Column(TypeName = "timestamp")]
        [MaxLength(8)]
        [Timestamp]
        public byte[] SSMA_TimeStamp { get; set; }

        public virtual State State { get; set; }

        public virtual ICollection<Customer_Employees> Customer_Employees { get; set; }

        public virtual ICollection<Customer_Store_Locations> Customer_Store_Locations { get; set; }

        public virtual ICollection<Order> Orders { get; set; }

        public virtual ICollection<Quote> Quotes { get; set; }
    }
}
