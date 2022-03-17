import { getUsers, getPosts, getLoggedInUser, usePostCollection, createPost } from "./data/datamanagers.js";
import { postList } from "./feed/postList.js"
import { navBar } from "./nav/navBar.js"
import { footer } from "./footer/footer.js";
import { postEntry } from "./feed/postEntry.js";

const showNavBar = () => {
    //Get a reference to the location on the DOM where the nav will display
    const navElement = document.querySelector("nav");
    navElement.innerHTML = navBar();
}

const showPostList = (postCollection) => {
    //Get a reference to the location on the DOM where the list will display
    const postElement = document.querySelector(".postList");

    postElement.innerHTML = postList(postCollection);
}

const showPostEntry = () => {
    //Get a reference to the location on the DOM where the nav will display
    const entryElement = document.querySelector(".entryForm");
    entryElement.innerHTML = postEntry();
}

const showFooter = (postCollection) => {
    //Get a reference to the location on the DOM where the footer will display
    const footerEl = document.querySelector("footer");
    footerEl.innerHTML = footer(postCollection);
}

const startGiffyGram = () => {
    getPosts()
        .then(data => {
            showNavBar()
            showPostEntry()
            showPostList(data)
            showFooter(data)
        })
}

startGiffyGram();


//get element of main html. all event listeners will be added to this
const applicationElement = document.querySelector(".giffygram");

//click event listeners
applicationElement.addEventListener("click", event => {
    if (event.target.id === "logout") {
        console.log("You clicked on logout")
    } else if (event.target.id === "directMessageIcon") {
        console.log("You tryna slide into those DMs")
    } else if (event.target.id === "resetIcon") {
        console.log("Reset reality")
    } else if (event.target.id.startsWith("edit")) {
        console.log("post clicked", event.target.id.split("--"))
        console.log("the id is", event.target.id.split("--")[1])
    }
})

//event listener foryear selection
applicationElement.addEventListener("change", event => {
    if (event.target.id === "yearSelection") {
        const yearAsNumber = parseInt(event.target.value)
        console.log(`User wants to see posts since ${yearAsNumber}`)
        //invoke a filter function passing the year as an argument
        showFilteredPosts(yearAsNumber);
    }
})

//event listener for the edit post button
applicationElement.addEventListener("click", event => {
    if (event.target.id === "newPost__cancel") {
        //clear the input fields
        showPostEntry()
    }
})

//event listener for the post button
applicationElement.addEventListener("click", event => {
    event.preventDefault();
    if (event.target.id === "newPost__submit") {
        //collect the input values into an object to post to the DB
        const title = document.querySelector("input[name='postTitle']").value
        const url = document.querySelector("input[name='postURL']").value
        const description = document.querySelector("textarea[name='postDescription']").value
        //we have not created a user yet - for now, we will hard code `1`.
        //we can add the current time as well
        const postObject = {
            title: title,
            imageURL: url,
            description: description,
            userId: getLoggedInUser().id,
            timestamp: Date.now()
        }

    createPost(postObject)
    .then(() => getPosts())
    .then(data => {
        showPostList(data)
        showPostEntry()
    })
}})


//filter posts by year
const showFilteredPosts = (year) => {
    //get a copy of the post collection
    const epoch = Date.parse(`01/01/${year}`);
    //filter the data
    const filteredData = usePostCollection().filter(singlePost => {
        if (singlePost.timestamp >= epoch) {
            return singlePost
        }
    })
    //regenerate post list with filtered list
    showPostList(filteredData)
    //update post count in footer
    document.querySelector("#postCount").innerHTML = `${filteredData.length}`;
}