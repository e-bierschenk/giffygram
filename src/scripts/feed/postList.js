import { post } from "./posts.js";

export const postList = (allPosts) => {
	let postHTML = "";
		//Loop over the array of posts and for each one, invoke the Post component which returns HTML representation
		for (const postObject of allPosts) {
			//what is a postObject?
			postHTML += post(postObject)
		}
		return postHTML;
}