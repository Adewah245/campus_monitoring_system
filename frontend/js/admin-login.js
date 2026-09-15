// =========================================
// CAMPUS WATCH ADMIN LOGIN
// =========================================


// ADMIN ACCOUNT

const adminAccount = {

    email: "admin@campustrack.com",

    password: "admin123"

};



// =========================================
// SAVE ADMIN ACCOUNT
// =========================================

// Check if an admin account already exists

if (localStorage.getItem("campusWatchAdmin") === null) {


    localStorage.setItem(

        "campusWatchAdmin",

        JSON.stringify(adminAccount)

    );

}



// =========================================
// LOGIN FORM
// =========================================

const loginForm =
    document.getElementById("adminLoginForm");



if (loginForm) {


    loginForm.addEventListener(
        "submit",
        function (event) {


            // Stop the form from refreshing the page

            event.preventDefault();



            // Get email entered by admin

            const email =
                document.getElementById("adminEmail").value.trim();



            // Get password entered by admin

            const password =
                document.getElementById("adminPassword").value;



            // Get saved admin account

            const savedAdmin =
                JSON.parse(
                    localStorage.getItem("campusWatchAdmin")
                );



            // Check credentials

            if (

                email === savedAdmin.email &&

                password === savedAdmin.password

            ) {


                // Save login session

                localStorage.setItem(
                    "campusWatchAdminLoggedIn",
                    "true"
                );



                // Go to User Management

                window.location.href =
                    "users.html";


            }

            else {


                // Show error

                const message =
                    document.getElementById("loginMessage");


                message.textContent =
                    "Incorrect email or password.";

                message.style.color =
                    "#d64545";


            }


        }
    );

}