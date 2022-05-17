const AuthReducer = (state, actions) => {
	switch (actions.type) {
		case "LOGIN_START":
			return {
				user: null,
				isFetching: true,
				error: false,
			};
		case "LOGIN_SUCCESS":
			return {
				user: actions.payload,
				isFetching: false,
				error: false,
			};
		case "LOGIN_FAILURE":
			return {
				user: null,
				isFetching: false,
				error: actions.payload,
			};
		case "FOLLOW":
			return {
				...state,
				user: {
					...state.user,
					followings: [...state.user.followings, actions.payload],
				},
			};
		case "UNFOLLOW":
			return {
				...state,
				user: {
					...state.user,
					followings: state.user.followings.filter(
						(following) => following !== actions.payload
					),
				},
			};
		default:
			return { ...state };
	}
};

export default AuthReducer;
