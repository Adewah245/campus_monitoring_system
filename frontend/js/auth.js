const loginForm =
document.getElementById("adminLoginForm");



if(loginForm){


loginForm.addEventListener(
"submit",
function(event){


event.preventDefault();



const username =
document.getElementById("adminUsername").value;



const password =
document.getElementById("adminPassword").value;



const correctUsername =
"admin";


const correctPassword =
"Campus@123";



if(
username === correctUsername &&
password === correctPassword
){


localStorage.setItem(
"adminLoggedIn",
"true"
);



window.location.href =
"users.html";


}

else{


document.getElementById(
"loginMessage"
).textContent =
"Invalid admin credentials";


}


});


}

function logoutAdmin(){

localStorage.removeItem(
"adminLoggedIn"
);


window.location.href =
"admin-login.html";

}