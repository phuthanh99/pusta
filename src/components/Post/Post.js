import "./post.css";
import { MoreVert, Send, Close } from "@mui/icons-material";
import { useContext, useEffect, useState, useRef } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { useParams } from "react-router";

import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import Comment from "../Comment/Comment";
import UpdatePost from "../UpdatePost/UpdatePost";

export default function Post({ post }) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER || process.env.PORT;

	const [like, setLike] = useState(post.likes.length);
	const [isLiked, setIsLiked] = useState(false);
	const [openCommentBox, setOpenCommentBox] = useState(false);
	const [user, setUser] = useState({});
	const [commentPost, setCommentPost] = useState(null);
	const newComment = useRef();

	const [updatePost, setUpdatePost] = useState(false);
	const [deletePostBox, setDeletePostBox] = useState(false);
	const [editBox, setEditBox] = useState(false);
	const [hide, setHide] = useState(false);

	const username = useParams().username;

	const { user: currentUser } = useContext(AuthContext);

	const likeHandler = () => {
		try {
			axiosInstance.put("/posts/" + post._id + "/like", {
				userId: currentUser._id,
			});
		} catch (err) {}
		setLike(isLiked ? like - 1 : like + 1);
		setIsLiked(!isLiked);
	};
	console.log();
	useEffect(() => {
		setIsLiked(post.likes.includes(currentUser._id));
	}, [currentUser._id, post.likes]);

	useEffect(() => {
		setHide(post.hide.includes(currentUser._id));
	}, [currentUser._id, post.hide]);

	useEffect(() => {
		const fetchUser = async () => {
			const res = await axiosInstance.get(`/users?userId=${post.userId}`);
			setUser(res.data);
		};
		fetchUser();
	}, [post.userId]);

	const likeText = (like) => {
		if (like !== 0) {
			return `${like} people like it`;
		} else {
			return "";
		}
	};

	useEffect(() => {
		const getComment = async () => {
			try {
				const res = await axiosInstance.get("/comment/" + post._id);
				setCommentPost(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		getComment();
	}, [post._id]);

	const sendComment = async (e) => {
		e.preventDefault();
		if (newComment === "") {
			return;
		}

		const comment = {
			sender: currentUser._id,
			text: newComment.current.value,
			postId: post._id,
		};

		try {
			const res = await axiosInstance.post("/comment", comment);
			setCommentPost([...commentPost, res.data]);
			console.log(newComment);
		} catch (err) {
			console.log(err);
		}
	};

	const editPost = () => {
		setUpdatePost(true);
	};

	const deletePost = () => {
		setDeletePostBox(true);
	};

	const hideShowHandler = async () => {
		try {
			await axiosInstance.put("/posts/" + post._id + "/hide", {
				userId: currentUser._id,
			});
			window.location.reload();
		} catch (err) {}
	};

	const ShowPost = () => {
		return (
			<div className="post">
				<div className="postWrapper">
					<div className="postTop">
						<div className="postTopLeft">
							<Link
								to={`/profile/${user.username}`}
								style={{
									display: "flex",
									color: "inherit",
									textDecoration: "inherit",
								}}
							>
								<img
									className="postProfileImg"
									src={
										user.profilePicture
											? user.profilePicture
											: PF + "person/noAvatar.gif"
									}
									alt="profilePicture"
								/>
								<span className="postUsername">{user.username}</span>
							</Link>
							<span className="postDate">{format(post.createdAt)}</span>
						</div>
						<div className="postTopRight">
							<div className="postTopRightIcon">
								{editBox === false ? (
									<MoreVert onClick={() => setEditBox(true)} />
								) : (
									<Close onClick={() => setEditBox(false)} />
								)}
							</div>
							{editBox ? (
								<div className="postTopRightEdit">
									{user._id === currentUser._id ? (
										<>
											<div
												className="postTopRightEditText"
												onClick={() => editPost()}
											>
												Edit
											</div>
											<div
												className="postTopRightEditText"
												onClick={() => {
													deletePost();
												}}
											>
												Delete
											</div>
										</>
									) : hide ? (
										<div
											className="postTopRightEditText"
											onClick={() => {
												hideShowHandler();
											}}
										>
											Show
										</div>
									) : (
										<div
											className="postTopRightEditText"
											onClick={() => {
												hideShowHandler();
											}}
										>
											Hide
										</div>
									)}
								</div>
							) : (
								""
							)}
						</div>
					</div>
					<div className="postCenter">
						<p className="postText">{post?.desc}</p>
						<img src={post?.img} alt="" className="postImg" />
					</div>
					<hr className="postHr" />
					<div className="postBottom">
						<div className="postBottomLeft">
							<img
								src={`${PF}heart.png`}
								alt="heart"
								onClick={likeHandler}
								className="likeIcon"
							/>
							<span className="postLikeCounter">{likeText(like)}</span>
						</div>

						<div className="postBottomRight">
							<span
								className="postBottomComment"
								onClick={() => {
									setOpenCommentBox(!openCommentBox);
								}}
							>
								Comments
							</span>
						</div>
					</div>
					<hr className="postHr" />
					{openCommentBox ? (
						<div className="postComments">
							{commentPost.map((c) => (
								<Comment key={c._id} user={user} comment={c} />
							))}
							<form className="postCommentsBottom" onSubmit={sendComment}>
								<img
									className="postProfileImg"
									src={
										currentUser.profilePicture
											? currentUser.profilePicture
											: PF + "person/noAvatar.gif"
									}
									alt="profilePicture"
								/>
								<input
									type="text"
									className="postCommentsBottomInput"
									placeholder="Write comments..."
									ref={newComment}
								/>
								<Send className="postCommentSend" onClick={sendComment} />
							</form>
						</div>
					) : (
						""
					)}
				</div>
				{updatePost || deletePostBox ? (
					<UpdatePost
						setUpdatePost={setUpdatePost}
						user={currentUser}
						post={post}
						setDeletePostBox={setDeletePostBox}
						deletePostBox={deletePostBox}
					/>
				) : (
					""
				)}
			</div>
		);
	};
	return <>{username ? <ShowPost /> : hide ? "" : <ShowPost />}</>;
}
