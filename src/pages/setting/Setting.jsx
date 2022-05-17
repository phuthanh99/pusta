import "./setting.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";
import Rightbar from "../../components/Rightbar/Rightbar";
import BottomBar from "../../components/BottomBar/BottomBar";
import UpdateInfo from "../../components/UpdateInfo/UpdateInfo";
import { AuthContext } from "../../context/AuthContext";

const Setting = () => {
	const [info, setInfo] = useState(false);
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	return (
		<>
			<div className="setting">
				<Sidebar />
				<div className="settingWrapper">
					<h2 className="settingTitle">SETTINGS</h2>
					<hr className="settingHr" />
					<div className="settingCenter">
						<button
							className="settingBtn"
							onClick={() => {
								setInfo(true);
							}}
						>
							Change your password
						</button>

						<button
							className="settingBtn logout"
							onClick={() => {
								navigate("/login");
								window.localStorage.clear();
								window.location.reload();
							}}
						>
							Log out
						</button>
					</div>
				</div>
				{info ? (
					<UpdateInfo setInfo={setInfo} changePasswords={true} user={user} />
				) : (
					""
				)}
				<Rightbar />
				<BottomBar />
			</div>
		</>
	);
};

export default Setting;
