if(user_data.loggedIn) {
	analytics.identify(user_data['id'],{
		'firstName' : user_data['firstName'],
		'email' : user_data['email']
	});
}
else {
	analytics.identify({});
}
