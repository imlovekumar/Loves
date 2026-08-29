/* =========================================
   MUSTER LOGIN — DEPOT DROPDOWN
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const depotSelect =
        document.getElementById("loginDepot");

    const optionsContainer =
        document.getElementById("loginDepotOptions");

    const depotText =
        document.getElementById("loginDepotText");

    if (
        !depotSelect ||
        !optionsContainer ||
        typeof depotPasswords === "undefined"
    ) {
        return;
    }

    Object.keys(depotPasswords).forEach(function (depot, index) {

        /* Add to hidden select */

        const option =
            document.createElement("option");

        option.value = depot;
        option.textContent = depot;

        depotSelect.appendChild(option);


        /* Add custom option */

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

});

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


/* Close when clicking outside */

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

function loginMuster() {

    const depot =
        document.getElementById("loginDepot").value;

    const password =
        document.getElementById("loginPassword").value;

    const error =
        document.getElementById("loginError");


    error.textContent = "";


    /* No depot */

    if (!depot) {

        error.textContent =
            "Please select User ID.";

        return;
    }


    /* No password */

    if (!password) {

        error.textContent =
            "Please enter password.";

        return;
    }


    /* Check password */

    if (
        typeof depotPasswords !== "undefined" &&
        depotPasswords[depot] === password
    ) {

      /* Successful login */

document.getElementById("loginScreen").style.display = "none";

const musterApp = document.getElementById("musterApp");

if (musterApp) {
    musterApp.style.display = "block";
}

const headerMenu = document.getElementById("headerMenuContainer");

if (headerMenu) {
    headerMenu.style.display = "block";
}


/* Store logged-in depot */

window.loggedInDepot = depot;


/* =========================================
   SET MUSTER DEPOT FROM LOGIN
========================================= */

const musterDepot = document.getElementById("depot");

if (musterDepot) {

    musterDepot.value = depot;

    /* Use the existing depot logic */
    changeDepot();

    /* Prevent changing depot after login */
    musterDepot.disabled = true;
}


    } else {

        error.textContent =
            "Invalid User ID or password.";

        document.getElementById("loginPassword").value = "";

        document.getElementById("loginPassword").focus();

    }

}

function logoutMuster() {

    /* Hide muster */
    const musterApp = document.getElementById("musterApp");

    if (musterApp) {
        musterApp.style.display = "none";
    }

    /* Hide header menu */
    const headerMenuContainer =
        document.getElementById("headerMenuContainer");

    if (headerMenuContainer) {
        headerMenuContainer.style.display = "none";
    }

    /* Show login screen */
    const loginScreen =
        document.getElementById("loginScreen");

    if (loginScreen) {
        loginScreen.style.display = "flex";
    }

    /* Clear password */
    const password =
        document.getElementById("loginPassword");

    if (password) {
        password.value = "";
    }

    /* Clear login error */
    const error =
        document.getElementById("loginError");

    if (error) {
        error.textContent = "";
    }

    /* Clear logged-in depot */
    window.loggedInDepot = null;

    /* Enable depot selector for next login */
    const depotSelect =
        document.getElementById("depot");

    if (depotSelect) {
        depotSelect.disabled = false;
    }
}