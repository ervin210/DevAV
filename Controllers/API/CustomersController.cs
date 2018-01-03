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
    public class CustomersController : ODataController
    {
        private DevAVContext db = new DevAVContext();

        // GET: odata/Customers
        [Queryable]
        public IQueryable<Customer> GetCustomers()
        {
            return db.Customers;
        }

        // GET: odata/Customers(5)
        [Queryable]
        public SingleResult<Customer> GetCustomer([FromODataUri] int key)
        {
            return SingleResult.Create(db.Customers.Where(customer => customer.Customer_ID == key));
        }

         

        // PUT: odata/Customers(5)
        public IHttpActionResult Put([FromODataUri] int key, Customer customer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != customer.Customer_ID)
            {
                return BadRequest();
            }

            db.Entry(customer).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(customer);
        }

        // POST: odata/Customers
        public IHttpActionResult Post(Customer customer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Customers.Add(customer);
            db.SaveChanges();

            return Created(customer);
        }

        // PATCH: odata/Customers(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Customer> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Customer customer = db.Customers.Find(key);
            if (customer == null)
            {
                return NotFound();
            }

            patch.Patch(customer);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(customer);
        }

        // DELETE: odata/Customers(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Customer customer = db.Customers.Find(key);
            if (customer == null)
            {
                return NotFound();
            }

            db.Customers.Remove(customer);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

         

        // GET: odata/Customers(5)/Customer_Employees
        [Queryable]
        public IQueryable<Customer_Employees> GetCustomer_Employees([FromODataUri] int key)
        {
            return db.Customers.Where(m => m.Customer_ID == key).SelectMany(m => m.Customer_Employees);
        }

        // GET: odata/Customers(5)/Customer_Store_Locations
        [Queryable]
        public IQueryable<Customer_Store_Locations> GetCustomer_Store_Locations([FromODataUri] int key)
        {
            return db.Customers.Where(m => m.Customer_ID == key).SelectMany(m => m.Customer_Store_Locations);
        }

        // GET: odata/Customers(5)/Orders
        [Queryable]
        public IQueryable<Order> GetOrders([FromODataUri] int key)
        {
            return db.Customers.Where(m => m.Customer_ID == key).SelectMany(m => m.Orders);
        }

        // GET: odata/Customers(5)/Quotes
        [Queryable]
        public IQueryable<Quote> GetQuotes([FromODataUri] int key)
        {
            return db.Customers.Where(m => m.Customer_ID == key).SelectMany(m => m.Quotes);
        }

        // GET: odata/Customers(5)/State
        [Queryable]
        public SingleResult<State> GetState([FromODataUri] int key)
        {
            return SingleResult.Create(db.Customers.Where(m => m.Customer_ID == key).Select(m => m.State));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CustomerExists(int key)
        {
            return db.Customers.Count(e => e.Customer_ID == key) > 0;
        }
    }
}
