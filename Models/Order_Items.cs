namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Order_Items
    {
        [Key]
        public int Order_Item_ID { get; set; }

        public int? Order_ID { get; set; }

        public int? Order_Item_Product_ID { get; set; }

        public int? Order_Item_Product_Units { get; set; }

        [Column(TypeName = "money")]
        public decimal? Order_Item_Product_Price { get; set; }

        [Column(TypeName = "money")]
        public decimal? Order_Item_Discount { get; set; }

        [Column(TypeName = "money")]
        public decimal? Order_Item_Total { get; set; }

        public virtual Order Order { get; set; }

        public virtual Product Product { get; set; }
    }
}
