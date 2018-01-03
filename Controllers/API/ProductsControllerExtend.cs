using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using DevAV.Models;

namespace DevAV.Controllers.API {
    public partial class ProductsController : ODataController {
        // POST: odata/Products(key)/SalesAndOpportunities
        public IEnumerable<SalesAndOpportunities> SalesAndOpportunities([FromODataUri] int key) {
            var sales = from item in db.Order_Items
                        where item.Order_Item_Product_ID == key
                        group item by item.Order.Order_Date.Value.Year into g
                        select new { Year = g.Key, Total = g.Sum(item => item.Order_Item_Total.Value) };

            var opportunities = from item in db.Quote_Items
                                where item.Quote_Item_Product_ID == key
                                group item by item.Quote.Quote_Date.Value.Year into g
                                select new { Year = g.Key, Total = g.Sum(item => item.Quote_Item_Total.Value) };

            var result = new Dictionary<int, SalesAndOpportunities>();
            foreach(var sale in sales) {
                result.Add(sale.Year, new SalesAndOpportunities(sale.Year) { Sale = sale.Total });
            }
            foreach(var op in opportunities) {
                if(!result.ContainsKey(op.Year)) {
                    result.Add(op.Year, new SalesAndOpportunities(op.Year));
                }
                result[op.Year].Opportunity = op.Total;
            }
            return result.Values.ToList();
        }

        // POST: odata/Products/GetProductSalesInfo
        [HttpPost]
        public IEnumerable<ProductSaleInfo> GetProductSalesInfo() {
            return db.Order_Items.Select(item => new ProductSaleInfo() {
                ProductId = item.Order_Item_Product_ID,
                ProductName = db.Products.Where(product => product.Product_ID == item.Order_Item_Product_ID).FirstOrDefault().Product_Name,
                ProductCategory = db.Products.Where(product => product.Product_ID == item.Order_Item_Product_ID).FirstOrDefault().Product_Category,
                StateId = db.Customer_Store_Locations.Where(store => store.Customer_Store_ID == item.Order.Order_Customer_Location_ID).FirstOrDefault().Customer_Store_State,
                City = db.Customer_Store_Locations.Where(store => store.Customer_Store_ID == item.Order.Order_Customer_Location_ID).FirstOrDefault().Customer_Store_City,
                Total = item.Order_Item_Total.Value
            });
        }
    }
}
