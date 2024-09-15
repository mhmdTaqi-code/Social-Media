function myprofileclicked(){

  user =JSON.parse(localStorage.getItem("user"))
  if(user != null || user !=undefined){
    window.location = `./profile.html?userID=${user.id}`

  }else{
    loginLogOutalert("You must login","danger")
  }
}

function LODING(isload){
  
  if(isload){
    document.getElementById("lodding").style.visibility = "visible"
  }else{
    document.getElementById("lodding").style.visibility = "hidden"

  }
}








function deletepostapi(){
  const postidInput = document.getElementById("postid").value 
  console.log(postidInput)
  const token = localStorage.getItem("token")
  let header =  {
      "Authorization":`Bearer ${token}`
 }
 LODING(true)
  axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postidInput}`, {
      headers:header
  }).then(response=>{
      console.log(response)

      getpostuser()
      refrishprofile()
      loginLogOutalert("you delete the post successfully")
      const model = document.getElementById("deletePost");

      const modelinst = bootstrap.Modal.getInstance(model);
      modelinst.hide();
      getposts()

      

  }).catch(err=>{
    loginLogOutalertmodel(error.response.data.message)
      console.log(err)
  }).finally(()=>{
    LODING(false)
})
  
}

function deletePostmodle(postid){
  if (postid !== null || postid !==""){
      document.getElementById("postid").value = postid

  }


  let moudle = new bootstrap.Modal(document.getElementById("deletePost"),{})
  moudle.toggle()


}

function profileclicked(userid){
  window.location = `./profile.html?userID=${userid}`


}

function postclicked(postid){
  window.location = `./PostDetails.html?PostID=${postid}`

}



function editPostBtnClicked(postObject){
  let post = JSON.parse(decodeURIComponent(postObject))
  document.getElementById("post-modal-titile").innerHTML = "edit post"
  document.getElementById("titlepost").value = post.title
  document.getElementById("postid").value = post.id
  document.getElementById("submitbtn").innerHTML = "Update"
  document.getElementById("bodypost").value = post.body




  let moudle = new bootstrap.Modal(document.getElementById("postModel"),{})
  moudle.toggle()



}



















function sginupUI() {
  const token = localStorage.getItem("token");
  const loginDiv = document.getElementById("logindiv");
  const username = document.getElementById("username-nav")
  const logoutDiv = document.getElementById("logoutdiv");
  const userimg = document.getElementById("userimg")
  const addpostbtn = document.getElementById("addpost")
  let user = JSON.parse(localStorage.getItem("user"))

  if (token !== null) {
    loginDiv.classList.add("d-block");
    loginDiv.classList.remove("d-flex");
    loginDiv.classList.add("d-none");
    logoutDiv.classList.remove("d-none");
    try{
      addpostbtn.classList.remove("d-none");
    }catch(err){console.log(err)}
    username.innerHTML = user.username
    if (user.profile_image == "[object Object]" ){
      userimg.setAttribute("src", "./profile pic/download.png")
    }else{
      userimg.src = user.profile_image
    }


  } else {
    try{
      addpostbtn.classList.add("d-none");
    }catch(err){console.log(err)}
   
    loginDiv.classList.remove("d-none");
    loginDiv.classList.add("d-flex");
    logoutDiv.classList.add("d-none");


  }
}

function logout(){

  localStorage.removeItem("token");
  sginupUI();
  localStorage.removeItem("user");


  checkUserLoggedIn() 
  loginLogOutalert("you log out seccssfuly")
  

}


function loginLogOutalertmodel(text, categry = "success") {


  var alertPlaceholder = document.createElement("div")
  alertPlaceholder.id = "loginalert"
  document.getElementById("alertmodel").appendChild(alertPlaceholder);

  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
  }
  appendAlert(text, categry)

  setTimeout(() => {
    const alert = bootstrap.Alert.getOrCreateInstance('#loginalert')
    alert.close()
  }, 2000)
}




function loginLogOutalert(text, categry = "success") {


  var alertPlaceholder = document.createElement("div")
  alertPlaceholder.id = "loginalert"
  document.getElementById("alert").appendChild(alertPlaceholder);

  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
  }
  appendAlert(text, categry)

  setTimeout(() => {
    const alert = bootstrap.Alert.getOrCreateInstance('#loginalert')
    alert.close()
  }, 2000)
}


function registerclicked() {
  LODING(true)
  const password = document.getElementById("passwordregister").value;
  const username = document.getElementById("usernameregister").value;
  const name = document.getElementById("nameregister").value;
  const email = document.getElementById("emailregister").value;
  const img = document.getElementById("img").files[0]



  let formdata = new FormData()


  formdata.append("username", username)
  formdata.append("password", password)
  formdata.append("name", name)
  formdata.append("email", email)
  formdata.append("image", img)

 
  axios.post("https://tarmeezacademy.com/api/v1/register", formdata)
    .then((response) => {

      let token = response.data.token;
      let user = response.data.user;
      console.log(token);
      console.log(user)

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const model = document.getElementById("registerModal");
      const modelinst = bootstrap.Modal.getInstance(model);
      modelinst.hide();

      checkUserLoggedIn() 
      sginupUI();
      loginLogOutalert("yor account created sucessfuly")
    })
    .catch((error) => {
      console.log(error);
      loginLogOutalertmodel(error.response.data.message, "danger");
    }).finally(()=>{
      LODING(false)
  })


}





function login() {
  LODING(true)
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;

  const prams = {
    "username": username,
    "password": password
  };



  axios.post("https://tarmeezacademy.com/api/v1/login", prams)
    .then((response) => {
      let token = response.data.token;
      let user = response.data.user;
      console.log(token);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const model = document.getElementById("exampleModal");
      const modelinst = bootstrap.Modal.getInstance(model);
      modelinst.hide();


      try {
   
        checkUserLoggedIn() 
        sginupUI();
      } catch (error) {
        console.error( error.message);
      }finally{
      
      sginupUI();
      loginLogOutalert("you login secessfuly")}
    })
    .catch((error) => {
      console.log(error);
      loginLogOutalertmodel(error.response.data.message, "danger");
    }).finally(()=>{
      LODING(false)
  })
}
