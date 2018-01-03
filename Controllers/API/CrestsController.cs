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

namespace DevAv.Controllers.API
{
    public class CrestsController : ODataController
    {
        private DevAVContext db = new DevAVContext();

        // GET: odata/Crests
        [Queryable]
        public IQueryable<Crest> GetCrests()
        {
            return db.Crests;
        }

        // GET: odata/Crests(5)
        [Queryable]
        public SingleResult<Crest> GetCrest([FromODataUri] int key)
        {
            return SingleResult.Create(db.Crests.Where(crest => crest.Crest_ID == key));
        }

        // PUT: odata/Crests(5)
        //public IHttpActionResult Put([FromODataUri] int key, Crest crest)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (key != crest.Crest_ID)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(crest).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!CrestExists(key))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return Updated(crest);
        //}

        // POST: odata/Crests
        //public IHttpActionResult Post(Crest crest)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.Crests.Add(crest);
        //    db.SaveChanges();

        //    return Created(crest);
        //}

        // PATCH: odata/Crests(5)
        //[AcceptVerbs("PATCH", "MERGE")]
        //public IHttpActionResult Patch([FromODataUri] int key, Delta<Crest> patch)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    Crest crest = db.Crests.Find(key);
        //    if (crest == null)
        //    {
        //        return NotFound();
        //    }

        //    patch.Patch(crest);

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!CrestExists(key))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return Updated(crest);
        //}

        // DELETE: odata/Crests(5)
        //public IHttpActionResult Delete([FromODataUri] int key)
        //{
        //    Crest crest = db.Crests.Find(key);
        //    if (crest == null)
        //    {
        //        return NotFound();
        //    }

        //    db.Crests.Remove(crest);
        //    db.SaveChanges();

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        // GET: odata/Crests(5)/Customer_Store_Locations
        [Queryable]
        public IQueryable<Customer_Store_Locations> GetCustomer_Store_Locations([FromODataUri] int key)
        {
            return db.Crests.Where(m => m.Crest_ID == key).SelectMany(m => m.Customer_Store_Locations);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CrestExists(int key)
        {
            return db.Crests.Count(e => e.Crest_ID == key) > 0;
        }
    }
}
