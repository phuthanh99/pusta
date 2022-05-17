import "./message.css";
import { axiosInstance } from "../../config";
import { useEffect, useState } from "react";
import { format } from "timeago.js";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
export default function Message({ message, own }) {
	const { user } = useContext(AuthContext);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const [friend, setFriend] = useState(null);

	useEffect(() => {
		if (message.sender !== user._id) {
			const getUser = async () => {
				try {
					const res = await axiosInstance("/users?userId=" + message.sender);
					setFriend(res.data);
				} catch (err) {
					console.log(err);
				}
			};
			getUser();
		} 
	}, [message, user]);

	const OwnMessage = () => {
		return (
			<div className="message own">
				<div className="messageTop">
					<p className="messageText">{message.text}</p>
					<img
						className="messageImg"
						src={
							user?.profilePicture
								? user.profilePicture
								: PF + "person/noAvatar.gif"
						}
						alt=""
					/>
				</div>
				<div className="messageBottom">{format(message.createdAt)}</div>
			</div>
		);
	};

	const ClientMessage = () => {
		return (
			<div className="message">
				<div className="messageTop">
					<img
						className="messageImg"
						src={
							friend?.profilePicture
								? friend.profilePicture
								: PF + "person/noAvatar.gif"
						}
						alt=""
					/>
					<p className="messageText">{message.text}</p>
				</div>
				<div className="messageBottom">{format(message.createdAt)}</div>
			</div>
		);
	};
	return <>{own ? <OwnMessage /> : <ClientMessage />}</>;
}
