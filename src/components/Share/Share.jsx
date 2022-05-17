import "./share.css";
import {
	PermMedia,
	Label,
	Room,
	EmojiEmotions,
	Cancel,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../config";
import axios from "axios";

const Share = () => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER || process.env.PORT;
	const { user } = useContext(AuthContext);
	const desc = useRef();
	const [file, setFile] = useState(null);

	const submitHandler = async (e) => {
		e.preventDefault();
		const newPost = {
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
				newPost.img = result.data.secure_url;
			} catch (err) {}
		}
		try {
			await axiosInstance.post("/posts", newPost);
			window.location.reload();
		} catch (err) {}
	};

	return (
		<div className="share">
			<div className="shareWrapper">
				<div className="shareTop">
					<Link
						to={`/profile/${user.username}`}
						style={{
							display: "flex",
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
							className="shareProfileImg"
						/>
					</Link>
					<input
						placeholder="What's in your mind?"
						className="shareInput"
						ref={desc}
					/>
				</div>
				<hr className="shareHr" />
				{file && (
					<div className="shareImgContainer">
						<img className="shareImg" src={URL.createObjectURL(file)} alt="" />
						<Cancel className="shareCancelImg" onClick={() => setFile(null)} />
					</div>
				)}
				<form className="shareBottom" onSubmit={submitHandler}>
					<div className="shareOptions">
						<label htmlFor="file" className="shareOption">
							<PermMedia htmlColor="tomato" className="shareIcon" />
							<span className="shareOptionText">Photo or Video</span>
							<input
								style={{ display: "none" }}
								type="file"
								name="file"
								id="file"
								accept=".png,.jpeg,.jpg"
								onChange={(e) => setFile(e.target.files[0])}
							/>
						</label>
						<div className="shareOption">
							<Label htmlColor="blue" className="shareIcon" />
							<span className="shareOptionText">Tag</span>
						</div>
						<div className="shareOption">
							<Room htmlColor="green" className="shareIcon" />
							<span className="shareOptionText">Location</span>
						</div>
						<div className="shareOption">
							<EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
							<span className="shareOptionText">Feelings</span>
						</div>
					</div>
					<button className="shareButton" type="submit">
						Share
					</button>
				</form>
			</div>
		</div>
	);
};

export default Share;
