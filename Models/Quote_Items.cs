namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Quote_Items
    {
        [Key]
        public int Quote_Item_ID { get; set; }

        public int? Quote_ID { get; set; }

        public int? Quote_Item_Product_ID { get; set; }

        public int? Quote_Item_Product_Units { get; set; }

        [Column(TypeName = "money")]
        public decimal? Quote_Item_Product_Price { get; set; }

        [Column(TypeName = "money")]
        public decimal? Quote_Item_Discount { get; set; }

        [Column(TypeName = "money")]
        public decimal? Quote_Item_Total { get; set; }

        public virtual Product Product { get; set; }

        public virtual Quote Quote { get; set; }
    }
}
