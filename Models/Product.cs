namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Product
    {
        public Product()
        {
            Order_Items = new HashSet<Order_Items>();
            Product_Catalogs = new HashSet<Product_Catalogs>();
            Product_Images = new HashSet<Product_Images>();
            Quote_Items = new HashSet<Quote_Items>();
        }

        [Key]
        public int Product_ID { get; set; }

        [StringLength(50)]
        public string Product_Name { get; set; }

        public string Product_Description { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? Product_Production_Start { get; set; }

        public bool? Product_Available { get; set; }

        public byte[] Product_Image { get; set; }

        public int? Product_Support_ID { get; set; }

        public int? Product_Engineer_ID { get; set; }

        public int? Product_Current_Inventory { get; set; }

        public int? Product_Backorder { get; set; }

        public int? Product_Manufacturing { get; set; }

        public byte[] Product_Barcode { get; set; }

        public byte[] Product_Primary_Image { get; set; }

        [Column(TypeName = "money")]
        public decimal? Product_Cost { get; set; }

        [Column(TypeName = "money")]
        public decimal? Product_Sale_Price { get; set; }

        [Column(TypeName = "money")]
        public decimal? Product_Retail_Price { get; set; }

        public double? Product_Consumer_Rating { get; set; }

        [StringLength(15)]
        public string Product_Category { get; set; }

        [Column(TypeName = "timestamp")]
        [MaxLength(8)]
        [Timestamp]
        public byte[] SSMA_TimeStamp { get; set; }

        public virtual Employee Engineer { get; set; }

        public virtual Employee SupportManager { get; set; }

        public virtual ICollection<Order_Items> Order_Items { get; set; }

        public virtual ICollection<Product_Catalogs> Product_Catalogs { get; set; }

        public virtual ICollection<Product_Images> Product_Images { get; set; }

        public virtual ICollection<Quote_Items> Quote_Items { get; set; }
    }
}
