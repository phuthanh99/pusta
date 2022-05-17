import "./rightbar.css";
import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Online from "../Online/Online";
import SearchBar from "../Searchbar/Searchbar";

export default function Rightbar({ user, setInfo }) {
	const [friends, setFriends] = useState([]);
	const { user: currentUser } = useContext(AuthContext);

	useEffect(() => {
		const getFriends = async () => {
			try {
				const friendList = await axiosInstance.get(
					"/users/friends/" + currentUser._id
				);
				if (friendList.data.length > 0) {
					setFriends(friendList.data);
				} else {
					setFriends([{ notFound: "Not Found" }]);
				}
			} catch (err) {
				console.log(err);
			}
		};
		getFriends();
	}, [currentUser]);

	return (
		<div className="rightbar">
			<div className="rightbarWrapper">
				<SearchBar user={user} />
				<hr className="rightbarHr" />
				<div className="rightbarOnlineFriend">
					<h4 className="rightbarTitle">Friends</h4>
					<ul className="rightbarFriendList">
						{!friends[0]?.notFound ? (
							friends.map((u) => (
								<Link
									to={`/profile/${u.username}`}
									style={{
										display: "flex",
										color: "inherit",
										textDecoration: "inherit",
									}}
									key={u._id}
								>
									<Online user={u} />
								</Link>
							))
						) : (
							<span className="rightbarNoFriend">You don't have friends</span>
						)}
					</ul>
				</div>
				
			</div>
		</div>
	);
}
