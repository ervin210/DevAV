namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Quote
    {
        public Quote()
        {
            Quote_Items = new HashSet<Quote_Items>();
        }

        [Key]
        public int Quote_ID { get; set; }

        public int? Quote_Number { get; set; }

        public int? Quote_Customer_ID { get; set; }

        public int? Quote_Customer_Location_ID { get; set; }

        public int? Quote_Employee_ID { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? Quote_Date { get; set; }

        [Column(TypeName = "money")]
        public decimal? Quote_SubTotal { get; set; }

        [Column(TypeName = "money")]
        public decimal? Quote_Shipping_Amount { get; set; }

        [Column(TypeName = "money")]
        public decimal? Order_Total { get; set; }

        [Column(TypeName = "money")]
        public decimal? Quote_Total { get; set; }

        public float? Quote_Opportunity { get; set; }

        public virtual Customer Customer { get; set; }

        public virtual Employee Employee { get; set; }

        public virtual ICollection<Quote_Items> Quote_Items { get; set; }
    }
}
