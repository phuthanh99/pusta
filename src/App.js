import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Messages from "./pages/messages/Messages";

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Search from "./pages/search/Search";
import Setting from "./pages/setting/Setting";

function App() {
	const { user } = useContext(AuthContext);
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={user ? <Home /> : <Register />} />
				<Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
				<Route
					path="/register"
					element={user ? <Navigate to="/" /> : <Register />}
				/>
				<Route
					path="/messages"
					element={!user ? <Navigate to="/" /> : <Messages />}
				/>
				<Route
					path="/profile/:username"
					element={user ? <Profile /> : <Login />}
				/>
				<Route
					path="/search"
					element={user ? <Search /> : <Login />}
				/>
				<Route
					path="/setting"
					element={user ? <Setting /> : <Login />}
				/>
			</Routes>
		</Router>
	);
}

export default App;
