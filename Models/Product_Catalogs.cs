namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Product_Catalogs
    {
        [Key]
        public int Catalog_ID { get; set; }

        public int? Product_ID { get; set; }

        public byte[] Catalog_PDF { get; set; }

        [Column(TypeName = "timestamp")]
        [MaxLength(8)]
        [Timestamp]
        public byte[] SSMA_TimeStamp { get; set; }

        public virtual Product Product { get; set; }
    }
}
