import "./home.css";

import Sidebar from "../../components/Sidebar/Sidebar";
import Feed from "../../components/Feed/Feed";
import Rightbar from "../../components/Rightbar/Rightbar";
import BottomBar from "../../components/BottomBar/BottomBar";

export default function Home() {
	return (
		<>
			<div className="home">
				<Sidebar />
				<Feed />
				<Rightbar />
				<BottomBar />
			</div>
		</>
	);
}
