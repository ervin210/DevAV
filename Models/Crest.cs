namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Crest
    {
        public Crest()
        {
            Customer_Store_Locations = new HashSet<Customer_Store_Locations>();
        }

        [Key]
        public int Crest_ID { get; set; }

        [StringLength(255)]
        public string City_Name { get; set; }

        public byte[] Crest_Image { get; set; }

        [Column(TypeName = "timestamp")]
        [MaxLength(8)]
        [Timestamp]
        public byte[] SSMA_TimeStamp { get; set; }

        public virtual ICollection<Customer_Store_Locations> Customer_Store_Locations { get; set; }
    }
}
