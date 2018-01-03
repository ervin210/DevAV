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

namespace DevAV.Controllers.API
{
    public partial class ProductsController : ODataController
    {
        private DevAVContext db = new DevAVContext();

        // GET: odata/Products
        [Queryable]
        public IQueryable<Product> GetProducts()
        {
            return db.Products;
        }

        // GET: odata/Products(5)
        [Queryable]
        public SingleResult<Product> GetProduct([FromODataUri] int key)
        {
            return SingleResult.Create(db.Products.Where(product => product.Product_ID == key));
        }

         

        // PUT: odata/Products(5)
        public IHttpActionResult Put([FromODataUri] int key, Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != product.Product_ID)
            {
                return BadRequest();
            }

            db.Entry(product).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(product);
        }

       // POST: odata/Products
        public IHttpActionResult Post(Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Products.Add(product);
            db.SaveChanges();

            return Created(product);
        }

        // PATCH: odata/Products(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Product> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Product product = db.Products.Find(key);
            if (product == null)
            {
                return NotFound();
            }

            patch.Patch(product);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(product);
        }

        // DELETE: odata/Products(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Product product = db.Products.Find(key);
            if (product == null)
            {
                return NotFound();
            }

            db.Products.Remove(product);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

         

        // GET: odata/Products(5)/Engineer
        [Queryable]
        public SingleResult<Employee> GetEngineer([FromODataUri] int key)
        {
            return SingleResult.Create(db.Products.Where(m => m.Product_ID == key).Select(m => m.Engineer));
        }

        // GET: odata/Products(5)/Order_Items
        [Queryable]
        public IQueryable<Order_Items> GetOrder_Items([FromODataUri] int key)
        {
            return db.Products.Where(m => m.Product_ID == key).SelectMany(m => m.Order_Items);
        }

        // GET: odata/Products(5)/Product_Catalogs
        [Queryable]
        public IQueryable<Product_Catalogs> GetProduct_Catalogs([FromODataUri] int key)
        {
            return db.Products.Where(m => m.Product_ID == key).SelectMany(m => m.Product_Catalogs);
        }

        // GET: odata/Products(5)/Product_Images
        [Queryable]
        public IQueryable<Product_Images> GetProduct_Images([FromODataUri] int key)
        {
            return db.Products.Where(m => m.Product_ID == key).SelectMany(m => m.Product_Images);
        }

        // GET: odata/Products(5)/Quote_Items
        [Queryable]
        public IQueryable<Quote_Items> GetQuote_Items([FromODataUri] int key)
        {
            return db.Products.Where(m => m.Product_ID == key).SelectMany(m => m.Quote_Items);
        }

        // GET: odata/Products(5)/SupportManager
        [Queryable]
        public SingleResult<Employee> GetSupportManager([FromODataUri] int key)
        {
            return SingleResult.Create(db.Products.Where(m => m.Product_ID == key).Select(m => m.SupportManager));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ProductExists(int key)
        {
            return db.Products.Count(e => e.Product_ID == key) > 0;
        }
    }
}
