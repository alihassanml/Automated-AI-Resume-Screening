import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import Result from "./components/Result";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />   {/* Default Route */}
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
};

export default App;
