namespace DevAV.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Task
    {
        [Key]
        public int Task_ID { get; set; }

        public int? Task_Assigned_Employee_ID { get; set; }

        public int? Task_Owner_ID { get; set; }

        public int? Task_Customer_Employee_ID { get; set; }

        [StringLength(255)]
        public string Task_Subject { get; set; }

        public string Task_Description { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? Task_Start_Date { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? Task_Due_Date { get; set; }

        [StringLength(25)]
        public string Task_Status { get; set; }

        public int Task_Priority { get; set; }

        public int? Task_Completion { get; set; }

        public bool? Task_Reminder { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? Task_Reminder_Date { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? Task_Reminder_Time { get; set; }

        [Column(TypeName = "timestamp")]
        [MaxLength(8)]
        [Timestamp]
        public byte[] SSMA_TimeStamp { get; set; }

        public virtual Customer_Employees Customer_Employees { get; set; }

        public virtual Employee ResponsibleEmployee { get; set; }

        public virtual Employee Owner { get; set; }
    }
}
