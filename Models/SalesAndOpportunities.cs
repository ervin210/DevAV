using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DevAV.Models
{
    [Serializable]
    public class SalesAndOpportunities
    {
        public SalesAndOpportunities(int year)
        {
            Year = year;
            Sale = 0;
            Opportunity = 0;
        }
        
        public int Year { get; set; }
        public decimal Sale { get; set; }
        public decimal Opportunity { get; set; }
    }
    public class SalesOrOpportunitiesByCategory {
        public string Name { get; set; }
        public decimal? Value { get; set; }
    }

    public class ProductSaleInfo {
        public int? ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductCategory { get; set; }
        public int? StateId { get; set; }
        public string City { get; set; }
        public decimal Total { get; set; }
    }
}