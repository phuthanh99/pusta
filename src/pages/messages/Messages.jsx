import "./messages.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../config";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/Message/Message";
import BottomBar from "../../components/BottomBar/BottomBar";
import { io } from "socket.io-client";
import SearchBar from "../../components/Searchbar/Searchbar";

export default function Messages() {
	const [conversations, setConversations] = useState([]);
	const [currentChat, setCurrentChat] = useState(null);
	const [active, setActive] = useState(null);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [arrivalMessage, setArrivalMessage] = useState(null);
	const [chatModal, setChatModal] = useState(false);
	const socket = useRef();
	const scrollRef = useRef();

	const { user } = useContext(AuthContext);

	useEffect(() => {
		socket.current = io("ws://localhost:8000");
		socket.current.on("getMessage", (data) => {
			setArrivalMessage({
				sender: data.senderId,
				text: data.text,
				createdAt: Date.now(),
			});
		});
	}, []);

	useEffect(() => {
		arrivalMessage &&
			currentChat?.members.includes(arrivalMessage.sender) &&
			setMessages((prev) => [...prev, arrivalMessage]);
	}, [arrivalMessage, currentChat]);

	useEffect(() => {
		socket.current.emit("addUser", user._id);
	}, [user]);

	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await axiosInstance.get("/conversations/" + user._id);
				setConversations(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		getConversations();
	}, [user._id]);

	useEffect(() => {
		const getMessages = async () => {
			try {
				const res = await axiosInstance.get("/messages/" + currentChat?._id);
				setMessages(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		getMessages();
	}, [currentChat]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (newMessage === "") {
			return;
		}
		const message = {
			sender: user._id,
			text: newMessage,
			conversationId: currentChat._id,
		};

		const receiverId = currentChat.members.find(
			(member) => member !== user._id
		);

		socket.current.emit("sendMessage", {
			senderId: user._id,
			receiverId,
			text: newMessage,
		});

		try {
			const res = await axiosInstance.post("/messages", message);
			setMessages([...messages, res.data]);
			setNewMessage("");
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const setStates = (c, i) => {
		setCurrentChat(c);
		setActive(i);
		setChatModal(true);
	};

	return (
		<div className="messages">
			<Sidebar />
			<div className="messagesOnline">
				<div className="messagesOnlineWrapper">
					<span className="messagesOnlineTitle">Messages</span>
					<hr className="messagesOnlineHr" />

					<div className="messagesAddChat">Add new chat</div>
					<SearchBar user={user} chat={true} />

					{conversations.map((c, i) => (
						<div
							key={i}
							onClick={() => setStates(c, i)}
							className={active === i ? "actived" : ""}
						>
							<Conversation conversation={c} currentUser={user} />
						</div>
					))}
				</div>
			</div>
			<div className="messagesBox">
				<div className="messagesBoxWrapper">
					{currentChat ? (
						<>
							<div className="messagesBoxTop">
								{messages.map((m, i) => (
									<div key={i} ref={scrollRef}>
										<Message message={m} own={m.sender === user._id} />
									</div>
								))}
							</div>
							<div className="messagesBoxBottom">
								<textarea
									className="messagesBoxInput"
									placeholder="write something..."
									onChange={(e) => setNewMessage(e.target.value)}
									value={newMessage}
								></textarea>
								<button className="messagesBoxButton" onClick={handleSubmit}>
									Send
								</button>
							</div>
						</>
					) : (
						<span className="noConversationText">
							Open a conversation to start a chat.
						</span>
					)}
				</div>
			</div>
			{chatModal ? (
				<div className="messagesModal">
					<div className="messagesBoxWrapper">
						<div className="messagesModalCloseBtn">
							<button
								onClick={() => {
									setChatModal(false);
								}}
							>
								X
							</button>
						</div>
						<div className="messagesBoxTop">
							{messages.map((m, i) => (
								<div key={i} ref={scrollRef}>
									<Message message={m} own={m.sender === user._id} />
								</div>
							))}
						</div>
						<div className="messagesBoxBottom">
							<textarea
								className="messagesBoxInput"
								placeholder="write something..."
								onChange={(e) => setNewMessage(e.target.value)}
								value={newMessage}
							></textarea>
							<button className="messagesBoxButton" onClick={handleSubmit}>
								Send
							</button>
						</div>
					</div>
				</div>
			) : (
				""
			)}
			<BottomBar />
		</div>
	);
}
