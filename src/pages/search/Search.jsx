import "./search.css";

import SearchBar from "../../components/Searchbar/Searchbar";
import BottomBar from "../../components/BottomBar/BottomBar";

const Search = () => {
	return (
		<>
			<div className="search">
				<div className="searchWrapper">
					<div className="searchCenter">
						<SearchBar />
						<span className="logoSearch">Pusta</span>
					</div>
				</div>
				<BottomBar />
			</div>
		</>
	);
};

export default Search;
