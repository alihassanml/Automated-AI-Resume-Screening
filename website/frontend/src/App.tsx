import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import Result from "./components/Result";
import "bootstrap/dist/css/bootstrap.min.css";
import DataBase from "./components/DataBase";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />   {/* Default Route */}
        <Route path="/result" element={<Result />} />
        <Route path="/home" element={<DataBase />} />
      </Routes>
    </Router>
  );
};

export default App;
