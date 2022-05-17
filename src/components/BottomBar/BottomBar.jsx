import "./bottomBar.css";

import { NavLink, useNavigate } from "react-router-dom";
import { Home, Chat, Person, Settings, Search } from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function BottomBar() {
	const { user } = useContext(AuthContext);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER || process.env.PORT;
	const navigate = useNavigate();
	return (
		<>
			<div className="bottomBar">
				<ul className="bottomBarList">
					<NavLink
						exact="true"
						to="/"
						className={({ isActive }) =>
							"bottomBarNavLink" + (isActive ? " activated" : "")
						}
					>
						<li className="bottomBarListItem">
							<Home className="bottomBarIcon" />
						</li>
					</NavLink>
					<NavLink
						exact="true"
						to="/messages"
						className={({ isActive }) =>
							"bottomBarNavLink" + (isActive ? " activated" : "")
						}
					>
						<li className="bottomBarListItem">
							<Chat className="bottomBarIcon" />
						</li>
					</NavLink>
					<NavLink
						exact="true"
						to={`/profile/${user.username}`}
						className={({ isActive }) =>
							"bottomBarNavLink" + (isActive ? " activated" : "")
						}
					>
						<li className="bottomBarListItem">
							<Person className="bottomBarIcon" />
						</li>
					</NavLink>
					<NavLink
						exact="true"
						to={`/search`}
						className={({ isActive }) =>
							"bottomBarNavLink bottomBarHide" + (isActive ? " activated" : "")
						}
					>
						<li className="bottomBarListItem">
							<Search className="bottomBarIcon" />
						</li>
					</NavLink>
					<NavLink
						exact="true"
						to={`/setting`}
						className={({ isActive }) =>
							"bottomBarNavLink bottomBarHide" + (isActive ? " activated" : "")
						}
					>
						<li className="bottomBarListItem">
							<Settings className="bottomBarIcon"></Settings>
						</li>
					</NavLink>
				</ul>
			</div>
		</>
	);
}
