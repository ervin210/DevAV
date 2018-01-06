using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace DevAv.App_Start {
    public class BundleConfig {

        public static readonly string Styles = "~/css/styles";

        public static void RegisterBundles(BundleCollection bundles) {
            bundles.Add(new LessBundle(Styles).Include(
                     "~/css/styles.less"));
        }
    }

    public class LessBundle : Bundle {
        public LessBundle(string virtualPath)
            : base(virtualPath, new IBundleTransform[] { new LessTransform(), new CssMinify() }) {

        }

        public LessBundle(string virtualPath, string cdnPath)
            : base(virtualPath, cdnPath, new IBundleTransform[] { new LessTransform(), new CssMinify() }) {

        }
    }

}