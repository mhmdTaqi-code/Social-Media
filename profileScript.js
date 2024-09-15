// GEt user ID 
function getuserID(){
    
    let serchprams = new URLSearchParams(window.location.search)
    let userid = serchprams.get("userID")
    return userid

}



function refrishprofile() {
    let profilecard = document.getElementById("profilecardd");


     const ID = getuserID()
     LODING(true)
        axios.get(`https://tarmeezacademy.com/api/v1/users/${ID}`)
            .then(response => {
                let user = response.data.data;
                console.log(user);
                document.getElementById("usernamepost").innerHTML = `${user.username}'s Posts`
                let conotent = `
                    <div id="cardprofile" style="margin-top:10px; padding: 20px; display: flex; justify-content:space-between; flex-direction:row;" class="card shadow">
                        <div class="col-2"> 
                            <img src="${user.profile_image == '[object Object]' ? './profile pic/download.png' : user.profile_image}" id="progileimg" class="rounded-circle" alt="Profile Picture">
                        </div>
                        <div class="col-4" style="display: flex; justify-content: space-evenly; flex-direction: column;">
                            <span id="email">${user.email}</span>
                            <span id="username">${user.username}</span>
                            <span id="name">${user.name}</span>
                        </div>
                        <div class="col-4">
                            <span class="count"> ${user.posts_count} </span>  posts
                            <br>
                            <span  class="count"> ${user.comments_count} </span> comments
                        </div>
                    </div>
                `;

                profilecard.innerHTML = conotent;
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                conotent = `
                <div id="cardprofile" style="margin-top:10px; padding: 20px; display: flex; justify-content:space-between; flex-direction:row;" class="card shadow">
                    <div class="col-2"> 
                   ERORR LODING PAGE
                </div>
            `;profilecard.innerHTML = conotent;
            }).finally(() => {
                LODING(false);
            });
        }


 function getpostuser(){
    const ID = getuserID()
    LODING(true)
    axios.get(`https://tarmeezacademy.com/api/v1/users/${ID}/posts`)
.then(response=>{
    console.log(response.data.data)
    
    let posts = response.data.data
    let postsdiv = document.getElementById("posts")
  

    postsdiv.innerHTML = ""
    for(post of posts){
        let btnEdit = ""
        let btnDelete =""
        user = JSON.parse(localStorage.getItem("user"))
        if(user != null && user.id == post.author.id){
                           
            btnDelete = ` ​​<button class='btn btn-danger' style='float: right; ' onclick="deletePostmodle(${post.id})">delete</button>`
             btnEdit = ` ​​<button class='btn btn-secondary' style='float: right ; margin-left:10px;' onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>`
         }
        
        postsdiv.innerHTML += `
      <div id="post" class="p-3">
      <div class="d-flex justify-content-center">
        <div class="col-9">
                                <div style="margin-top:10px;" class="card shadow">
                                    <h5 class="card-header">
                                        <span style="cursor: pointer;" onclick="profileclicked(${post.author.id})">
                                        <img class="rounded-circle border-4" style="height: 40px; width: 40px;" src="${post.author.profile_image == '[object Object]' ? './profile pic/download.png' : post.author.profile_image}" alt="profile photo">
                                        <b>${post.author.username}</b>
                                        </span>
                                        
                                         ${btnEdit}
                                        ${btnDelete}
                                    </h5>
                                    <div class="card-body"  style="cursor: pointer;" onclick="postclicked(${post.id})">
                                        <img class="w-100" src="${post.image}" alt="">
                                        <h6 class="mt-2" style="color: rgb(165, 162, 162);">${post.created_at}</h6>
                                        <h5>${post.title}</h5>
                                        <p>${post.body}</p>
                                        <hr>
                                        <div id="comment">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left" viewBox="0 0 16 16">
                                                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                            </svg>
                                            <span>(${post.comments_count}) comment</span>
                                        </div>
                                    </div>
                                    </div>
                                    </div>
                                  
                                </div>
                            </div>`
                            
        
    } 
  
}).finally(() => {
    LODING(false);
});
}



document.addEventListener("DOMContentLoaded", function() {
    refrishprofile();
    getpostuser()

});
