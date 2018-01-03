namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Customer_Store_Locations
    {
        [Key]
        public int Customer_Store_ID { get; set; }

        public int? Customer_ID { get; set; }

        [StringLength(255)]
        public string Customer_Store_Location { get; set; }

        [StringLength(255)]
        public string Customer_Store_Address { get; set; }

        [StringLength(255)]
        public string Customer_Store_City { get; set; }

        public int? Customer_Store_State { get; set; }

        public int? Customer_Store_Zipcode { get; set; }

        [StringLength(255)]
        public string Customer_Store_Phone { get; set; }

        [StringLength(255)]
        public string Customer_Store_Fax { get; set; }

        public int? Customer_Store_Total_Employees { get; set; }

        public int? Customer_Store_Square_Footage { get; set; }

        [Column(TypeName = "money")]
        public decimal? Customer_Store_Annual_Sales { get; set; }

        public int? Crest_ID { get; set; }

        public virtual Crest Crest { get; set; }

        public virtual Customer Customer { get; set; }

        public virtual ICollection<Customer_Employees> Customer_Employees { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}
