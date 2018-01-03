using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.OData.Builder;
using DevAV.Models;

namespace DevAV
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );



            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<Product>("Products");
            builder.EntitySet<Product>("Products").EntityType.Collection.Action("GetProductSalesInfo").ReturnsCollectionFromEntitySet<ProductSaleInfo>("GetProductSalesInfo");
            builder.EntitySet<Order_Items>("Order_Items");
            builder.EntitySet<Product_Catalogs>("Product_Catalogs");
            builder.EntitySet<Product_Images>("Product_Images");
            builder.EntitySet<Quote_Items>("Quote_Items"); 
            builder.EntitySet<Task>("Tasks");
            builder.EntitySet<Customer>("Customers"); 
            builder.EntitySet<Customer_Employees>("Customer_Employees");
            builder.Entity<Product>().Action("SalesAndOpportunities").ReturnsCollectionFromEntitySet<SalesAndOpportunities>("SalesAndOpportunities");
            builder.EntitySet<Customer_Store_Locations>("Customer_Store_Locations"); 
            builder.EntitySet<Employee>("Employees");
            builder.EntitySet<Customer_Communications>("Customer_Communications");
            builder.EntitySet<Department>("Departments");
            builder.EntitySet<Order>("Orders");
            builder.EntitySet<Quote>("Quote");
            builder.EntitySet<State>("States");
            builder.EntitySet<Crest>("Crests");
            builder.EntitySet<Evaluation>("Evaluations");
            config.Routes.MapODataRoute("odata", "odata", builder.GetEdmModel());       
        }
                
    }
}
