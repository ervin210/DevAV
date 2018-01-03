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
    public class EmployeesController : ODataController
    {
        private DevAVContext db = new DevAVContext();

        // GET: odata/Employees
        [Queryable]
        public IQueryable<Employee> GetEmployees()
        {
            return db.Employees;
        }

        // GET: odata/Employees(5)
        [Queryable]
        public SingleResult<Employee> GetEmployee([FromODataUri] int key)
        {
            return SingleResult.Create(db.Employees.Where(employee => employee.Employee_ID == key));
        }

         

        // PUT: odata/Employees(5)
        public IHttpActionResult Put([FromODataUri] int key, Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
       
            if (key != employee.Employee_ID)
            {
                return BadRequest();
            }
       
            db.Entry(employee).State = EntityState.Modified;
       
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
       
            return Updated(employee);
        }

        // POST: odata/Employees
        public IHttpActionResult Post(Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Employees.Add(employee);
            db.SaveChanges();

            return Created(employee);
        }

        // PATCH: odata/Employees(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Employee> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Employee employee = db.Employees.Find(key);
            if (employee == null)
            {
                return NotFound();
            }

            patch.Patch(employee);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employee);
        }

        // DELETE: odata/Employees(5)
       public IHttpActionResult Delete([FromODataUri] int key)
       {
       
            IQueryable<Task> tasks = db.Tasks.Where(c => c.Task_Owner_ID == key || c.Task_Assigned_Employee_ID == key);
            foreach(var task in tasks)
            {
                db.Tasks.Remove(task);
            }
       
            IQueryable<Product> products = db.Products.Where(c => c.Product_Support_ID == key || c.Product_Engineer_ID == key);
            foreach(var product in products)
            {
                db.Products.Remove(product);
            }
       
            IQueryable<Evaluation> evaluations = db.Evaluations.Where(c => c.Created_By_ID == key || c.Employee_ID == key);
            foreach(var evaluation in evaluations)
            {
                db.Evaluations.Remove(evaluation);
            }

            Employee employee = db.Employees.Find(key);
            if (employee == null)
            {
                return NotFound();
            }

            db.Employees.Remove(employee);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

         

        // GET: odata/Employees(5)/CreatedEvaluations
        [Queryable]
        public IQueryable<Evaluation> GetCreatedEvaluations([FromODataUri] int key)
        {
            return db.Employees.Where(m => m.Employee_ID == key).SelectMany(m => m.CreatedEvaluations);
        }

        // GET: odata/Employees(5)/Customer_Communications
        [Queryable]
        public IQueryable<Customer_Communications> GetCustomer_Communications([FromODataUri] int key)
        {
            return db.Employees.Where(m => m.Employee_ID == key).SelectMany(m => m.Customer_Communications);
        }

        // GET: odata/Employees(5)/Department
        [Queryable]
        public SingleResult<Department> GetDepartment([FromODataUri] int key)
        {
            return SingleResult.Create(db.Employees.Where(m => m.Employee_ID == key).Select(m => m.Department));
        }

        // GET: odata/Employees(5)/EngineerProducts
        [Queryable]
        public IQueryable<Product> GetEngineerProducts([FromODataUri] int key)
        {
            return db.Employees.Where(m => m.Employee_ID == key).SelectMany(m => m.EngineerProducts);
        }

        // GET: odata/Employees(5)/Orders
        [Queryable]
        public IQueryable<Order> GetOrders([FromODataUri] int key)
        {
            return db.Employees.Where(m => m.Employee_ID == key).SelectMany(m => m.Orders);
        }

        // GET: odata/Employees(5)/OwnerTasks
        [Queryable]
        public IQueryable<Task> GetOwnerTasks([FromODataUri] int key)
        {
            return db.Employees.Where(m => m.Employee_ID == key).SelectMany(m => m.OwnerTasks);
        }

        // GET: odata/Employees(5)/PersonEvaluations
        [Queryable]
        public IQueryable<Evaluation> GetPersonEvaluations([FromODataUri] int key)
        {
            return db.Employees.Where(m => m.Employee_ID == key).SelectMany(m => m.PersonEvaluations);
        }

        // GET: odata/Employees(5)/Quotes
        [Queryable]
        public IQueryable<Quote> GetQuotes([FromODataUri] int key)
        {
            return db.Employees.Where(m => m.Employee_ID == key).SelectMany(m => m.Quotes);
        }

        // GET: odata/Employees(5)/ResponsibleTasks
        [Queryable]
        public IQueryable<Task> GetResponsibleTasks([FromODataUri] int key)
        {
            return db.Employees.Where(m => m.Employee_ID == key).SelectMany(m => m.ResponsibleTasks);
        }

        // GET: odata/Employees(5)/State
        [Queryable]
        public SingleResult<State> GetState([FromODataUri] int key)
        {
            return SingleResult.Create(db.Employees.Where(m => m.Employee_ID == key).Select(m => m.State));
        }

        // GET: odata/Employees(5)/SupportManagerProducts
        [Queryable]
        public IQueryable<Product> GetSupportManagerProducts([FromODataUri] int key)
        {
            return db.Employees.Where(m => m.Employee_ID == key).SelectMany(m => m.SupportManagerProducts);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EmployeeExists(int key)
        {
            return db.Employees.Count(e => e.Employee_ID == key) > 0;
        }
    }
}
