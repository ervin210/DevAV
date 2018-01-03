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
    public class StatesController : ODataController
    {
        private DevAVContext db = new DevAVContext();

        // GET: odata/States
        [Queryable]
        public IQueryable<State> GetStates()
        {
            return db.States;
        }

        // GET: odata/States(5)
        [Queryable]
        public SingleResult<State> GetState([FromODataUri] int key)
        {
            return SingleResult.Create(db.States.Where(state => state.Sate_ID == key));
        }

        // PUT: odata/States(5)
        //public IHttpActionResult Put([FromODataUri] int key, State state)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (key != state.Sate_ID)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(state).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!StateExists(key))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return Updated(state);
        //}

        // POST: odata/States
        //public IHttpActionResult Post(State state)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.States.Add(state);
        //    db.SaveChanges();

        //    return Created(state);
        //}

        // PATCH: odata/States(5)
        //[AcceptVerbs("PATCH", "MERGE")]
        //public IHttpActionResult Patch([FromODataUri] int key, Delta<State> patch)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    State state = db.States.Find(key);
        //    if (state == null)
        //    {
        //        return NotFound();
        //    }

        //    patch.Patch(state);

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!StateExists(key))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return Updated(state);
        //}

        // DELETE: odata/States(5)
        //public IHttpActionResult Delete([FromODataUri] int key)
        //{
        //    State state = db.States.Find(key);
        //    if (state == null)
        //    {
        //        return NotFound();
        //    }

        //    db.States.Remove(state);
        //    db.SaveChanges();

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        // GET: odata/States(5)/Customers
        [Queryable]
        public IQueryable<Customer> GetCustomers([FromODataUri] int key)
        {
            return db.States.Where(m => m.Sate_ID == key).SelectMany(m => m.Customers);
        }

        // GET: odata/States(5)/Employees
        [Queryable]
        public IQueryable<Employee> GetEmployees([FromODataUri] int key)
        {
            return db.States.Where(m => m.Sate_ID == key).SelectMany(m => m.Employees);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StateExists(int key)
        {
            return db.States.Count(e => e.Sate_ID == key) > 0;
        }
    }
}
