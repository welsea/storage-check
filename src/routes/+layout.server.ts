export function load(event) {
	const username = event.locals.user?.name;
	const userid = event.locals.user?.id;

	return {
		username: username,
		userid: userid
	};
}


