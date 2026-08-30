/* =========================================
   MUSTER LOGIN — DEPOT DROPDOWN
========================================= */

const API_URL = "https://muster-api-tp2v.onrender.com";

document.addEventListener("DOMContentLoaded", async function () {

    const depotSelect =
        document.getElementById("loginDepot");

    const optionsContainer =
        document.getElementById("loginDepotOptions");

    const depotText =
        document.getElementById("loginDepotText");


    if (!depotSelect || !optionsContainer || !depotText) {
        return;
    }


    try {

        const response =
            await fetch(API_URL + "/api/depots");

        const data =
            await response.json();


        if (!data.success) {
            return;
        }


        data.depots.forEach(function (depot) {

            /* =====================================
               ADD TO HIDDEN SELECT
            ===================================== */

            const option =
                document.createElement("option");

            option.value = depot;
            option.textContent = depot;

            depotSelect.appendChild(option);


            /* =====================================
               ADD CUSTOM DROPDOWN OPTION
            ===================================== */

            const customOption =
                document.createElement("div");

            customOption.className =
                "custom-select-option";

            customOption.textContent = depot;

            customOption.dataset.value = depot;


            customOption.onclick = function () {

                depotSelect.value = depot;

                depotText.textContent = depot;


                document
                    .querySelectorAll(".custom-select-option")
                    .forEach(function (item) {

                        item.classList.remove("selected");

                    });


                customOption.classList.add("selected");

                closeDepotDropdown();

            };


            optionsContainer.appendChild(customOption);

        });


    } catch (error) {

        console.error(
            "Unable to load depots:",
            error
        );

    }

});

/* =========================================
   LOAD MUSTER DEPOT DROPDOWN
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const musterDepot =
            document.getElementById("depot");

        if (!musterDepot) {
            return;
        }

        try {

            const response =
                await fetch(
                    API_URL + "/api/depots"
                );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {
                console.error(
                    "Unable to load muster depots:",
                    data
                );
                return;
            }

            /* Clear existing options */

            musterDepot.innerHTML = "";

            /* Add depots from API */

            data.depots.forEach(function (depot) {

                const option =
                    document.createElement("option");

                option.value = depot;
                option.textContent = depot;

                musterDepot.appendChild(option);

            });

        } catch (error) {

            console.error(
                "Unable to load muster depots:",
                error
            );

        }

    }
);

/* =========================================
   DEPOT DROPDOWN OPEN / CLOSE
========================================= */

function toggleDepotDropdown() {

    const wrapper =
        document.getElementById("loginDepotWrapper");


    if (!wrapper) {
        return;
    }


    wrapper.classList.toggle("open");

}


function closeDepotDropdown() {

    const wrapper =
        document.getElementById("loginDepotWrapper");


    if (!wrapper) {
        return;
    }


    wrapper.classList.remove("open");

}


/* =========================================
   CLOSE DROPDOWN WHEN CLICKING OUTSIDE
========================================= */

document.addEventListener("click", function (event) {

    const wrapper =
        document.getElementById("loginDepotWrapper");


    if (!wrapper) {
        return;
    }


    if (!wrapper.contains(event.target)) {

        wrapper.classList.remove("open");

    }

});


/* =========================================
   SHOW / HIDE PASSWORD
========================================= */

function toggleLoginPassword() {

    const password =
        document.getElementById("loginPassword");

    const button =
        document.getElementById("togglePassword");


    if (!password || !button) {
        return;
    }


    if (password.type === "password") {

        password.type = "text";

        button.textContent = "🙈";

    } else {

        password.type = "password";

        button.textContent = "👁";

    }

}


/* =========================================
   LOGIN
========================================= */

async function loginMuster() {

    const depot =
        document.getElementById("loginDepot").value;

    const password =
        document.getElementById("loginPassword").value;

    const error =
        document.getElementById("loginError");


    error.textContent = "";


    /* =====================================
       NO DEPOT
    ===================================== */

    if (!depot) {

        error.textContent =
            "Please select User ID.";

        return;

    }


    /* =====================================
       NO PASSWORD
    ===================================== */

    if (!password) {

        error.textContent =
            "Please enter password.";

        return;

    }
	
showStatus(
    "Signing In",
    "Authenticating your account...",
    "loading"
);

    try {

        /* =====================================
           SEND LOGIN TO FLASK API
        ===================================== */

        const response =
            await fetch(API_URL + "/api/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    depot: depot,

                    password: password

                })

            });


        const data =
            await response.json();


        /* =====================================
           LOGIN FAILED
        ===================================== */

        if (!response.ok || !data.success) {
			
			showError(
    "Login Failed",
    data.message || "Invalid username or password."
);

            error.textContent =
                data.message ||
                "Invalid User ID or password.";


            document.getElementById(
                "loginPassword"
            ).value = "";


            document.getElementById(
                "loginPassword"
            ).focus();


            return;

        }


        /* =====================================
           GET SECURITY TOKEN
        ===================================== */

        const token = data.token;


        if (!token) {

            error.textContent =
                "Login failed. No security token received.";

            return;

        }


        /* =====================================
           SUCCESSFUL LOGIN
        ===================================== */

        /* Hide login */
		
		showSuccess(
    "Login Successful",
    "Welcome back.",1200
);

        const loginScreen =
            document.getElementById("loginScreen");

        if (loginScreen) {

            loginScreen.style.display = "none";

        }


        /* Show muster */

        const musterApp =
            document.getElementById("musterApp");

        if (musterApp) {

            musterApp.style.display = "block";

        }


        /* Show header menu */

        const headerMenu =
            document.getElementById(
                "headerMenuContainer"
            );

        if (headerMenu) {

            headerMenu.style.display = "block";

        }


        /* =====================================
           STORE LOGIN INFORMATION
        ===================================== */

        window.loggedInDepot =
            depot;

        window.musterAuthToken =
            token;


        /* =====================================
           REMEMBER LOGIN
        ===================================== */

        localStorage.setItem(
            "musterLoggedInDepot",
            depot
        );

        localStorage.setItem(
            "musterAuthToken",
            token
        );


        /* =====================================
           SET MUSTER DEPOT
        ===================================== */

        const musterDepot =
            document.getElementById("depot");


        if (musterDepot) {

            musterDepot.value =
                depot;


            /* Existing depot logic */

            if (typeof changeDepot === "function") {

                setTimeout(() => {

    changeDepot();

}, 1200);

            }


            /* Prevent changing depot */

            musterDepot.disabled = true;

        }


    } catch (networkError) {
		
		showError(
    "Connection Failed",
    "Unable to connect to the server."
);

        console.error(
            "Login error:",
            networkError
        );


        error.textContent =
            "Unable to connect to server. Please try again.";

    }

}

