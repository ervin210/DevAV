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
    public class DepartmentsController : ODataController
    {
        private DevAVContext db = new DevAVContext();

        // GET odata/Departments
        [Queryable]
        public IQueryable<Department> GetDepartments()
        {
            return db.Departments;
        }

        // GET odata/Departments(5)
        [Queryable]
        public SingleResult<Department> GetDepartment([FromODataUri] int key)
        {
            return SingleResult.Create(db.Departments.Where(department => department.Department_ID == key));
        }

        // PUT odata/Departments(5)
        //public IHttpActionResult Put([FromODataUri] int key, Department department)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (key != department.Department_ID)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(department).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!DepartmentExists(key))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return Updated(department);
        //}

        // POST odata/Departments
        //public IHttpActionResult Post(Department department)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.Departments.Add(department);
        //    db.SaveChanges();

        //    return Created(department);
        //}

        // PATCH odata/Departments(5)
        //[AcceptVerbs("PATCH", "MERGE")]
        //public IHttpActionResult Patch([FromODataUri] int key, Delta<Department> patch)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    Department department = db.Departments.Find(key);
        //    if (department == null)
        //    {
        //        return NotFound();
        //    }

        //    patch.Patch(department);

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!DepartmentExists(key))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return Updated(department);
        //}

        // DELETE odata/Departments(5)
        //public IHttpActionResult Delete([FromODataUri] int key)
        //{
        //    Department department = db.Departments.Find(key);
        //    if (department == null)
        //    {
        //        return NotFound();
        //    }

        //    db.Departments.Remove(department);
        //    db.SaveChanges();

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        // GET odata/Departments(5)/Employees
        [Queryable]
        public IQueryable<Employee> GetEmployees([FromODataUri] int key)
        {
            return db.Departments.Where(m => m.Department_ID == key).SelectMany(m => m.Employees);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DepartmentExists(int key)
        {
            return db.Departments.Count(e => e.Department_ID == key) > 0;
        }
    }
}
