import React, { Component, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Spinner from "../app/shared/Spinner";

const materialConversion = lazy(() =>
  import("./components/materialConversion/views/listConversion")
);
// const Authenticator = lazy(() =>
//   import("./components/Authenticator/controllers/authenticator")
// );
const ListVoucher = lazy(() =>
  import("./components/Voucher/views/ListVoucher")
);
const CreateVoucher = lazy(() =>
  import("./components/Voucher/views/CreateVoucher")
);
const test = lazy(() => import("./components/Voucher/views/test"));

class AppRoutes extends Component {
  render() {
    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path="/listVoucher" component={ListVoucher} />
          <Route path="/materialConversion" component={materialConversion} />
          <Route path="/createVoucher" component={CreateVoucher} />
          <Route path="/test" component={test} />

          <Redirect to="/listVoucher" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;
