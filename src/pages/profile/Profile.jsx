import "./profile.css";

import Sidebar from "../../components/Sidebar/Sidebar";
import Feed from "../../components/Feed/Feed";
import Rightbar from "../../components/Rightbar/Rightbar";
import UpdateInfo from "../../components/UpdateInfo/UpdateInfo";
import BottomBar from "../../components/BottomBar/BottomBar";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@mui/icons-material";

const Profile = () => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER || process.env.PORT;
	const [user, setUser] = useState({});
	const username = useParams().username;
	const { user: currentUser, dispatch } = useContext(AuthContext);
	const [followed, setFollowed] = useState(false);
	const [update, setUpdate] = useState(false);
	const [info, setInfo] = useState(false);

	useEffect(() => {
		setFollowed(currentUser.followings.includes(user?._id));
	}, [currentUser, user]);

	useEffect(() => {
		const fetchUser = async () => {
			const res = await axiosInstance.get(`/users?username=${username}`);
			setUser(res.data);
		};
		fetchUser();
	}, [username]);

	useEffect(() => {
		if (update) {
			const updateUser = async (dispatch) => {
				const res = await axiosInstance.get(`/users?userId=${currentUser._id}`);
				dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
				setUser(res.data);
				if (res.data) {
					window.location.reload();
				}
			};
			updateUser(dispatch);
		}
	}, [currentUser, dispatch, update]);

	const handleClick = async () => {
		try {
			if (followed) {
				await axiosInstance.put(`/users/${user._id}/unfollow`, {
					userId: currentUser._id,
				});
				dispatch({ type: "UNFOLLOW", payload: user._id });
			} else {
				await axiosInstance.put(`/users/${user._id}/follow`, {
					userId: currentUser._id,
				});
				dispatch({ type: "FOLLOW", payload: user._id });
			}
			setFollowed(!followed);
		} catch (err) {}
	};

	

	return (
		<div className="profile">
			<Sidebar user={user} />
			<div className="profileCenter">
				<div className="profileRightCenterTop">
					<div className="profileCover">
						<img
							src={user.coverPicture || PF + "person/noCover.jpg"}
							alt=""
							className="profileCoverImg"
						/>
						<img
							src={user.profilePicture || PF + "person/noAvatar.gif"}
							alt=""
							className="profileUserImg"
						/>
					</div>
					<div className="profileInfo">
						<h2 className="profileInfoName">{user.username}</h2>
						<span className="profileInfoDesc">{currentUser.desc}</span>
						<hr className="profileHr" />
					</div>

					<div className="profileInfoWrapper">
						<div className="profileInfos">
							<h4 className="profileTitle">Information</h4>
							<div className="profileInfoItem">
								<span className="profileInfoKey">City:</span>
								<span className="profileInfoValue">{user?.city}</span>
							</div>
							<div className="profileInfoItem">
								<span className="profileInfoKey">From:</span>
								<span className="profileInfoValue">{user?.from}</span>
							</div>
							<div className="profileInfoItem">
								<span className="profileInfoKey">Relationship:</span>
								<span className="profileInfoValue">{user?.relationship}</span>
							</div>
						</div>

						{currentUser?.username === user?.username ? (
							<button
								className="profileButton"
								onClick={() => {
									setInfo(true);
								}}
							>
								Update information
							</button>
						) : (
							""
						)}
						{user.username !== currentUser.username && (
							<div className="profileFollow">
								<button className="profileFollowButton" onClick={handleClick}>
									{followed ? "Unfollow" : "Follow"}
									{followed ? <Remove /> : <Add />}
								</button>
							</div>
						)}
					</div>
					<hr className="profileHr" />
				</div>
				<Feed username={user.username} />
			</div>
			<Rightbar user={user} setInfo={setInfo} />
			{info && currentUser.username === username ? (
				<UpdateInfo
					setInfo={setInfo}
					user={currentUser}
					setUpdate={setUpdate}
				/>
			) : (
				""
			)}
			<BottomBar />
		</div>
	);
};

export default Profile;
