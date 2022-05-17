import "./login.css";
import { useContext, useRef } from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
	const email = useRef();
	const password = useRef();
	const { isFetching, dispatch } = useContext(AuthContext);

	const handelClick = (e) => {
		if (e) {
			e.preventDefault();
		} else {
			return;
		}
		loginCall(
			{
				email: email.current.value,
				password: password.current.value,
			},
			dispatch
		);
	};
	return (
		<div className="login">
			<div className="loginWrapper">
				<div className="loginLeft">
					<h3 className="loginLogo">Pusta</h3>
					<span className="loginDesc">
						Connect with friends and the world around you on the web.
					</span>
				</div>
				<div className="loginRight">
					<form className="loginBox" onSubmit={handelClick}>
						<input
							placeholder="Email"
							className="loginInput"
							type="email"
							required
							ref={email}
						/>
						<input
							placeholder="Password"
							className="loginInput"
							type="password"
							required
							minLength="6"
							ref={password}
						/>
						<button className="loginButton" type="submit">
							{isFetching ? "Loading" : "Log In"}
						</button>
						<span className="loginForgot">Forgot Password?</span>
						<Link to="/register" style={{ textAlign: "center" }}>
							<button className="logginRegisterButton">
								Create New Account
							</button>
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
}
