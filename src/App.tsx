import "./App.css";
import { Button } from "@heroui/react";

function App() {
  return (
    <div>
      <h1>Laundry App</h1>
      <p>Welcome to our laundry service.</p>

      <Button onPress={() => console.log("Button pressed")}>Click me</Button>
    </div>
  );
}

export default App;
