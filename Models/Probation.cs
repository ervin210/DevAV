namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Probation")]
    public partial class Probation
    {
        public int ID { get; set; }

        [StringLength(50)]
        public string Reason { get; set; }
    }
}
