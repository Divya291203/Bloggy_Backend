const slugCreator = (title) => {
	const slug = title
		.split(" ")
		.join("-")
		.toLowerCase()
		.replace(/[^a-zA-Z0-9-]/g, "");
	return slug;
};

export default slugCreator;
