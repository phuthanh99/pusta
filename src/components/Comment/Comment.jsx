import "./comment.css";

import { axiosInstance } from "../../config";

import { useEffect, useState } from "react";

const Comment = ({ user, comment }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER || process.env.PORT;
	const [friend, setFriend] = useState(null);

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await axiosInstance("/users?userId=" + comment.sender);
				setFriend(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		getUser();
	}, [comment]);

	return (
		<>
			<div className="comment">
				<img
					className="commentUserImg"
					src={
						friend?.profilePicture
							? friend.profilePicture
							: PF + "person/noAvatar.gif"
					}
					alt=""
				/>
				<div className="commentBox">
					<div className="commentUsername">{friend?.username}</div>
					<p className="commentText">{comment?.text}</p>
				</div>
			</div>
		</>
	);
};

export default Comment;
