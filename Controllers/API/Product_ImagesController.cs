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
using System.Web;
using System.IO;
using DevAV.Models;


namespace DevAv.Controllers.API
{
    public class Product_ImagesController : ODataController
    {
        private DevAVContext db = new DevAVContext();

        // GET odata/Product_Images
        [Queryable]
        public IQueryable<Product_Images> GetProduct_Images()
        {
            return db.Product_Images;
        }

        // GET odata/Product_Images(5)
        [Queryable]
        public SingleResult<Product_Images> GetProduct_Images([FromODataUri] int key)
        {
            return SingleResult.Create(db.Product_Images.Where(product_images => product_images.Image_ID == key));
        }

        // PUT odata/Product_Images(5)
        //public IHttpActionResult Put([FromODataUri] int key, Product_Images product_images)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (key != product_images.Image_ID)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(product_images).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!Product_ImagesExists(key))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return Updated(product_images);
        //}

         

         //POST odata/Product_Images
        [HttpPost]
        public IHttpActionResult Post()
        {
            try
                {
                    if (!Request.Content.IsMimeMultipartContent())
                    {
                      return BadRequest("Not Mime Multipart Content");
                    }

                    var request = HttpContext.Current.Request;

                    var product_image = new Product_Images {};

                    if(request.Files.Count > 0)
                        {

                         for(int i = 0; i < request.Files.Count; i++)
                         {
                             HttpPostedFile file = request.Files[i];

                             using (MemoryStream ms = new MemoryStream())
                                {
                                    file.InputStream.CopyTo(ms);
                                    byte[] array = ms.GetBuffer();

                                    product_image = new Product_Images { Product_ID = Convert.ToInt32(HttpContext.Current.Request.Params["productId"]), Product_Image = ms.ToArray() };

                                    db.Product_Images.Add(product_image);
                                    db.SaveChanges();
                         
                                }

                            }
                        }

                    return Ok(product_image);
                }
            catch (Exception ex)
                {
                    return InternalServerError(ex);
                }
            
        }

         

        // PATCH odata/Product_Images(5)
        //[AcceptVerbs("PATCH", "MERGE")]
        //public IHttpActionResult Patch([FromODataUri] int key, Delta<Product_Images> patch)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    Product_Images product_images = db.Product_Images.Find(key);
        //    if (product_images == null)
        //    {
        //        return NotFound();
        //    }

        //    patch.Patch(product_images);

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!Product_ImagesExists(key))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return Updated(product_images);
        //}

        // DELETE odata/Product_Images(5)
        //public IHttpActionResult Delete([FromODataUri] int key)
        //{
        //    Product_Images product_images = db.Product_Images.Find(key);
        //    if (product_images == null)
        //    {
        //        return NotFound();
        //    }

        //    db.Product_Images.Remove(product_images);
        //    db.SaveChanges();

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        // GET odata/Product_Images(5)/Product
        [Queryable]
        public SingleResult<Product> GetProduct([FromODataUri] int key)
        {
            return SingleResult.Create(db.Product_Images.Where(m => m.Image_ID == key).Select(m => m.Product));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Product_ImagesExists(int key)
        {
            return db.Product_Images.Count(e => e.Image_ID == key) > 0;
        }
    }
}
