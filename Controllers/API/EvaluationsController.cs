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
    public class EvaluationsController : ODataController
    {
        private DevAVContext db = new DevAVContext();

        // GET: odata/Evaluations
        [Queryable]
        public IQueryable<Evaluation> GetEvaluations()
        {
            return db.Evaluations;
        }

        // GET: odata/Evaluations(5)
        [Queryable]
        public SingleResult<Evaluation> GetEvaluation([FromODataUri] int key)
        {
            return SingleResult.Create(db.Evaluations.Where(evaluation => evaluation.Note_ID == key));
        }

        // PUT: odata/Evaluations(5)
        //public IHttpActionResult Put([FromODataUri] int key, Evaluation evaluation)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (key != evaluation.Note_ID)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(evaluation).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!EvaluationExists(key))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return Updated(evaluation);
        //}

        // POST: odata/Evaluations
        //public IHttpActionResult Post(Evaluation evaluation)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.Evaluations.Add(evaluation);
        //    db.SaveChanges();

        //    return Created(evaluation);
        //}

         

        // PATCH: odata/Evaluations(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Evaluation> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Evaluation evaluation = db.Evaluations.Find(key);
            if (evaluation == null)
            {
                return NotFound();
            }

            patch.Patch(evaluation);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EvaluationExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(evaluation);
        }

        // DELETE: odata/Evaluations(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Evaluation evaluation = db.Evaluations.Find(key);
            if (evaluation == null)
            {
                return NotFound();
            }

            db.Evaluations.Remove(evaluation);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

         

        // GET: odata/Evaluations(5)/Employee
        [Queryable]
        public SingleResult<Employee> GetEmployee([FromODataUri] int key)
        {
            return SingleResult.Create(db.Evaluations.Where(m => m.Note_ID == key).Select(m => m.Employee));
        }

        // GET: odata/Evaluations(5)/Reviewer
        [Queryable]
        public SingleResult<Employee> GetReviewer([FromODataUri] int key)
        {
            return SingleResult.Create(db.Evaluations.Where(m => m.Note_ID == key).Select(m => m.Reviewer));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EvaluationExists(int key)
        {
            return db.Evaluations.Count(e => e.Note_ID == key) > 0;
        }
    }
}
