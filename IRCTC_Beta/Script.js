javascript:(async function() {

const username = "PPK01";
const password = "nexonXgrazia@24";
const trainNumber = "58501";
const JDate = "19-11-2026";
const from = "MIPM";
const to = "SCM";
const quota = "GENERAL";
const className = "Second Sitting (2S)";
const mobile = "7987094362";

function sleep(ms) { 
    return new Promise(resolve => setTimeout(resolve, ms)); 
}

function setAngularValue(element, value) {
  if (!element) return;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  setter.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

async function ensureLoggedIn(username, password) {
    const verified = document.querySelector("button.nav-link-1 .verified-icon");
    const profile = document.querySelector("button.nav-link-1 .profile-name");
    if (verified && profile) {
        return true;
    }
    const loginButton = document.querySelector(".btn-login.ng-star-inserted");
    if (loginButton) {
        loginButton.click();
    }

    let usernameField;
    let passwordField;
    while (!usernameField || !passwordField) {
        usernameField = document.querySelector("input#username[formcontrolname='userid']");
        passwordField = document.querySelector("input#password[formcontrolname='password']");
        if (!usernameField || !passwordField) {
            await sleep(100);
        }
    }
    setAngularValue(usernameField, username);
    setAngularValue(passwordField, password);

    let activeLogin;
    while (!activeLogin) {
        activeLogin = document.querySelector(".btn-action.btn-login.active");
        if (!activeLogin) {
            await sleep(100);
        }
    }
    activeLogin.click();
    let loginVerified = false;
    while (!loginVerified) {
        const verified = document.querySelector("button.nav-link-1 .verified-icon");
        const profile = document.querySelector("button.nav-link-1 .profile-name");
        const loginError = document.querySelector(".loginError");

        if (verified && profile) {
            loginVerified = true;
            return true;

        } else if (loginError) {
            const eyeButton = document.querySelector("button.eye-btn[aria-label='Toggle password visibility']");
            if (eyeButton) {
                eyeButton.click();
            }
            loginError.style.animation = "loginErrorBlink 0.5s ease-in-out 6";
            if (!document.getElementById("loginErrorBlinkStyle")) {
                const style = document.createElement("style");
                style.id = "loginErrorBlinkStyle";
                style.textContent = `
                    @keyframes loginErrorBlink {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            return false;

        } else {
            await sleep(100);
        }
    }
}

async function selectStation(code) {
  let option;
  while (!option) {
    option = [...document.querySelectorAll('div[role="option"]')]
      .find(el => {
        const codeEl = el.querySelector(".option-code");
        return codeEl && codeEl.textContent.trim() === code;
      });
    if (!option) await sleep(100);
  }
  option.click();
}

async function selectSource(val) {
    const source = [...document.querySelectorAll("span.select-placeholder")]
        .find(el => el.textContent.trim() === "Select Source");
        source?.click();
    
    let input;
    while (!input) {
        input = document.querySelector('input[formcontrolname="origin"]');
        if (!input) await sleep(100);
    }
    setAngularValue(input, val);
    await selectStation(val);
}

async function selectDestination(val) {
    const destination = [...document.querySelectorAll("span.select-placeholder")]
        .find(el => el.textContent.trim() === "Select Destination");
        destination?.click();
    let input;
    while (!input) {
        input = document.querySelector('input[formcontrolname="destination"]');
        if (!input) await sleep(100);
    }
    setAngularValue(input, val);
    await selectStation(val);
}

async function selectTravelDate(targetDate) {
    const [day, month, year] = targetDate.split("-");
    const targetMonth = new Date( year, Number(month) - 1 ).toLocaleString("en-US", { month: "long" });

    let dateField;
    while (!dateField) {
        dateField = document.querySelector( "div[role='button'][aria-label='Select travel date']");
        if (!dateField) {
            await sleep(100);
        }
    }
    dateField.click();
    while (true) {
        const title = document.querySelector( ".ui-datepicker-title");
        const currentMonth = title?.querySelector(".ui-datepicker-month")?.textContent.trim();
        const currentYear = title?.querySelector(".ui-datepicker-year")?.textContent.trim();
        if ( currentMonth === targetMonth && currentYear === year) {
            break;
        }

        const nextButton =
            document.querySelector(".ui-datepicker-next-icon");
        if (!nextButton) {
            await sleep(100);
            continue;
        }
        nextButton.click();
        await sleep(100);
    }

    let dayElement;
    while (!dayElement) {
        dayElement = [...document.querySelectorAll("td a.ui-state-default")]
            .find(el => el.textContent.trim() === day);
        if (!dayElement) {
            await sleep(100);
        }
    }
    dayElement.click();
}

async function selectQuota(quota) {
    let quotaLabel;
    while (!quotaLabel) {
        quotaLabel = [...document.querySelectorAll("span.field-label")]
            .find(el => el.textContent.trim() === "Quota");
        if (!quotaLabel) {
            await sleep(100);
        }
    }
    quotaLabel.click();
    let quotaOption;
    while (!quotaOption) {
        quotaOption = [...document.querySelectorAll("span.option-name")]
            .find(el => el.textContent.trim() === quota);
        if (!quotaOption) {
            await sleep(100);
        }
    }
    quotaOption.click();
}

async function clickSearchTrains() {
    let searchButton;
    while (!searchButton) {
        searchButton = [...document.querySelectorAll("span.search-btn-label")]
            .find(el => el.textContent.trim() === "Search Trains");
        if (!searchButton) {
            await sleep(100);
        }
    }
    searchButton.click();
}

async function checkAndBook(trainNumber, className) {
    let train;
    while (!train) {
        train = [...document.querySelectorAll(".train-number")]
            .find(el =>
                el.textContent.trim() === trainNumber
            );
        if (!train) {
            await sleep(100);
        }
    }
    const trainCard = train.closest(".train-card");
    let availabilityButton;
    while (!availabilityButton) {
        availabilityButton =
            trainCard.querySelector(
                "button.btn-availability"
            );
        if (!availabilityButton) {
            await sleep(100);
        }
    }
    availabilityButton.click();
    let classCard;
    while (!classCard) {
        classCard = [...trainCard.querySelectorAll(".class-card")]
            .find(card => {
                const code =
                    card.querySelector(".class-code");
                return code &&
                       code.textContent.trim() === className;
            });
        if (!classCard) {
            await sleep(100);
        }
    }
    let bookButton;
    while (!bookButton) {
        bookButton =
            classCard.querySelector("button.btn-book");
        if (!bookButton) {
            await sleep(100);
        }
    }
    bookButton.click();
}

async function completeBookingDetails(mobile) {
    let existingButton;
    while (!existingButton) {
        existingButton = [...document.querySelectorAll(
            "button.btn-existing"
        )]
        .find(button =>
            button.textContent.trim() === "Existing Passenger"
        );
        if (!existingButton) {
            await sleep(100);
        }
    }
    existingButton.click();
    let checkboxes;
    while (!checkboxes || checkboxes.length === 0) {
        checkboxes = [
            ...document.querySelectorAll(
                ".ep-body .ep-passenger-row div[role='checkbox']"
            )
        ];
        if (checkboxes.length === 0) {
            await sleep(100);
        }
    }
    checkboxes.forEach(checkbox => {
        checkbox.click();
    });
    let addButton;
    while (!addButton) {
        addButton = [...document.querySelectorAll(
            "button.btn.ep-add-btn"
        )]
        .find(button =>
            button.textContent.trim() === "Add"
        );
        if (!addButton) {
            await sleep(100);
        }
    }
    addButton.click();
    let mobileInput;
    while (!mobileInput) {
        mobileInput = document.querySelector(
            "input[placeholder='Enter mobile number']"
        );
        if (!mobileInput) {
            await sleep(100);
        }
    }
    setAngularValue(mobileInput, mobile);
    let otherPreferences;
    while (!otherPreferences) {
        otherPreferences = [...document.querySelectorAll(
            ".section-header"
        )]
        .find(header =>
            header.querySelector(".section-title")?.textContent
                .trim() === "Other Preferences"
        );
        if (!otherPreferences) {
            await sleep(100);
        }
    }
    if (otherPreferences.getAttribute("aria-expanded") !== "true") {
        otherPreferences.click();
    }
    let autoUpgrade;
    while (!autoUpgrade) {
        autoUpgrade = document.querySelector(
            "p-checkbox[formcontrolname='autoUpgradationSelected']"
        );
        if (!autoUpgrade) {
            await sleep(100);
        }
    }
    const autoBox = autoUpgrade.querySelector(
        ".ui-chkbox-box"
    );
    if (autoBox) {
        autoBox.click();
    }
    let bookOnly;
    while (!bookOnly) {
        bookOnly = document.querySelector(
            "p-checkbox[formcontrolname='bookOnlyIfCnf']"
        );
        if (!bookOnly) {
            await sleep(100);
        }
    }
    const bookBox = bookOnly.querySelector(
        ".ui-chkbox-box"
    );
    if (bookBox) {
        bookBox.click();
    }
    let option;
    while (!option) {
        option = [...document.querySelectorAll(
            ".payment-option"
        )]
        .find(el =>
            el.querySelector(".payment-label")?.textContent
                .trim()
                .startsWith("Pay through BHIM/UPI")
        );
        if (!option) {
            await sleep(100);
        }
    }
    const radio = option.querySelector(
        "p-radiobutton[formcontrolname='paymentType']"
    );
    if (radio) {
        const box = radio.querySelector(
            ".ui-radiobutton-box"
        );
        if (box) {
            box.click();
        }
    }
    let fareButton;
    while (!fareButton) {
        fareButton = [...document.querySelectorAll(
            "button.btn.btn-calc-fare"
        )]
        .find(button =>
            button.textContent.trim() === "Calculate Fare"
        );
        if (!fareButton) {
            await sleep(100);
        }
    }
    fareButton.click();
}

async function continueToPayment() {
    let paymentButton;
    while (!paymentButton) {
        paymentButton = [...document.querySelectorAll(
            "button.btn.btn-payment"
        )]
        .find(button =>
            button.textContent.trim() === "Continue To Payment"
        );
        if (!paymentButton) {
            await sleep(100);
        }
    }
    paymentButton.click();
}

async function clickToPay() {
    let payButton;
    while (!payButton) {
        payButton = [...document.querySelectorAll(
            "button.ipay-qr-button"
        )]
        .find(button =>
            button.textContent.trim() === "Click to pay"
        );
        if (!payButton) {
            await sleep(100);
        }
    }
    payButton.click();
}

async function execute() {
    const loginSuccess = await ensureLoggedIn(username, password);
    if (!loginSuccess) { 
        return;
    }
    await selectSource(from);
    await selectDestination(to);
    await selectTravelDate(JDate);
    await selectQuota(quota);
    await clickSearchTrains();
    await checkAndBook(trainNumber,className);
    await completeBookingDetails(mobile);
    await continueToPayment();
    await clickToPay();
}
await execute();

})();
