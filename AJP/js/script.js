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
    const targetMonth = new Date(year, Number(month) - 1).toLocaleString("en-US", { month: "long" });

    let dateField;
    while (!dateField) {
        dateField = document.querySelector("div[role='button'][aria-label='Select travel date']");
        if (!dateField) {
            await sleep(100);
        }
    }
    dateField.click();
    while (true) {
        const title = document.querySelector(".ui-datepicker-title");
        const currentMonth = title?.querySelector(".ui-datepicker-month")?.textContent.trim();
        const currentYear = title?.querySelector(".ui-datepicker-year")?.textContent.trim();
        if (currentMonth === targetMonth && currentYear === year) {
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
            .find(button => button.textContent.trim() === "OK");
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

    if (quota === "TATKAL" && (className === "Sleeper (SL)" || className === "Second Sitting (2S)")) {
        const targetTime = "10:59:55";
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
    else if (quota === "TATKAL" && (

        className === "AC 3 Tier (3A)" ||
        className === "AC 2 Tier (2A)" ||
        className === "AC First Class (1A)" ||
        className === "AC 3 Economy (3E)" ||
        className === "AC Chair car (CC)" ||
        className === "Exec. Chair Car (EC)" ||
        className === "Vistadome AC (EV)")) {

        const targetTime = "09:59:55";
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
        const targetTime = "07:59:55";
        const targetTotalSeconds = 8 * 3600;
        if (currentTotalSeconds >= startTime && currentTotalSeconds < targetTotalSeconds) {
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
    } else {
        return "No Sleep Required";
    }
}

function showAvailabilityTimer(targetTime) {
    document.getElementById("availabilityTimerOverlay")?.remove();
    document.getElementById("availabilityTimerStyle")?.remove();
    const now = new Date();
    const target = new Date();
    const [hours, minutes, seconds = 0] = targetTime.split(":").map(Number);
    target.setHours(hours, minutes, seconds, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const totalTime = target.getTime() - now.getTime();
    const overlay = document.createElement("div");
    overlay.id = "availabilityTimerOverlay";
    overlay.innerHTML = `
        <div class="availability-timer-box">
            <div class="availability-live">
                <span class="availability-live-dot"></span>
                WAITING FOR AVAILABILITY
            </div>
            <div class="availability-target">
                Check Availability @
                <strong>${targetTime} IST</strong>
            </div>
            <div class="availability-clock">
                <svg viewBox="0 0 220 220">
                    <circle class="availability-ring-bg"
                        cx="110" cy="110" r="96"/>
                    <circle class="availability-ring-progress"
                        id="availabilityRing"
                        cx="110" cy="110" r="96"/>
                </svg>
                <div class="availability-clock-content">
                    <div id="availabilityCountdown">00:00:00.0</div>
                    <div class="availability-clock-label">
                        HOURS : MINUTES : SECONDS
                    </div>
                </div>
            </div>
            <div class="availability-status">
                <span class="availability-status-icon">◷</span>
                <span id="availabilityStatus">
                    Waiting for scheduled check...
                </span>
            </div>
            <div class="availability-footer">
                PLEASE WAIT WHILE WE PREPARE
            </div>
        </div>
    `;
    const style = document.createElement("style");
    style.id = "availabilityTimerStyle";
    style.textContent = `
        #availabilityTimerOverlay {
            position: fixed;
            inset: 0;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            background: rgba(7, 18, 36, 0.30);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            font-family: Arial, sans-serif;
        }
        .availability-timer-box {
            box-sizing: border-box;
            width: 100%;
            max-width: 390px;
            padding: 30px 22px 24px;
            color: #f4f7ff;
            text-align: center;
            border: 1px solid rgba(255,255,255,.20);
            border-radius: 24px;
            background: rgba(14, 29, 49, .82);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            box-shadow: 0 25px 80px rgba(0,0,0,.32);
            animation: availabilityAppear .35s ease-out;
        }
        @keyframes availabilityAppear {
            from {
                opacity: 0;
                transform: translateY(12px) scale(.97);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        .availability-live {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 9px;
            color: #c0d0e8;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
        }
        .availability-live-dot {
            width: 8px;
            height: 8px;
            flex-shrink: 0;
            border-radius: 50%;
            background: #37e6a0;
            box-shadow: 0 0 12px #37e6a0;
            animation: availabilityPulse 1.5s infinite;
        }
        @keyframes availabilityPulse {
            50% { opacity: .35; }
        }
        .availability-target {
            margin-top: 15px;
            color: #b1c1d9;
            font-size: 13px;
        }
        .availability-target strong {
            display: block;
            margin-top: 5px;
            color: #fff;
            font-size: 18px;
            letter-spacing: .6px;
        }
        .availability-clock {
            position: relative;
            width: min(240px, 75vw);
            aspect-ratio: 1;
            margin: 22px auto 18px;
        }
        .availability-clock svg {
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);
            overflow: visible;
        }
        .availability-ring-bg,
        .availability-ring-progress {
            fill: none;
            stroke-width: 7;
        }
        .availability-ring-bg {
            stroke: rgba(120, 153, 194, .25);
        }
        .availability-ring-progress {
            stroke: #45e5ae;
            stroke-linecap: round;
            filter: drop-shadow(0 0 6px rgba(69,229,174,.4));
            transition: stroke-dashoffset .1s linear;
        }
        .availability-clock-content {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        #availabilityCountdown {
            font-family: "Courier New", monospace;
            font-size: clamp(27px, 7.5vw, 36px);
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            letter-spacing: -1.5px;
            color: #fff;
            text-shadow: 0 0 22px rgba(69,229,174,.15);
            white-space: nowrap;
        }
        .availability-clock-label {
            margin-top: 10px;
            color: #9aafce;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 1.3px;
        }
        .availability-status {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px;
            border: 1px solid rgba(255,255,255,.12);
            border-radius: 12px;
            background: rgba(255,255,255,.06);
            color: #d5e2f5;
            font-size: 13px;
        }
        .availability-status-icon {
            color: #45e5ae;
            font-size: 18px;
        }
        .availability-footer {
            margin-top: 20px;
            color: #91a4c2;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 1.6px;
        }
        @media (max-width: 400px) {
            .availability-timer-box {
                padding: 25px 14px 20px;
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    const countdown = document.getElementById("availabilityCountdown");
    const ring = document.getElementById("availabilityRing");
    const status = document.getElementById("availabilityStatus");
    const circumference = 2 * Math.PI * 96;
    ring.style.strokeDasharray = circumference;
    let animationFrame;
    function updateCountdown() {
        if (!overlay.isConnected) {
            cancelAnimationFrame(animationFrame);
            return;
        }
        const remaining = Math.max(0, target.getTime() - Date.now());
        const totalSeconds = remaining / 1000;
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = Math.floor(totalSeconds % 60);
        const tenth = Math.floor((remaining % 1000) / 100);
        countdown.textContent =
            `${String(h).padStart(2, "0")}:` +
            `${String(m).padStart(2, "0")}:` +
            `${String(s).padStart(2, "0")}.` +
            `${tenth}`;
        const progress = Math.min(1, remaining / totalTime);
        ring.style.strokeDashoffset =
            circumference * (1 - progress);
        if (remaining === 0) {
            status.textContent = "Target time reached — checking availability";
            return;
        }
        status.textContent = remaining <= 10000
            ? "Almost time — get ready!"
            : "Waiting for scheduled check...";
        animationFrame = requestAnimationFrame(updateCountdown);
    }
    updateCountdown();
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

function startToastAutoCloser() {
    if (window.toastAutoCloser) {
        window.toastAutoCloser.disconnect();
        delete window.toastAutoCloser;
        return;
    }

    function closeToasts() {
        document.querySelectorAll(
            '.ui-toast-message-content a.ui-toast-close-icon'
        ).forEach(button => button.click());
    }

    window.toastAutoCloser = new MutationObserver(closeToasts);

    window.toastAutoCloser.observe(document.body, {
        childList: true,
        subtree: true
    });

    closeToasts();
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
            let refreshButton;
            while (!refreshButton) {
                refreshButton = classCard.querySelector('span.sync-icon[aria-label="Refresh Availability"]');
                if (!refreshButton) {
                    await sleep(100);
                }
            }
            refreshButton.click();
            while (document.querySelector(".dimmer")) {
                await sleep(100);
            }
        }
    }
}

function toggleTimerBar(options = {}) {
    const {
        runningLabel = 'TIME ELAPSED',
        stoppedLabel = 'TIME TAKEN',
        holdMs = 3000,
        limitMs = 45000,
    } = options;

    const ID = 'timer-bar-host';
    const existing = document.getElementById(ID);

    if (existing) {
        return existing.stopTimer ? existing.stopTimer() : null;
    }

    const host = document.createElement('div');
    host.id = ID;
    host.style.cssText =
        'all:initial;position:fixed;top:0;left:0;right:0;z-index:2147483647;pointer-events:none';
    const root = host.attachShadow({ mode: 'open' });

    root.innerHTML = `
        <style>
        *{box-sizing:border-box;margin:0;padding:0}
        .w{margin:24px 16px 0;animation:i .4s ease both}
        .w.x{animation:o .4s ease forwards}
        .b{height:60px;padding:0 22px;display:flex;align-items:center;
            justify-content:space-between;
            background:linear-gradient(100deg,rgba(8,12,22,.45),rgba(17,25,45,.45));
            -webkit-backdrop-filter:blur(14px) saturate(1.3);
            backdrop-filter:blur(14px) saturate(1.3);
            border:1px solid rgba(94,140,200,.35);border-left:3px solid rgb(94,214,255);
            border-radius:6px;color:rgb(214,228,247);
            font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
            box-shadow:0 8px 24px rgba(0,0,0,.25)}
        .h .b{border-left-color:rgb(74,222,128)}
        .l{display:flex;align-items:center;gap:12px}
        .d{flex:none;width:10px;height:10px;border-radius:50%;
            background:rgb(239,68,68);animation:k 1s ease-in-out infinite}
        .h .d{animation:none;background:rgb(74,222,128)}
        .t{font-size:13px;font-weight:700;letter-spacing:.22em;color:rgb(94,214,255)}
        .h .t{color:rgb(74,222,128)}
        .m{font-size:28px;font-weight:700;letter-spacing:.06em;color:rgb(240,246,255);
            font-variant-numeric:tabular-nums}
        .c{font-size:15px;color:rgb(94,214,255)}
        .h .c{color:rgb(74,222,128)}
        .g{height:3px;margin-top:3px;border-radius:2px;overflow:hidden;
            background:rgba(255,255,255,.12)}
        .f{height:100%;transform-origin:left;transform:scaleX(0);
            background:linear-gradient(90deg,rgba(34,197,94,.55),rgb(134,239,172))}
        .f.r{background:linear-gradient(90deg,rgba(220,38,38,.55),rgb(248,113,113));
            animation:e .6s ease-in-out infinite}
        .h .f.r{animation:none}
        @keyframes i{from{opacity:0;transform:translateY(-24px)}}
        @keyframes o{to{opacity:0;transform:translateY(-24px)}}
        @keyframes k{50%{opacity:.25}}
        @keyframes e{50%{opacity:.25}}
        </style>
        <div class="w">
        <div class="b">
            <div class="l"><span class="d"></span><span class="t"></span></div>
            <div class="m"><span class="a">00:00:00</span><span class="c">.00</span></div>
        </div>
        <div class="g"><div class="f"></div></div>
        </div>`;

    document.documentElement.appendChild(host);

    const wrap = root.querySelector('.w');
    const label = root.querySelector('.t');
    const main = root.querySelector('.a');
    const ms = root.querySelector('.c');
    const fill = root.querySelector('.f');
    const pad = (n) => String(n).padStart(2, '0');

    label.textContent = runningLabel;

    const start = performance.now();
    let frame = 0;
    let stopped = false;
    let over = false;
    let elapsed = 0;

    function tick() {
        elapsed = performance.now() - start;
        const total = Math.floor(elapsed / 1000);
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        main.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
        ms.textContent = '.' + pad(Math.floor((elapsed % 1000) / 10));
        fill.style.transform = `scaleX(${Math.min(elapsed / limitMs, 1)})`;
        if (!over && elapsed >= limitMs) {
        over = true;
        fill.classList.add('r');
        }
        frame = requestAnimationFrame(tick);
    }

    host.stopTimer = function () {
        if (stopped) return elapsed;
        stopped = true;
        cancelAnimationFrame(frame);
        label.textContent = stoppedLabel;
        wrap.classList.add('h');
        setTimeout(() => {
        wrap.classList.add('x');
        setTimeout(() => host.remove(), 400);
        }, holdMs);
        return elapsed;
    };

    tick();
    return null;
}

function selectOption(selector, text) {
    const dropdown = document.querySelector(selector);
    if (!dropdown) throw new Error(selector + " NOT FOUND");
    dropdown.querySelector(".ui-dropdown").click();
    const option = [...document.querySelectorAll(".ui-dropdown-panel li")]
        .find(element => element.textContent.trim() === text);
    if (!option) throw new Error(text + " option NOT FOUND");
    option.click();
}

async function autofill(passengers) {

    for (let i = 0; i < passengers.length; i++) {
        const passenger = passengers[i];
        let newPassenger;
        while (!newPassenger) {
            newPassenger = document.querySelector("button.btn-new-passenger");
            if (!newPassenger) {
                await sleep(100);
            }
        }
        newPassenger.click();
        const name = document.querySelector('p-autocomplete[formcontrolname="passengerName"] input');
        const age = document.querySelector('input[formcontrolname="passengerAge"]');
        if (!name) throw new Error("Name NOT FOUND for Passenger " + (i + 1));
        if (!age) throw new Error("Age NOT FOUND for Passenger " + (i + 1));
        setAngularValue(name, passenger.name);
        setAngularValue(age, passenger.age);
        selectOption('p-dropdown[formcontrolname="passengerGender"]', passenger.gender);
        selectOption('p-dropdown[formcontrolname="passengerBerthChoice"]', passenger.berth);
        if (passenger.age < 12) {
            const child = document.querySelector('p-dropdown[formcontrolname="childBerthFlag"]');
            if (!child) throw new Error("Child Berth NOT FOUND for Passenger " + (i + 1));
            selectOption('p-dropdown[formcontrolname="childBerthFlag"]', passenger.child);
        }
        if (passConcession) {
            let concession;
            while (!concession) {
                concession = document.querySelector('p-dropdown[formcontrolname="passConcessionType"]');
                if (!concession)
                    await sleep(300);
            }
            selectOption('p-dropdown[formcontrolname="passConcessionType"]', "Pass Booking");
            let passNumber;
            let passPin;
            while (!passNumber || !passPin) {
                passNumber = document.querySelector('input[formcontrolname="passUPN"]');
                passPin = document.querySelector('input[formcontrolname="passBookingCode"]');
                if (!passNumber || !passPin)
                    await sleep(300);
            }
            setAngularValue(passNumber, passenger.passNumber);
            setAngularValue(passPin, passenger.passPin);
        }

        const add = [...document.querySelectorAll("button.ap-add-btn.app-modal-button.app-modal-button--primary")]
            .find(element => element.textContent.trim() === "Add");
        if (!add) throw new Error("Add button NOT FOUND for Passenger " + (i + 1));
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
    startToastAutoCloser();
    await checkAndBookRetry(trainNumber, className);
    toggleTimerBar();
    await completeBookingDetails(mobile);
    await calculateFareUntilPayment();
    toggleTimerBar();
    if (paymentType.toLowerCase() === "qr") {
        await clickToPayQR();
    } else {
        await payviawallet();
    }
}

await execute();

})();
*/}).toString().replace(/\r\n?/g, "\n").replace(/^[\s\S]*?\/\*\n?/, "").replace(/\n?\*\/\s*\}\s*$/, "");