/* =========================================
   REMEMBER LOGIN
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const savedDepot =
            localStorage.getItem(
                "musterLoggedInDepot"
            );


        const savedToken =
            localStorage.getItem(
                "musterAuthToken"
            );


        /* No saved login */

        if (!savedDepot || !savedToken) {

            return;

        }


        try {

            /* =================================
               VERIFY SAVED TOKEN
            ================================= */

            const response =
                await fetch(

                    API_URL +
                    "/api/employees/" +
                    encodeURIComponent(savedDepot),

                    {

                        method: "GET",

                        headers: {

                            "Authorization":
                                "Bearer " +
                                savedToken

                        }

                    }

                );


            const data =
                await response.json();


            /* =================================
               TOKEN INVALID
            ================================= */

            if (!response.ok || !data.success) {

                localStorage.removeItem(
                    "musterLoggedInDepot"
                );

                localStorage.removeItem(
                    "musterAuthToken"
                );

                return;

            }


            /* =================================
               TOKEN VALID
            ================================= */

            window.loggedInDepot =
                savedDepot;

            window.musterAuthToken =
                savedToken;


            /* Hide login */

            const loginScreen =
                document.getElementById(
                    "loginScreen"
                );


            if (loginScreen) {

                loginScreen.style.display =
                    "none";

            }


            /* Show muster */

            const musterApp =
                document.getElementById(
                    "musterApp"
                );


            if (musterApp) {

                musterApp.style.display =
                    "block";

            }


            /* Show header */

            const headerMenu =
                document.getElementById(
                    "headerMenuContainer"
                );


            if (headerMenu) {

                headerMenu.style.display =
                    "block";

            }


            /* =================================
   SET MUSTER DEPOT
================================= */

const musterDepot =
    document.getElementById("depot");


if (musterDepot) {

    musterDepot.value =
        savedDepot;


    /* Existing depot logic */

    if (
        typeof changeDepot ===
        "function"
    ) {

        changeDepot();

    }


    /* Prevent changing depot */

    musterDepot.disabled =
        true;

}


        } catch (error) {

            console.error(
                "Remember login verification failed:",
                error
            );

        }

    }
);


/* =========================================
   LOGOUT
========================================= */
let employees = [];

function logoutMuster(showMessage = false) {

    if (showMessage) {
        showStatus(
            "Signing Out",
            "Please wait...",
            "loading"
        );
    }

    /* Clear old employee data immediately */

    employees = [];

    const staffBody =
        document.getElementById("staffBody");

    if (staffBody) {
        staffBody.innerHTML = "";
    }

    /* =====================================
       REMOVE SAVED LOGIN
    ===================================== */

    localStorage.removeItem(
        "musterLoggedInDepot"
    );

    localStorage.removeItem(
        "musterAuthToken"
    );


    /* Clear current login */

    window.loggedInDepot = null;
    window.musterAuthToken = null;


    /* =====================================
       SHOW LOGIN SCREEN
    ===================================== */

    const loginScreen =
        document.getElementById("loginScreen");

    if (loginScreen) {
        loginScreen.style.display = "flex";
    }


    /* =====================================
       HIDE MUSTER
    ===================================== */

    const musterApp =
        document.getElementById("musterApp");

    if (musterApp) {
        musterApp.style.display = "none";
    }


    /* =====================================
       HIDE HEADER MENU
    ===================================== */

    const headerMenu =
        document.getElementById("headerMenuContainer");

    if (headerMenu) {
        headerMenu.style.display = "none";
    }


    /* =====================================
       RESET PASSWORD
    ===================================== */

    const password =
        document.getElementById("loginPassword");

    if (password) {
        password.value = "";
    }


    /* =====================================
       RESET DEPOT
    ===================================== */

    const depotSelect =
        document.getElementById("loginDepot");

    if (depotSelect) {
        depotSelect.value = "";
    }


    const depotText =
        document.getElementById("loginDepotText");

    if (depotText) {
        depotText.textContent = "Select User ID";
    }


    /* Remove selected state */

    document
        .querySelectorAll(".custom-select-option")
        .forEach(function(item) {

            item.classList.remove("selected");

        });


    /* Close dropdown */

    closeDepotDropdown();


    /* =====================================
       SHOW LOGOUT SUCCESS
    ===================================== */
    if (showMessage) {

        setTimeout(function() {

            showSuccess(
                "Logged Out",
                "You have been safely logged out.",
                1200
            );

        }, 350);
    }
}