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
    public class Customer_EmployeesController : ODataController
    {
        private DevAVContext db = new DevAVContext();

        // GET: odata/Customer_Employees
        [Queryable]
        public IQueryable<Customer_Employees> GetCustomer_Employees()
        {
            return db.Customer_Employees;
        }

        // GET: odata/Customer_Employees(5)
        [Queryable]
        public SingleResult<Customer_Employees> GetCustomer_Employees([FromODataUri] int key)
        {
            return SingleResult.Create(db.Customer_Employees.Where(customer_Employees => customer_Employees.Customer_Employee_ID == key));
        }

        // PUT: odata/Customer_Employees(5)
        //public IHttpActionResult Put([FromODataUri] int key, Customer_Employees customer_Employees)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (key != customer_Employees.Customer_Employee_ID)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(customer_Employees).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!Customer_EmployeesExists(key))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return Updated(customer_Employees);
        //}

        // POST: odata/Customer_Employees
        //public IHttpActionResult Post(Customer_Employees customer_Employees)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.Customer_Employees.Add(customer_Employees);
        //    db.SaveChanges();

        //    return Created(customer_Employees);
        //}

         

        // PATCH: odata/Customer_Employees(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Customer_Employees> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Customer_Employees customer_Employees = db.Customer_Employees.Find(key);
            if (customer_Employees == null)
            {
                return NotFound();
            }

            patch.Patch(customer_Employees);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Customer_EmployeesExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(customer_Employees);
        }

         

        // DELETE: odata/Customer_Employees(5)
        //public IHttpActionResult Delete([FromODataUri] int key)
        //{
        //    Customer_Employees customer_Employees = db.Customer_Employees.Find(key);
        //    if (customer_Employees == null)
        //    {
        //        return NotFound();
        //    }

        //    db.Customer_Employees.Remove(customer_Employees);
        //    db.SaveChanges();

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        // GET: odata/Customer_Employees(5)/Customer
        [Queryable]
        public SingleResult<Customer> GetCustomer([FromODataUri] int key)
        {
            return SingleResult.Create(db.Customer_Employees.Where(m => m.Customer_Employee_ID == key).Select(m => m.Customer));
        }

        // GET: odata/Customer_Employees(5)/Customer_Communications
        [Queryable]
        public IQueryable<Customer_Communications> GetCustomer_Communications([FromODataUri] int key)
        {
            return db.Customer_Employees.Where(m => m.Customer_Employee_ID == key).SelectMany(m => m.Customer_Communications);
        }

        // GET: odata/Customer_Employees(5)/Store
        [Queryable]
        public SingleResult<Customer_Store_Locations> GetStore([FromODataUri] int key)
        {
            return SingleResult.Create(db.Customer_Employees.Where(m => m.Customer_Employee_ID == key).Select(m => m.Store));
        }

        // GET: odata/Customer_Employees(5)/Tasks
        [Queryable]
        public IQueryable<Task> GetTasks([FromODataUri] int key)
        {
            return db.Customer_Employees.Where(m => m.Customer_Employee_ID == key).SelectMany(m => m.Tasks);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Customer_EmployeesExists(int key)
        {
            return db.Customer_Employees.Count(e => e.Customer_Employee_ID == key) > 0;
        }
    }
}
