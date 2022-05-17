import { useRef } from "react";
import "./register.css";
import { useNavigate } from "react-router";
import { axiosInstance } from "../../config";
import { Link } from "react-router-dom";

export default function Register() {
	const email = useRef();
	const username = useRef();
	const password = useRef();
	const passwordAgain = useRef();
	const navigate = useNavigate();

	const handelClick = async (e) => {
		e.preventDefault();
		if (passwordAgain.current.value !== password.current.value) {
			passwordAgain.current.setCustomValidity("Passwords don't match!");
		} else {
			const user = {
				username: username.current.value,
				email: email.current.value,
				password: password.current.value,
			};
			try {
				await axiosInstance.post("/auth/register", user);
				navigate("/login");
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<div className="register">
			<div className="registerWrapper">
				<div className="registerLeft">
					<h3 className="registerLogo">Pusta</h3>
					<span className="registerDesc">
						Connect with friends and the world around you on the web.
					</span>
				</div>
				<div className="registerRight">
					<form className="registerBox" onSubmit={handelClick}>
						<input
							placeholder="User Name"
							required
							ref={username}
							className="registerInput"
							type="text"
						/>
						<input
							placeholder="Email"
							required
							ref={email}
							className="registerInput"
							type="email"
						/>
						<input
							placeholder="Password"
							required
							ref={password}
							className="registerInput"
							type="password"
							minLength="6"
						/>
						<input
							placeholder="Password Again"
							required
							ref={passwordAgain}
							className="registerInput"
							type="password"
						/>
						<button className="registerButton" type="submit">
							Sign Up
						</button>
						<Link to="/login" style={{ textAlign: "center" }}>
							<button className="registerLoginButton">Log Into Account</button>
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
}
