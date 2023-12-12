import "./App.css";
import Login from "./Components/Login";
import { Routes, Route } from "react-router-dom";
import Verify from "./Components/Verify";
import SuccessPage from "./Components/success";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="/verify" element={<Verify />} />
			<Route path="/success" element={<SuccessPage />} />
		</Routes>
	);
}

export default App;
