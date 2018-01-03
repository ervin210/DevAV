namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Evaluation
    {
        [Key]
        public int Note_ID { get; set; }

        public int? Created_By_ID { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? Created_On { get; set; }

        public int? Employee_ID { get; set; }

        [StringLength(255)]
        public string Subject { get; set; }

        public string Details { get; set; }

        [Column(TypeName = "timestamp")]
        [MaxLength(8)]
        [Timestamp]
        public byte[] SSMA_TimeStamp { get; set; }

        public virtual Employee Employee { get; set; }

        public virtual Employee Reviewer { get; set; }
    }
}
