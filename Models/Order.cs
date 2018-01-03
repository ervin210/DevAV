namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Order
    {
        public Order()
        {
            Order_Items = new HashSet<Order_Items>();
        }

        [Key]
        public int Order_ID { get; set; }

        public int? Order_Invoice_Number { get; set; }

        public int? Order_Customer_ID { get; set; }

        public int? Order_Customer_Location_ID { get; set; }

        public int? Order_PO_Number { get; set; }

        public int? Order_Employee_ID { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? Order_Date { get; set; }

        [Column(TypeName = "money")]
        public decimal? Order_Sale_Amount { get; set; }

        [Column(TypeName = "money")]
        public decimal? Order_Shipping_Amount { get; set; }

        [Column(TypeName = "money")]
        public decimal? Order_Total_Amount { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? Order_Ship_Date { get; set; }

        [StringLength(15)]
        public string Order_Ship_Method { get; set; }

        [StringLength(15)]
        public string Order_Terms { get; set; }

        [StringLength(255)]
        public string Order_Comments { get; set; }

        public virtual Customer Customer { get; set; }

        public virtual Customer_Store_Locations Customer_Store_Locations { get; set; }

        public virtual Employee Employee { get; set; }

        public virtual ICollection<Order_Items> Order_Items { get; set; }
    }
}
