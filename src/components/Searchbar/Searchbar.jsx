import "./searchbar.css";
import { useRef, useState } from "react";
import { axiosInstance } from "../../config";
import { Close, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function SearchBar({ user, chat }) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER || process.env.PORT;

	const [searchFriend, setSearchFriend] = useState([]);
	const search = useRef();

	const searchHandler = async (e) => {
		e.preventDefault();
		const searchItem = search.current.value;
		try {
			const res = await axiosInstance.get(`/search?username=${searchItem}`);

			if (res.data.length > 0) {
				setSearchFriend(res.data);
			} else {
				setSearchFriend([{ notFound: "Not Found" }]);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const closeBox = () => {
		setSearchFriend([]);
		search.current.value = "";
	};

	const SearchRightBar = () => {
		return (
			<>
				{!searchFriend[0]?.notFound ? (
					searchFriend.map((s, i) => (
						<Link
							to={`/profile/${s.username}`}
							style={{
								color: "inherit",
								textDecoration: "inherit",
							}}
							key={i}
						>
							<li className="searchFriendItem">
								<img
									src={
										s.profilePicture
											? s.profilePicture
											: PF + "person/noAvatar.gif"
									}
									alt="profile"
									className="searchFriendItemImg"
								/>
								<span className="searchFriendItemUsername">{s.username}</span>
							</li>
						</Link>
					))
				) : (
					<span className="searchFriendItemNotFound">User not found</span>
				)}
			</>
		);
	};

	const SearchChattBar = () => {
		return (
			<>
				{!searchFriend[0]?.notFound ? (
					searchFriend.map((s, i) => (
						<li className="searchFriendItem" key={i}>
							<img
								src={
									s.profilePicture
										? s.profilePicture
										: PF + "person/noAvatar.gif"
								}
								alt="profile"
								className="searchFriendItemImg"
								onClick={() => createChat(s._id)}
							/>
							<span className="searchFriendItemUsername">{s.username}</span>
						</li>
					))
				) : (
					<span className="searchFriendItemNotFound">User not found</span>
				)}
			</>
		);
	};

	const createChat = async (friendId) => {
		try {
			await axiosInstance.post("/conversations", {
				senderId: user._id,
				receiverId: friendId,
			});
			console.log(friendId);
			window.location.reload(true);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<form className="searchbar" onSubmit={searchHandler}>
				<input
					placeholder="Search for friends"
					className="searchInput"
					ref={search}
				/>
				{searchFriend.length === 0 ? (
					<Search className="searchIcon" onClick={searchHandler} />
				) : (
					<Close className="searchIcon" onClick={closeBox} />
				)}
				<span className="searchTitle">
					{searchFriend.length === 0 ? "Please search!!!" : ""}
				</span>
			</form>
			<div
				className={
					"searchFriendBox" + (searchFriend.length > 0 ? " appear" : "")
				}
			>
				{chat === true ? <SearchChattBar /> : <SearchRightBar />}
			</div>
		</>
	);
}
