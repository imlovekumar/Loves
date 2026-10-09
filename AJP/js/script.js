// COPY_TAIL = everything the bookmarklet contains AFTER the settings (the const ... lines the page generates).
//
// HOW TO EDIT: paste your whole script between the two marker lines below, exactly as it is - no quotes, no escaping, no \n.
// Keep the first line  const COPY_TAIL = (function () {/*  and the last line  */}).toString()...  as they are.
// The only thing the pasted text must not contain is the two characters  */  (they would end the block).
const COPY_TAIL = (function () {/*

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
    if (profile || verified) {
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
        activeLogin = [...document.querySelectorAll('.login-form .actions-row button[type="submit"]')]
                            .find(b => b.innerText.trim() === 'LOGIN');
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

        if (profile || verified) {
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

async function passConfirmation() {
    let okButton;
    while (!okButton) {
        okButton = [...document.querySelectorAll("button.ui-confirmdialog-acceptbutton")]
            .find(button =>button.textContent.trim() === "OK");
        if (!okButton) {
            await sleep(100);
        }
    }
    okButton.click();
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
    if (quota === "DUTY PASS") {
        await passConfirmation();
    }
}

async function selectConcession() {
    let concessionLabel;
    while (!concessionLabel) {
        concessionLabel = [...document.querySelectorAll("span.field-label")]
            .find(el => el.textContent.trim() === "Concession");
        if (!concessionLabel) {
            await sleep(100);
        }
    }
    concessionLabel.click();
    let concessionOption;
    while (!concessionOption) {
        concessionOption = [...document.querySelectorAll("span.option-name")]
            .find(el => el.textContent.trim() === "Railway Pass Concession");
        if (!concessionOption) {
            await sleep(100);
        }
    }
    concessionOption.click();
    await passConfirmation();
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

async function get_current_time_api(zone = "india") {
    if (zone === "india") {
        return new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }).format(new Date());
    }
}

async function sleep_for_availability_check(quota, className) {

    if (quota === "TATKAL" && ( className === "Sleeper (SL)" || className === "Second Sitting (2S)" )) {
        const targetTime = "10:59:57";
        const currentTime = await get_current_time_api("india");
        const [currentHours, currentMinutes, currentSeconds] = currentTime.split(":").map(Number);
        const [targetHours, targetMinutes, targetSeconds] = targetTime.split(":").map(Number);
        const currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
        const targetTotalSeconds = targetHours * 3600 + targetMinutes * 60 + targetSeconds;

        if (currentTotalSeconds < targetTotalSeconds) {
            const balanceTime = targetTotalSeconds - currentTotalSeconds;

            showAvailabilityTimer(targetTime);

            for (let i = balanceTime; i >= 1; i--) {
                updateAvailabilityTimer(i);
                await sleep(1000);
            }
            hideAvailabilityTimer();

            return "Proceeding to Check Availability";
        } else {
            return "No Sleep Required";
        }
    } 
    else if ( quota === "TATKAL" && ( 
        
        className === "AC 3 Tier (3A)" || 
        className === "AC 2 Tier (2A)" || 
        className === "AC First Class (1A)" || 
        className === "AC 3 Economy (3E)" || 
        className === "AC Chair car (CC)" || 
        className === "Exec. Chair Car (EC)" || 
        className === "Vistadome AC (EV)" )) {
        
        const targetTime = "09:59:57";
        const currentTime = await get_current_time_api("india");
        const [currentHours, currentMinutes, currentSeconds] = currentTime.split(":").map(Number);
        const [targetHours, targetMinutes, targetSeconds] = targetTime.split(":").map(Number);
        const currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
        const targetTotalSeconds = targetHours * 3600 + targetMinutes * 60 + targetSeconds;

        if (currentTotalSeconds < targetTotalSeconds) {
            const balanceTime = targetTotalSeconds - currentTotalSeconds;

            showAvailabilityTimer(targetTime);

            for (let i = balanceTime; i >= 1; i--) {
                updateAvailabilityTimer(i);
                await sleep(1000);
            }
            hideAvailabilityTimer();

            return "Proceeding to Check Availability";
        } else {
            return "No Sleep Required";
        }
    }
    else if (quota === "GENERAL") {
        const currentTime = await get_current_time_api("india");
        const [hours, minutes, seconds] = currentTime.split(":").map(Number);
        const currentTotalSeconds = hours * 3600 + minutes * 60 + seconds;
        const startTime = 7 * 3600 + 58 * 60;
        const targetTime = "08:00:00";
        const targetTotalSeconds = 8 * 3600;
        if ( currentTotalSeconds >= startTime && currentTotalSeconds < targetTotalSeconds ) {
            const balanceTime = targetTotalSeconds - currentTotalSeconds;
            showAvailabilityTimer(targetTime);
            for (let i = balanceTime; i >= 1; i--) {
                updateAvailabilityTimer(i);
                await sleep(1000);
            }
            hideAvailabilityTimer();
            return "Proceeding to Check Availability";
        } else {
            return "No Sleep Required";
        }
    } else  {
        return "No Sleep Required";
    }
}


function showAvailabilityTimer(targetTime) {
    document.getElementById("availabilityTimerOverlay")?.remove();
    const overlay = document.createElement("div");
    overlay.id = "availabilityTimerOverlay";
    overlay.innerHTML = `
        <div class="availability-timer-box">
            <div class="availability-title">
                Waiting for Availability
            </div>
            <div class="availability-target">
                Check Availability @ ${targetTime} IST
            </div>
            <div class="availability-countdown-row">
                <div id="availabilityCountdown">00</div>
                <div class="availability-seconds">Seconds</div>
            </div>
            <div class="availability-subtitle">
                Please wait...
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    const style = document.createElement("style");
    style.id = "availabilityTimerStyle";
    style.textContent = `
        #availabilityTimerOverlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.65);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .availability-timer-box {
            width: 360px;
            padding: 30px;
            background: #ffffff;
            border-radius: 18px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            font-family: Arial, sans-serif;
        }
        .availability-title {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        .availability-target {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
        }
        #availabilityCountdown {
            font-size: 64px;
            font-weight: 700;
            line-height: 1;
            margin: 10px 0;
        }
        .availability-subtitle {
            font-size: 14px;
            color: #777;
            margin-top: 15px;
        }
        .availability-countdown-row {
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 8px;
        }

        #availabilityCountdown {
            font-size: 64px;
            font-weight: 700;
            line-height: 1;
        }

        .availability-seconds {
            font-size: 18px;
            font-weight: 600;
            color: #666;
        }
    `;
    document.head.appendChild(style);
}

function updateAvailabilityTimer(seconds) {
    const countdown = document.getElementById("availabilityCountdown");
    if (countdown) {
        countdown.textContent = seconds;
    }
}

function hideAvailabilityTimer() {
    document.getElementById("availabilityTimerOverlay")?.remove();
    document.getElementById("availabilityTimerStyle")?.remove();
}

async function checkAndBookRetry(trainNumber, className) {
    let train;
    while (!train) {
        train = [...document.querySelectorAll(".train-number")]
            .find(el => el.textContent.trim() === trainNumber);
        if (!train) {
            await sleep(100);
        }
    }

    const trainCard = train.closest(".train-card");
    if (trainCard) {
        trainCard.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest"
        });

        trainCard.setAttribute("tabindex", "-1");
        trainCard.focus({ preventScroll: true });
    }
    
    await sleep_for_availability_check(quota, className);

    while (true) {
        let availabilityButton = trainCard.querySelector("button.btn-availability");
        while (!availabilityButton) {
            await sleep(100);
            availabilityButton = trainCard.querySelector("button.btn-availability");
        }
        availabilityButton.click();
        while (document.querySelector(".dimmer")) {
            await sleep(100);
        }

        let classCard = [...trainCard.querySelectorAll(".class-card")]
            .find(card => {
                const code = card.querySelector(".class-code");
                return code && code.textContent.trim() === className;
            });

        if (!classCard) {
            await sleep(100);
            continue;
        }

        while (true) {
            const bookButton = classCard.querySelector("button.btn-book");
            if (bookButton) {
                bookButton.click();
                return;
            }

            const toast = [...document.querySelectorAll(".ui-toast-message-content")]
                .find(el => el.querySelector(".ui-toast-close-icon"));

            if (toast) {
                const detail = toast.querySelector(".ui-toast-detail")?.textContent || "";
                if (detail.includes("Unable to Process Request")) {
                    await sleep(3000);
                }
                const closeButton = toast.querySelector(".ui-toast-close-icon");
                if (closeButton) {
                    closeButton.click();
                }
                while (document.body.contains(toast)) {
                    await sleep(100);
                }
            }

            let refreshButton;
            let refreshRetryCount = 0;
            while (!refreshButton) {
                refreshButton = classCard.querySelector('span.sync-icon[aria-label="Refresh Availability"]');
                if (!refreshButton) {
                        await sleep(100);
                }
            }
            while (true) {
                refreshButton.click();
                refreshRetryCount++;
                while (document.querySelector(".dimmer")) {
                    await sleep(100);
                }
                if (refreshRetryCount % 5 === 0) {
                    await sleep(2000);
                } else {
                    await sleep(1000);
                }
                refreshButton = classCard.querySelector('span.sync-icon[aria-label="Refresh Availability"]' );
                if (!refreshButton) {
                    break;
                }
                await sleep(100);
            }
        }
    }
}

function selectOption(selector,text) {
        const dropdown=document.querySelector(selector);
        if(!dropdown) throw new Error(selector+" NOT FOUND");
        dropdown.querySelector(".ui-dropdown").click();
        const option=[...document.querySelectorAll(".ui-dropdown-panel li")]
            .find(element=>element.textContent.trim()===text);
        if(!option) throw new Error(text+" option NOT FOUND");
        option.click();
}

async function autofill(passengers) {

    for(let i=0;i<passengers.length;i++){
        const passenger=passengers[i];
        let newPassenger;
        while (!newPassenger) {
            newPassenger = document.querySelector("button.btn-new-passenger");
            if(!newPassenger) {
                await sleep(100);
            }
        }
        newPassenger.click();
        const name= document.querySelector('p-autocomplete[formcontrolname="passengerName"] input');
        const age= document.querySelector('input[formcontrolname="passengerAge"]');
        if(!name)   throw new Error("Name NOT FOUND for Passenger "+(i+1));
        if(!age)    throw new Error("Age NOT FOUND for Passenger "+(i+1));
        setAngularValue(name,passenger.name);
        setAngularValue(age,passenger.age);
        selectOption('p-dropdown[formcontrolname="passengerGender"]',passenger.gender);
        selectOption('p-dropdown[formcontrolname="passengerBerthChoice"]',passenger.berth);
        if(passenger.age<12){
            const child=document.querySelector('p-dropdown[formcontrolname="childBerthFlag"]');
            if(!child)  throw new Error("Child Berth NOT FOUND for Passenger "+(i+1));
            selectOption('p-dropdown[formcontrolname="childBerthFlag"]',passenger.child);
        }
        if(passConcession){
            let concession;
            while(!concession){concession=document.querySelector('p-dropdown[formcontrolname="passConcessionType"]');
                if(!concession)
                    await sleep(300);
            }
            selectOption('p-dropdown[formcontrolname="passConcessionType"]',"Pass Booking");
            let passNumber;
            let passPin;
            while(!passNumber || !passPin){
                passNumber=document.querySelector('input[formcontrolname="passUPN"]');
                passPin=document.querySelector('input[formcontrolname="passBookingCode"]');
                if(!passNumber || !passPin)
                    await sleep(300);
            }
            setAngularValue(passNumber,passenger.passNumber);
            setAngularValue(passPin,passenger.passPin);
        }

        const add=[...document.querySelectorAll("button.ap-add-btn.app-modal-button.app-modal-button--primary")]
            .find(element=>element.textContent.trim()==="Add");
        if(!add)    throw new Error("Add button NOT FOUND for Passenger "+(i+1));
        add.click();
    }
    return true;
}

async function completeBookingDetails(mobile) {
    if (existingPassengers) {
    let existingButton;
    while (!existingButton) {
        existingButton = [...document.querySelectorAll("button.btn-existing")]
            .find(button => button.textContent.trim() === "Existing Passenger");
        if (!existingButton) {
            await sleep(100);
        }
    }
    existingButton.click();
    let checkboxes;
    while (!checkboxes || checkboxes.length === 0) {
        checkboxes = [...document.querySelectorAll(".ep-body .ep-passenger-row div[role='checkbox']")];
        if (checkboxes.length === 0) {
            await sleep(100);
        }
    }
    checkboxes.forEach(checkbox => {
        checkbox.click();
    });
    let addButton;
    while (!addButton) {
        addButton = [...document.querySelectorAll("button.btn.ep-add-btn")]
            .find(button => button.textContent.trim() === "Add");
        if (!addButton) {
            await sleep(100);
        }
    }
    addButton.click();
    } else {
        await autofill(passengers);
    }
    let mobileInput;
    while (!mobileInput) {
        mobileInput = document.querySelector("input[placeholder='Enter mobile number']");
        if (!mobileInput) {
            await sleep(100);
        }
    }
    setAngularValue(mobileInput, mobile);
    let otherPreferences;
    while (!otherPreferences) {
        otherPreferences = [...document.querySelectorAll(".section-header")]
            .find(header => header.querySelector(".section-title")?.textContent.trim() === "Other Preferences");
        if (!otherPreferences) {
            await sleep(100);
        }
    }
    if (otherPreferences.getAttribute("aria-expanded") !== "true") {
        otherPreferences.click();
    }
    let autoUpgrade;
    while (!autoUpgrade) {
        autoUpgrade = document.querySelector("p-checkbox[formcontrolname='autoUpgradationSelected']");
        if (!autoUpgrade) {
            await sleep(100);
        }
    }
    const autoBox = autoUpgrade.querySelector(".ui-chkbox-box");
    if (autoBox) {
        autoBox.click();
    }
    let bookOnly;
    while (!bookOnly) {
        bookOnly = document.querySelector("p-checkbox[formcontrolname='bookOnlyIfCnf']");
        if (!bookOnly) {
            await sleep(100);
        }
    }
    const bookBox = bookOnly.querySelector(".ui-chkbox-box");
    if (bookBox) {
        bookBox.click();
    }
    if (passConcession) {
        const insurance = document.querySelector('p-checkbox[formcontrolname="travelInsuranceOpted"] .ui-chkbox-box');
        if (insurance && insurance.getAttribute("aria-checked") === "true") {
            insurance.click();
            await wait(300);
        }
    }
    if (paymentType.toLowerCase() !== "qr") {
        return;
    }
    let option;
    while (!option) {
        option = [...document.querySelectorAll(".payment-option")]
            .find(el => el.querySelector(".payment-label")?.textContent.trim()
                .startsWith("Pay through BHIM/UPI"));
        if (!option) {
            await sleep(100);
        }
    }
    const radio = option.querySelector("p-radiobutton[formcontrolname='paymentType']");
    if (radio) {
        const box = radio.querySelector(".ui-radiobutton-box");
        if (box) {
            box.click();
        }
    }
}

async function calculateFareUntilPayment() {
    let retryCount = 0;
    while (true) {
        let fareButton;
        while (!fareButton) {
            fareButton = [...document.querySelectorAll("button.btn.btn-calc-fare")]
                .find(button => button.textContent.trim() === "Calculate Fare");

            if (!fareButton) {
                await sleep(100);
            }
        }
        fareButton.click();

        while (document.querySelector(".dimmer")) {
            await sleep(100);
        }

        while (true) {
            const paymentButton = [...document.querySelectorAll("button.btn.btn-payment")]
                .find(button => button.textContent.trim() === "Continue To Payment");

            if (paymentButton) {
                paymentButton.click();
                return;
            }

            const toast = [...document.querySelectorAll(".ui-toast-message-content")]
                .find(el => el.querySelector(".ui-toast-close-icon"));

            if (toast) {
                const detail = toast.querySelector(".ui-toast-detail")?.textContent || "";

                if (detail.includes("Unable to Process Request")) {
                    retryCount++;
                    if (retryCount > 10) {
                        return;
                    }
                    await sleep(3000);
                }

                const closeButton = toast.querySelector(".ui-toast-close-icon");
                if (closeButton) {
                    closeButton.click();
                }
                while (document.body.contains(toast)) {
                    await sleep(100);
                }
                break;
            }
            await sleep(100);
        }
        await sleep(200);
    }
}

async function clickToPayQR() {
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

async function payviawallet() {
    let card;
    while (!card) {
        card = [...document.querySelectorAll(".payment-card")]
            .find(el => el.querySelector(".card-title")?.textContent.trim() === "IRCTC E-Wallet");
        if (!card) {
            await sleep(100);
        }
    }

    card.click();
    let payButton;
    while (!payButton) {
        payButton = [...document.querySelectorAll("button.btn.btn-payment")]
            .find(el => el.textContent.trim() === "Pay & Book");
        if (!payButton) {
            await sleep(100);
        }
    }
    payButton.click();
    let confirmButton;
    while (!confirmButton) {
        confirmButton = [...document.querySelectorAll(".ewallet-confirm-actions button")]
            .find(el => el.textContent.trim().toUpperCase() === "CONFIRM");
        if (!confirmButton) {
            await sleep(100);
        }
    }
    confirmButton.click();
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
    if (passConcession || quota === "DUTY PASS") {
        await selectConcession();
    }
    await clickSearchTrains();
    await checkAndBookRetry(trainNumber,className);
    await completeBookingDetails(mobile);
    await calculateFareUntilPayment();
    if (paymentType.toLowerCase() === "qr") {
        await clickToPayQR();
    } else {
        await payviawallet();
    }
}

await execute();

})();
*/}).toString().replace(/\r\n?/g, "\n").replace(/^[\s\S]*?\/\*\n?/, "").replace(/\n?\*\/\s*\}\s*$/, "");
