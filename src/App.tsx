import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/home";
import OrderTracker from "./pages/order-tracker";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/track/:token" element={<OrderTracker />} />
    </Routes>
  );
};

export default App;
