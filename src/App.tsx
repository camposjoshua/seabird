import "./App.css";
import { Route, Routes } from "react-router-dom";

import { Landing } from "./pages/landing";
import { Home as Staff } from "./pages/home";
import OrderTracker from "./pages/order-tracker";
import { OrderManagementScreen } from "./features/order-management/screens/order-management";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Staff */}
      <Route path="/staff" element={<Staff />} />

      {/* Customer */}
      <Route path="/track/:token" element={<OrderTracker />} />

      {/* Admin - coming soon */}
      <Route path="/admin" element={<OrderManagementScreen />} />

      {/* Customer - coming soon */}
      <Route
        path="/customer"
        element={<div>Customer Portal Coming Soon</div>}
      />
    </Routes>
  );
};

export default App;
