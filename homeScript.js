let currientPage = 1;
let lastPage = 1;

// Fetch posts from API and display them
function getposts(resetPost = true, page = 1) {
    let postview = document.getElementById("posts");

    // Reset posts view if required
    if (resetPost) {
        postview.innerHTML = "";
    }
    LODING(true)
    // Fetch posts from API
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=10&page=${page}`)
        .then((response) => {
            let posts = response.data.data;
            lastPage = response.data.meta.last_page;

            // Loop through posts and display each
            for (let post of posts) {
                let alltag = "";
                let btnEdit = "";
                let btnDelete = "";

                // Get current user from local storage
                user = JSON.parse(localStorage.getItem("user"));

                // Show edit and delete buttons if the post author is the current user
                if (user != null && user.id == post.author.id) {
                    btnDelete = `<button class='btn btn-danger' style='float: right;' onclick="deletePostmodle(${post.id})">Delete</button>`;
                    btnEdit = `<button class='btn btn-secondary' style='float: right; margin-left:10px;' onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>`;
                }

                // Build tags list
                let tags = post.tags;
                for (let tag of tags) {
                    alltag += `<span class="badge bg-secondary mx-1">${tag}</span>`;
                }

                // Add post to the DOM
                postview.innerHTML += `
                    <div id="post" class="p-3">
                        <div style="margin-top:10px;" class="card shadow">
                            <h5 class="card-header">
                                <span style="cursor: pointer;" onclick="profileclicked(${post.author.id})">
                                    <img class="rounded-circle border-4" style="height: 40px; width: 40px;"  src="${post.author.profile_image == '[object Object]' ? './profile pic/download.png' : post.author.profile_image}" alt="profile photo">
                                    <b>${post.author.username}</b>
                                </span>
                                ${btnEdit}
                                ${btnDelete}
                            </h5>
                            <div class="card-body" style="cursor: pointer;" onclick="postclicked(${post.id})">
                                <img class="w-100" src="${post.image}" alt="">
                                <h6 class="mt-2" style="color: rgb(165, 162, 162);">${post.created_at}</h6>
                                <h5>${post.title}</h5>
                                <p>${post.body}</p>
                                <hr>
                                <div id="comment">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                    </svg>
                                    <span>(${post.comments_count}) comments</span>
                                </div>
                            </div>
                            ${alltag}
                        </div>
                    </div>`;
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            LODING(false);
        });
}

// Check if the user has scrolled to the bottom of the page
function isScrollAtBottom() {
    return (window.innerHeight + window.scrollY) >= document.body.scrollHeight;
}

// Event listener for infinite scrolling
window.addEventListener('scroll', function () {
    if (isScrollAtBottom() && currientPage < lastPage) {
        currientPage++;
        getposts(false, currientPage);
    }
});

// Initial call to fetch posts
getposts();

// Create or update a post
function postcreate() {
    const postidInput = document.getElementById("postid").value;
    const title = document.getElementById("titlepost").value;
    const bodypost = document.getElementById("bodypost").value;
    const img = document.getElementById("postimg").files[0];
    let isCreate = !postidInput; // Check if we're creating a new post

    let formdata = new FormData();
    formdata.append("body", bodypost);
    formdata.append("title", title);
    formdata.append("image", img);

    token = localStorage.getItem("token");

    let headers = {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
    };

    let URL = isCreate ? "https://tarmeezacademy.com/api/v1/posts" : `https://tarmeezacademy.com/api/v1/posts/${postidInput}`;
    
    if (!isCreate) {
        formdata.append("_method", "put");
    }
    LODING(true)

    axios.post(URL, formdata, { headers: headers })
        .then((response) => {
            const model = document.getElementById("postModel");
            const modelinst = bootstrap.Modal.getInstance(model);
            modelinst.hide();
            getposts(); 

            if(isCreate){
                loginLogOutalert("Post created successfully");
            }else{
                loginLogOutalert("Post Edited successfully");
            }
           
        })
        .catch((error) => {
            console.log(error);
            loginLogOutalertmodel(error.response.data.message, "danger");
        })
        .finally(() => {
            LODING(false);
        });
}

// Open post creation modal
function creatpost() {
    document.getElementById("post-modal-titile").innerHTML = "Create a New Post";
    document.getElementById("titlepost").value = "";
    document.getElementById("postid").value = null;
    document.getElementById("submitbtn").innerHTML = "Create";
    document.getElementById("bodypost").value = "";

    let modal = new bootstrap.Modal(document.getElementById("postModel"), {});
    modal.toggle();
}

// Call this function on page load to initialize UI for sign up (if necessary)
sginupUI();
