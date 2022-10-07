import React, { Component, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Spinner from "../app/shared/Spinner";

const materialConversion = lazy(() =>
  import("./components/materialConversion/views/listConversion")
);
// const Authenticator = lazy(() =>
//   import("./components/Authenticator/controllers/authenticator")
// );
const ListVoucherSerial = lazy(() =>
  import("./components/voucherSerial/views/ListVoucherSerial.jsx")
);
const CreateVoucherSerial = lazy(() =>
  import("./components/voucherSerial/views/CreateVoucherSerial")
);
const listVouchers = lazy(() =>
  import("./components/voucher/views/listVoucher")
);
const listVouchersUsed = lazy(() =>
  import("./components/voucher/views/listVoucherUsed")
);
const test = lazy(() => import("./components/voucherSerial/views/test"));

class AppRoutes extends Component {
  render() {
    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route
            exact
            path="/listVoucherSerial"
            component={ListVoucherSerial}
          />
          <Route path="/materialConversion" component={materialConversion} />
          <Route path="/createVoucherSerial" component={CreateVoucherSerial} />
          <Route path="/test" component={test} />
          <Route path="/listVouchers" component={listVouchers} />
          <Route path="/listVouchersUsed" component={listVouchersUsed} />

          <Redirect to="/listVoucherSerial" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;
