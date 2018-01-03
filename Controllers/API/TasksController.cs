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
    public class TasksController : ODataController
    {
        private DevAVContext db = new DevAVContext();

        // GET: odata/Tasks
        [Queryable(MaxNodeCount = 300)]
        public IQueryable<Task> GetTasks()
        {
            return db.Tasks;
        }

        // GET: odata/Tasks(5)
        [Queryable]
        public SingleResult<Task> GetTask([FromODataUri] int key)
        {
            return SingleResult.Create(db.Tasks.Where(task => task.Task_ID == key));
        }

         

        // PUT: odata/Tasks(5)
        public IHttpActionResult Put([FromODataUri] int key, Task task)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != task.Task_ID)
            {
                return BadRequest();
            }

            db.Entry(task).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(task);
        }

        // POST: odata/Tasks
        public IHttpActionResult Post(Task task)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Tasks.Add(task);
            db.SaveChanges();

            return Created(task);
        }

        // PATCH: odata/Tasks(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Task> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Task task = db.Tasks.Find(key);
            if (task == null)
            {
                return NotFound();
            }

            patch.Patch(task);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(task);
        }

        // DELETE: odata/Tasks(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Task task = db.Tasks.Find(key);
            if (task == null)
            {
                return NotFound();
            }

            db.Tasks.Remove(task);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

         

        // GET: odata/Tasks(5)/Customer_Employees
        [Queryable]
        public SingleResult<Customer_Employees> GetCustomer_Employees([FromODataUri] int key)
        {
            return SingleResult.Create(db.Tasks.Where(m => m.Task_ID == key).Select(m => m.Customer_Employees));
        }

        // GET: odata/Tasks(5)/Owner
        [Queryable]
        public SingleResult<Employee> GetOwner([FromODataUri] int key)
        {
            return SingleResult.Create(db.Tasks.Where(m => m.Task_ID == key).Select(m => m.Owner));
        }

        // GET: odata/Tasks(5)/ResponsibleEmployee
        [Queryable]
        public SingleResult<Employee> GetResponsibleEmployee([FromODataUri] int key)
        {
            return SingleResult.Create(db.Tasks.Where(m => m.Task_ID == key).Select(m => m.ResponsibleEmployee));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TaskExists(int key)
        {
            return db.Tasks.Count(e => e.Task_ID == key) > 0;
        }
    }
}
