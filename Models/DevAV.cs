namespace DevAV.Models {
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class DevAVContext : DbContext {
        public DevAVContext()
            : base("name=DevAV") {
        }

        public virtual DbSet<Crest> Crests { get; set; }
        public virtual DbSet<Customer_Communications> Customer_Communications { get; set; }
        public virtual DbSet<Customer_Employees> Customer_Employees { get; set; }
        public virtual DbSet<Customer_Store_Locations> Customer_Store_Locations { get; set; }
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<Department> Departments { get; set; }
        public virtual DbSet<Employee> Employees { get; set; }
        public virtual DbSet<Evaluation> Evaluations { get; set; }
        public virtual DbSet<Order_Items> Order_Items { get; set; }
        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<Probation> Probations { get; set; }
        public virtual DbSet<Product_Catalogs> Product_Catalogs { get; set; }
        public virtual DbSet<Product_Images> Product_Images { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<Quote_Items> Quote_Items { get; set; }
        public virtual DbSet<Quote> Quotes { get; set; }
        public virtual DbSet<State> States { get; set; }
        public virtual DbSet<Task> Tasks { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder) {
            modelBuilder.Entity<Crest>()
                .Property(e => e.SSMA_TimeStamp)
                .IsFixedLength();

            modelBuilder.Entity<Customer_Communications>()
                .Property(e => e.Comm_Date)
                .HasPrecision(0);

            modelBuilder.Entity<Customer_Employees>()
                .Property(e => e.SSMA_TimeStamp)
                .IsFixedLength();

            modelBuilder.Entity<Customer_Employees>()
                .HasMany(e => e.Customer_Communications)
                .WithOptional(e => e.Customer_Employees)
                .HasForeignKey(e => e.Comm_Customer_Employee_ID);

            modelBuilder.Entity<Customer_Employees>()
                .HasMany(e => e.Tasks)
                .WithOptional(e => e.Customer_Employees)
                .HasForeignKey(e => e.Task_Customer_Employee_ID);

            modelBuilder.Entity<Customer_Store_Locations>()
                .Property(e => e.Customer_Store_Annual_Sales)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Customer_Store_Locations>()
                .HasMany(e => e.Customer_Employees)
                .WithOptional(e => e.Store)
                .HasForeignKey(e => e.Customer_Store_ID);

            modelBuilder.Entity<Customer_Store_Locations>()
                .HasMany(e => e.Orders)
                .WithOptional(e => e.Customer_Store_Locations)
                .HasForeignKey(e => e.Order_Customer_Location_ID);

            modelBuilder.Entity<Customer>()
                .Property(e => e.Customer_Annual_Revenue)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Customer>()
                .Property(e => e.SSMA_TimeStamp)
                .IsFixedLength();

            modelBuilder.Entity<Customer>()
                .HasMany(e => e.Orders)
                .WithOptional(e => e.Customer)
                .HasForeignKey(e => e.Order_Customer_ID);

            modelBuilder.Entity<Customer>()
                .HasMany(e => e.Quotes)
                .WithOptional(e => e.Customer)
                .HasForeignKey(e => e.Quote_Customer_ID);

            modelBuilder.Entity<Department>()
                .HasMany(e => e.Employees)
                .WithOptional(e => e.Department)
                .HasForeignKey(e => e.Employee_Department_ID);

            modelBuilder.Entity<Employee>()
                .Property(e => e.Employee_Birth_Date)
                .HasPrecision(0);

            modelBuilder.Entity<Employee>()
                .Property(e => e.Employee_Hire_Date)
                .HasPrecision(0);

            modelBuilder.Entity<Employee>()
                .Property(e => e.SSMA_TimeStamp)
                .IsFixedLength();

            modelBuilder.Entity<Employee>()
                .HasMany(e => e.Customer_Communications)
                .WithOptional(e => e.Employee)
                .HasForeignKey(e => e.Comm_Employee_ID);

            modelBuilder.Entity<Employee>()
                .HasMany(e => e.CreatedEvaluations)
                .WithOptional(e => e.Reviewer)
                .HasForeignKey(e => e.Created_By_ID);

            modelBuilder.Entity<Employee>()
                .HasMany(e => e.PersonEvaluations)
                .WithOptional(e => e.Employee)
                .HasForeignKey(e => e.Employee_ID);

            modelBuilder.Entity<Employee>()
                .HasMany(e => e.Orders)
                .WithOptional(e => e.Employee)
                .HasForeignKey(e => e.Order_Employee_ID);

            modelBuilder.Entity<Employee>()
                .HasMany(e => e.EngineerProducts)
                .WithOptional(e => e.Engineer)
                .HasForeignKey(e => e.Product_Engineer_ID);

            modelBuilder.Entity<Employee>()
                .HasMany(e => e.SupportManagerProducts)
                .WithOptional(e => e.SupportManager)
                .HasForeignKey(e => e.Product_Support_ID);

            modelBuilder.Entity<Employee>()
                .HasMany(e => e.Quotes)
                .WithOptional(e => e.Employee)
                .HasForeignKey(e => e.Quote_Employee_ID);

            modelBuilder.Entity<Employee>()
                .HasMany(e => e.ResponsibleTasks)
                .WithOptional(e => e.ResponsibleEmployee)
                .HasForeignKey(e => e.Task_Assigned_Employee_ID);

            modelBuilder.Entity<Employee>()
                .HasMany(e => e.OwnerTasks)
                .WithOptional(e => e.Owner)
                .HasForeignKey(e => e.Task_Owner_ID);

            modelBuilder.Entity<Evaluation>()
                .Property(e => e.Created_On)
                .HasPrecision(0);

            modelBuilder.Entity<Evaluation>()
                .Property(e => e.SSMA_TimeStamp)
                .IsFixedLength();

            modelBuilder.Entity<Order_Items>()
                .Property(e => e.Order_Item_Product_Price)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Order_Items>()
                .Property(e => e.Order_Item_Discount)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Order_Items>()
                .Property(e => e.Order_Item_Total)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Order>()
                .Property(e => e.Order_Date)
                .HasPrecision(0);

            modelBuilder.Entity<Order>()
                .Property(e => e.Order_Sale_Amount)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Order>()
                .Property(e => e.Order_Shipping_Amount)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Order>()
                .Property(e => e.Order_Total_Amount)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Order>()
                .Property(e => e.Order_Ship_Date)
                .HasPrecision(0);

            modelBuilder.Entity<Product_Catalogs>()
                .Property(e => e.SSMA_TimeStamp)
                .IsFixedLength();

            modelBuilder.Entity<Product_Images>()
                .Property(e => e.SSMA_TimeStamp)
                .IsFixedLength();

            modelBuilder.Entity<Product>()
                .Property(e => e.Product_Production_Start)
                .HasPrecision(0);

            modelBuilder.Entity<Product>()
                .Property(e => e.Product_Cost)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Product>()
                .Property(e => e.Product_Sale_Price)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Product>()
                .Property(e => e.Product_Retail_Price)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Product>()
                .Property(e => e.SSMA_TimeStamp)
                .IsFixedLength();

            modelBuilder.Entity<Product>()
                .HasMany(e => e.Order_Items)
                .WithOptional(e => e.Product)
                .HasForeignKey(e => e.Order_Item_Product_ID);

            modelBuilder.Entity<Product>()
                .HasMany(e => e.Quote_Items)
                .WithOptional(e => e.Product)
                .HasForeignKey(e => e.Quote_Item_Product_ID);

            modelBuilder.Entity<Quote_Items>()
                .Property(e => e.Quote_Item_Product_Price)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Quote_Items>()
                .Property(e => e.Quote_Item_Discount)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Quote_Items>()
                .Property(e => e.Quote_Item_Total)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Quote>()
                .Property(e => e.Quote_Date)
                .HasPrecision(0);

            modelBuilder.Entity<Quote>()
                .Property(e => e.Quote_SubTotal)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Quote>()
                .Property(e => e.Quote_Shipping_Amount)
                .HasPrecision(19, 4);

            modelBuilder.Entity<Quote>()
                .Property(e => e.Order_Total)
                .HasPrecision(19, 4);

            modelBuilder.Entity<State>()
                .Property(e => e.SSMA_TimeStamp)
                .IsFixedLength();

            modelBuilder.Entity<State>()
                .HasMany(e => e.Employees)
                .WithOptional(e => e.State)
                .HasForeignKey(e => e.Employee_State_ID);

            modelBuilder.Entity<State>()
                .HasMany(e => e.Customers)
                .WithOptional(e => e.State)
                .HasForeignKey(e => e.Customer_State);

            modelBuilder.Entity<Task>()
                .Property(e => e.Task_Start_Date)
                .HasPrecision(0);

            modelBuilder.Entity<Task>()
                .Property(e => e.Task_Due_Date)
                .HasPrecision(0);

            modelBuilder.Entity<Task>()
                .Property(e => e.Task_Reminder_Date)
                .HasPrecision(0);

            modelBuilder.Entity<Task>()
                .Property(e => e.Task_Reminder_Time)
                .HasPrecision(0);

            modelBuilder.Entity<Task>()
                .Property(e => e.SSMA_TimeStamp)
                .IsFixedLength();
        }

        public IEnumerable<SalesOrOpportunitiesByCategory> GetSalesData() {
            return Order_Items.GroupBy(i => i.Product.Product_Category).Select(g => new SalesOrOpportunitiesByCategory() { Name = g.Key, Value = g.Sum(i => i.Order_Item_Total) }).OrderByDescending(i => i.Value).ToList();
        }

        public IEnumerable<SalesOrOpportunitiesByCategory> GetOpportunitiesData() {
            return new List<SalesOrOpportunitiesByCategory>() {
                new SalesOrOpportunitiesByCategory() { Name = "High",        Value = Quotes.Where(q => q.Quote_Opportunity > 0.6).Sum(q => q.Quote_Total) },
                new SalesOrOpportunitiesByCategory() { Name = "Medium",      Value = Quotes.Where(q => q.Quote_Opportunity > 0.3 && q.Quote_Opportunity < 0.6).Sum(q => q.Quote_Total) },
                new SalesOrOpportunitiesByCategory() { Name = "Low",         Value = Quotes.Where(q => q.Quote_Opportunity > 0.12 && q.Quote_Opportunity < 0.3).Sum(q => q.Quote_Total) },
                new SalesOrOpportunitiesByCategory() { Name = "Unlikely",    Value = Quotes.Where(q => q.Quote_Opportunity < 0.12).Sum(q => q.Quote_Total) }
            };
        }
    }
}
