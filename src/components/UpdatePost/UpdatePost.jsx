import "./updatePost.css";
import { useRef, useState } from "react";
import { axiosInstance } from "../../config";
import axios from "axios";

export default function UpdatePost({
	setUpdatePost,
	user,
	post,
	deletePostBox,
	setDeletePostBox,
}) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER || process.env.PORT;
	const [file, setFile] = useState(null);
	const desc = useRef(null);

	const editPosts = async (e) => {
		e.preventDefault();
		const editPost = {
			userId: user._id,
			desc: desc.current.value,
		};
		if (file) {
			const data = new FormData();
			data.append("file", file);
			data.append("upload_preset", "social-pusta");
			try {
				const result = await axios.post(
					"https://api.cloudinary.com/v1_1/pusta/image/upload",
					data
				);
				editPost.img = result.data.secure_url;
			} catch (err) {}
		}
		try {
			await axiosInstance.put(`/posts/${post._id}`, editPost);
			window.location.reload();
		} catch (err) {}
	};

	const deletePost = async () => {
		try {
			await axiosInstance.delete(`/posts/${post._id}`, {
				headers: {
					Authorization: "authorizationToken",
				},
				data: {
					userId: user._id,
				},
			});
			window.location.reload();
		} catch (err) {}
	};
	return (
		<>
			<div className="updatePost">
				{deletePostBox ? (
					<div className="updatePostWrapper">
						<div className="updatePostBtn">
							<button
								onClick={() => {
									setDeletePostBox(false);
								}}
							>
								X
							</button>
						</div>
						<div className="updatePostTop">
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
						</div>
						<div className="updatePostCenter">
							<p className="updatePostInput">{post?.desc}</p>
							<div className="updatePostFiles">
								<img src={post?.img} alt="" className="updatePostImg" />

								<div className="updatePostFile">
									<h3>Do you want to delete posts?</h3>
								</div>
							</div>
						</div>
						<div className="updatePostBottom">
							<button
								onClick={() => {
									setDeletePostBox(false);
								}}
							>
								Cancel
							</button>
							<button
								onClick={() => {
									deletePost();
								}}
								id="updatePostCancel"
							>
								OK
							</button>
						</div>
					</div>
				) : (
					<div className="updatePostWrapper">
						<div className="updatePostBtn">
							<button
								onClick={() => {
									setUpdatePost(false);
								}}
							>
								X
							</button>
						</div>
						<div className="updatePostTop">
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
						</div>
						<div className="updatePostCenter">
							<textarea
								className="updatePostInput"
								placeholder="Edit descriptions..."
								defaultValue={post?.desc}
								ref={desc}
							></textarea>
							<div className="updatePostFiles">
								<img src={post?.img} alt="" className="updatePostImg" />
								{file ? (
									<div className="updatePostFile">
										<img
											className="updatedPostImg"
											src={URL.createObjectURL(file)}
											alt=""
										/>

										<button
											onClick={() => {
												setFile(null);
											}}
										>
											X
										</button>
									</div>
								) : (
									<div className="updatePostFile">
										<input
											className="updatePostInputFile"
											type="file"
											name="file"
											id="file"
											accept=".png,.jpeg,.jpg"
											onChange={(e) => setFile(e.target.files[0])}
										/>
										<label htmlFor="">Choose a photo to upload</label>
									</div>
								)}
							</div>
						</div>
						<form className="updatePostBottom" onSubmit={editPosts}>
							<button
								onClick={() => {
									setUpdatePost(false);
								}}
								id="updatePostCancel"
							>
								Cancel
							</button>
							<button type="submit">Save</button>
						</form>
					</div>
				)}
			</div>
		</>
	);
}
