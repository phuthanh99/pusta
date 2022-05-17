import "./updateInfo.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config";

function UpdateInfo({ setInfo, user, setUpdate, changePasswords }) {
	const [username, setUsername] = useState(user.username);
	const [desc, setDesc] = useState(user.desc);
	const [city, setCity] = useState(user.city);
	const [fromCity, setFromCity] = useState(user.from);
	const [relationshipValue, setRelationshipValue] = useState(user.relationship);
	const [coverPicture, setCoverPicture] = useState(null);
	const [profilePicturele, setProfilePicture] = useState(null);

	const currentPassword = useRef();
	const password = useRef();
	const passwordAgain = useRef();

	const navigate = useNavigate();

	const saveInfo = async (e) => {
		e.preventDefault();
		const updateInfo = {
			userId: user._id,
			username: username,
			desc: desc,
			city: city,
			from: fromCity,
			relationship: relationshipValue,
		};
		if (coverPicture) {
			const data = new FormData();
			data.append("file", coverPicture);
			try {
				const result = await axiosInstance.post("/upload", data);
				updateInfo.coverPicture = result.data.secure_url;
			} catch (err) {}
		}
		if (profilePicturele) {
			const data2 = new FormData();
			data2.append("file", profilePicturele);
			try {
				const result = await axiosInstance.post("/upload", data2);
				updateInfo.profilePicture = result.data.secure_url;
			} catch (err) {}
		}

		try {
			await axiosInstance.put("/users/" + user._id, updateInfo);
			navigate(`/profile/${username}`, { replace: true });
			setUpdate(true);
		} catch (err) {
			console.log(err);
		}
	};

	const savePassword = async (e) => {
		e.preventDefault();
		if (passwordAgain.current.value !== password.current.value) {
			passwordAgain.current.setCustomValidity("Passwords don't match!");
		} else {
			const changePass = {
				userId: user._id,
				currentPassword: currentPassword.current.value,
				password: password.current.value,
			};
			try {
				await axiosInstance.put("/users/" + user._id, changePass);
				alert("Successful, need to login again to continue!!");
				navigate("/login");
				window.localStorage.clear();
				window.location.reload();
			} catch (err) {
				alert("Current password is incorrect!");
			}
		}
	};

	const UpdateInfo = () => {
		return (
			<>
				<div className="title">
					<h1>Edit Informations</h1>
				</div>
				<div className="body">
					<div className="bodyInfo">
						<div className="bodyInfoItem">
							<span className="bodyInfoKey">Name:</span>
							<input
								className="bodyEditInput"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
						<div className="bodyInfoItem">
							<span className="bodyInfoKey">Desc:</span>
							<input
								className="bodyEditInput"
								value={desc}
								onChange={(e) => setDesc(e.target.value)}
							/>
						</div>
						<div className="bodyInfoItem">
							<span className="bodyInfoKey">Profile Picture:</span>
							<input
								className="bodyEditInput"
								type="file"
								name="profilePicture"
								onChange={(e) => setProfilePicture(e.target.files[0])}
							/>
						</div>
						<div className="bodyInfoItem">
							<span className="bodyInfoKey">Cover Picture:</span>
							<input
								className="bodyEditInput"
								type="file"
								name="coverPicture"
								onChange={(e) => setCoverPicture(e.target.files[0])}
							/>
						</div>
						<div className="bodyInfoItem">
							<span className="bodyInfoKey">City:</span>
							<input
								className="bodyEditInput"
								value={city}
								onChange={(e) => setCity(e.target.value)}
							/>
						</div>
						<div className="bodyInfoItem">
							<span className="bodyInfoKey">From:</span>
							<input
								className="bodyEditInput"
								value={fromCity}
								onChange={(e) => setFromCity(e.target.value)}
							/>
						</div>
						<div className="bodyInfoItem">
							<span className="bodyInfoKey">Relationship:</span>
							<input
								className="bodyRadioInput"
								type="radio"
								value="Single"
								checked={relationshipValue === "Single"}
								name="relationship"
								onChange={(e) => setRelationshipValue(e.target.value)}
							/>
							Single
							<input
								className="bodyRadioInput"
								type="radio"
								value="Married"
								checked={relationshipValue === "Married"}
								name="relationship"
								onChange={(e) => setRelationshipValue(e.target.value)}
							/>
							Married
						</div>
					</div>
				</div>
			</>
		);
	};

	const ChangePassword = () => {
		return (
			<>
				<div className="title">
					<h1>Change Password</h1>
				</div>
				<div className="body">
					<div className="bodyInfo">
						<div className="bodyInfoItem">
							<span className="bodyInfoKey">Current password:</span>
							<input
								className="bodyEditInput"
								ref={currentPassword}
								type="password"
								minLength="6"
								required
							/>
						</div>
						<div className="bodyInfoItem">
							<span className="bodyInfoKey">New password:</span>
							<input
								className="bodyEditInput"
								ref={password}
								type="password"
								minLength="6"
								required
							/>
						</div>
						<div className="bodyInfoItem">
							<span className="bodyInfoKey">Confirm password:</span>
							<input
								className="bodyEditInput"
								ref={passwordAgain}
								type="password"
								minLength="6"
								required
							/>
						</div>
					</div>
				</div>
			</>
		);
	};

	return (
		<div className="modalBackground">
			<form
				className="modalContainer"
				onSubmit={changePasswords ? savePassword : saveInfo}
			>
				<div className="titleCloseBtn">
					<button
						onClick={() => {
							setInfo(false);
						}}
					>
						X
					</button>
				</div>
				{changePasswords ? <ChangePassword /> : <UpdateInfo />}
				<div className="footer">
					<button
						onClick={() => {
							setInfo(false);
						}}
						id="cancelBtn"
					>
						Cancel
					</button>
					<button type="submit">Save</button>
				</div>
			</form>
		</div>
	);
}

export default UpdateInfo;
