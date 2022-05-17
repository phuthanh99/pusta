import "./sidebar.css";
import { NavLink } from "react-router-dom";
import { Home, Chat, Person, Settings, Search } from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
	const { user } = useContext(AuthContext);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER || process.env.PORT;

	return (
		<div className="sidebar">
			<div className="sidebarWrapper">
				<div className="sidebarLogo">
					<NavLink exact="true" to="/" className="sidebarNavLink">
						<span className="logo">Pusta</span>
					</NavLink>
				</div>
				<ul className="sidebarList">
					<NavLink
						exact="true"
						to="/"
						className={({ isActive }) =>
							"sidebarNavLink" + (isActive ? " activated" : "")
						}
					>
						<li className="sidebarListItem">
							<Home className="sidebarIcon" />
							<span className="sidebarListItemText">Home</span>
						</li>
					</NavLink>
					<NavLink
						exact="true"
						to="/messages"
						className={({ isActive }) =>
							"sidebarNavLink" + (isActive ? " activated" : "")
						}
					>
						<li className="sidebarListItem">
							<Chat className="sidebarIcon" />
							<span className="sidebarListItemText">Messages</span>
						</li>
					</NavLink>
					<NavLink
						exact="true"
						to={`/profile/${user.username}`}
						className={({ isActive }) =>
							"sidebarNavLink" + (isActive ? " activated" : "")
						}
					>
						<li className="sidebarListItem">
							<Person className="sidebarIcon" />
							<span className="sidebarListItemText">Profile</span>
						</li>
					</NavLink>
					<NavLink
						exact="true"
						to={`/search`}
						className={({ isActive }) =>
							"sidebarNavLink sidebarHide" + (isActive ? " activated" : "")
						}
					>
						<li className="sidebarListItem">
							<Search className="sidebarIcon" />
						</li>
					</NavLink>
				</ul>
				<div className="sidebarFooter">
					<NavLink
						to={`/profile/${user.username}`}
						style={{
							display: "flex",
							alignItems: "center",
							color: "inherit",
							textDecoration: "inherit",
						}}
					>
						<img
							src={
								user.profilePicture
									? user.profilePicture
									: PF + "person/noAvatar.gif"
							}
							alt="profile"
							className="sidebarProfileImg"
						/>
						<span className="sidebarUsername">{user.username}</span>
					</NavLink>
					<NavLink
						exact="true"
						to="/setting"
						className={({ isActive }) =>
							"sidebarNavLink" + (isActive ? " activated" : "")
						}
					>
						<Settings className="sidebarIconLogout"></Settings>
					</NavLink>
				</div>
			</div>
		</div>
	);
}
