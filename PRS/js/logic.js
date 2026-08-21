function generate() {
            const getVal = id => document.getElementById(id).value.trim();
            const getEl = id => document.getElementById(id);

            const train = getVal("trainNumber"),
                doj = getVal("date"),
                source = getVal("source");
            const destination = getVal("destination"),
                coach = getVal("coach"),
                quota = getVal("quota");
            const payment = getVal("payment"),
                mobile = getVal("mobile");

            // Basic Validations
            if (!/^\d{5}$/.test(train)) { alert("Please Enter Train Number"); return getEl("trainNumber").focus(); }
            if (!doj) { alert("Please Enter Date"); return getEl("date").focus(); }
            if (!source) { alert("Please Enter Source"); return getEl("source").focus(); }
            if (!destination || source === destination) { alert("Please Enter Valid Destination"); return getEl("destination").focus(); }
            if (mobile && !/^\d{10}$/.test(mobile)) { alert("Please Enter Valid Mobile Number"); return getEl("mobile").focus(); }

            // Elements mapping
            const names = document.querySelectorAll(".name"),
                genders = document.querySelectorAll(".gender");
            const ages = document.querySelectorAll(".age"),
                berths = document.querySelectorAll(".berth");
            const foods = document.querySelectorAll(".food"),
                concessions = document.querySelectorAll(".concession");
            const otps = document.querySelectorAll(".otp"),
                upns = document.querySelectorAll(".upn");

            const passengerData = [];

            for (let i = 0; i < names.length; i++) {
                const name = names[i].value.trim(),
                    age = parseInt(ages[i].value.trim());

                if (!name || name.length < 3 || name.length > 16 || !/^[A-Za-z ]+$/.test(name)) { alert("Please Enter Valid Passenger Name"); return names[i].focus(); }
                if (isNaN(age) || age < 1 || age > 125) { alert("Please Enter Valid Age"); return ages[i].focus(); }

                let pObj = `  { name: "${name}", gender: "${genders[i].value}", age: "${age}", berth: "${berths[i].value}"`;
                if (!foods[i].disabled) pObj += `, food: "${foods[i].value}"`;
                if (quota === "DP - DUTY PASS" || document.getElementById("concToggle").checked)
    				pObj += `, concession: "${concessions[i].value}", otp: "${otps[i].value}", upn: "${upns[i].value}"`;
				pObj += ` }`;

                passengerData.push(pObj);
            }

            const bookmarkName = getVal("bookmarkName");
            if (!bookmarkName) return getEl("bookmarkName").focus();
            const formNo = bookmarkName;

            const generatedScript = `javascript:(async function(){
const passengers = [
${passengerData.join(',\n')}
];

const FormNo = "${formNo}";
const TrainNo = "${train}";
const JDate = "${doj}";
const from = "${source}";
const to = "${destination}";
const coach = "${coach}";
const quota = "${quota}";
const mobileNumber = "${mobile}";
const PaymentMode = "${payment}";

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function setAngularValue(element, value) {
  if (!element) return;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  setter.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

async function selectMatOption(placeholder, optionText, index = 0, fallback = null) {
  const selects = [...document.querySelectorAll('mat-select')].filter(el => el.getAttribute("placeholder") === placeholder);
  if (!selects[index]) return;
  selects[index].click();

  while (true) {
    const options = [...document.querySelectorAll(".mat-option-text")];
    let option = options.find(el => el.textContent.trim() == optionText) || 
                 (fallback ? options.find(el => el.textContent.trim() == fallback) : null);
    if (option) {
      option.click();
      await sleep(200);
      return;
    }
    await sleep(50);
  }
}

async function selectOption(optionText) {
  const option = [...document.querySelectorAll(".mat-option-text")].find(el => el.textContent.trim().startsWith(optionText));
  if (option) {
    option.click();
    await sleep(200);
    return;
  }
  await sleep(50);
}

const passengerCount = Math.min(Math.max(parseInt(passengers.length, 10) || 1, 1),6);

function getConcessionInputs() {
    return [...document.querySelectorAll('input[name="inputConcession"]')];
}

function clickConcessionBooking(){
  [...document.querySelectorAll('span.mat-slide-toggle-content')]
    .find(e => e.textContent.trim() === 'Concession Booking')
      ?.click();
}

async function fillConcession(passengerIndex) {
    const inputs = getConcessionInputs();
    const input = inputs[passengerIndex];
    if (!input) {
        return false;
    }
    input.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
    await sleep(100);
    setAngularValue(input, passengers[0].concession);
    input.click();
    await sleep(200);
    await selectOption(passengers[0].concession);
    return true;
}

async function fillOtp() {
    let otpInput = null;
    for (let i = 0; i < 30; i++) {
        otpInput = document.querySelector('input[formcontrolname="hrmsOtp"]');
        if (otpInput) break;
        await sleep(100);
    }
    if (!otpInput) {
        return false;
    }
    setAngularValue(otpInput, passengers[0].otp);
    return true;
}

async function fillUpn() {
    let upnInput = null;
    for (let i = 0; i < 30; i++) {
        upnInput = document.querySelector('input[formcontrolname="psgnConcTktNo"]');
        if (upnInput) break;
        await sleep(100);
    }
    if (!upnInput) {
        return false;
    }
    setAngularValue(upnInput, passengers[0].upn);
    return true;
}

async function executeConc() {
    const first = await fillConcession(0);
    if (!first) {
        return;
    }
    await sleep(200);
    await fillOtp();
    await fillUpn();
    for (let i = 1; i < passengerCount; i++) {
        const success = await fillConcession(i);
        if (!success) {
            break;
        }
    }
}

async function fillTrain(TrainNo) {
  const tNO = document.querySelector('input[name="inputTrainNo"]');
  if (tNO) {
    setAngularValue(tNO, TrainNo);
    tNO.click();
    await selectOption(TrainNo);
  }
}

async function fillDate(JDate) {
  const date = document.querySelector('input[name="journeyDate"]');
  if (date) setAngularValue(date, JDate);
}

async function nofPsng(passengers) {
  const input = document.querySelector('input[data-placeholder="No. of Passengers"]') || document.querySelector('input[data-placeholder="No of Adults"]');
  if (!input) return;
  setAngularValue(input, passengers.length);
  input.dispatchEvent(new Event("blur", { bubbles: true }));
}

async function waitAndSetLocation(placeholderList, val) {
  const input = document.querySelector(\`input[data-placeholder="\${placeholderList[0]}"]\`) || 
                document.querySelector(\`input[data-placeholder="\${placeholderList[1]}"]\`);
  if (!input) return;
  while (!input.value.trim()) await sleep(100);
  setAngularValue(input, val);
  input.click();
  await selectOption(val);
}

async function Class(coach) {
  const desti = document.querySelector('input[data-placeholder="Journey To"]') || document.querySelector('input[data-placeholder="Destination"]');
  if (!desti) return;
  while (!desti.value.trim()) await sleep(100);
  await selectMatOption("Class", coach);
}

async function execute() {
  if (passengers[0]?.concession) { clickConcessionBooking(); }
  await fillTrain(TrainNo);
  await fillDate(JDate);
  await nofPsng(passengers);
  await Class(coach);
  await waitAndSetLocation(["Journey From", "Source"], from);
  await waitAndSetLocation(["Journey To", "Destination"], to);
  if (quota === "DP - DUTY PASS") await selectMatOption("Quota", quota);
}

async function psngForm(passengers, mobileNumber, PaymentMode) {
  const nameInputs = document.querySelectorAll('input[formcontrolname="psgnName"]');
  const ageInputs = document.querySelectorAll('input[formcontrolname="psgnAge"]');

  passengers.forEach((p, i) => {
    if (nameInputs[i]) setAngularValue(nameInputs[i], p.name.toUpperCase());
    if (ageInputs[i]) setAngularValue(ageInputs[i], p.age);
  });

  const mobileInput = document.querySelector('input[formcontrolname="mobileNumber"]');
  if (mobileInput) setAngularValue(mobileInput, mobileNumber);

  for (let i = 0; i < passengers.length; i++) await selectMatOption("Gender", passengers[i].gender, i);
  for (let i = 0; i < passengers.length; i++) await selectMatOption("Berth Preference", passengers[i].berth, i, "No Preference");
  
  if ("food" in passengers[0]) {
    for (let i = 0; i < passengers.length; i++) await selectMatOption("Food", passengers[i].food, i);
  }

  await selectMatOption("PAYMENT TYPE", PaymentMode);
}

async function checkAvailabilityAndClickNext() {
  const btn = document.querySelector('button[type="submit"].mat-raised-button.mat-accent');
  if (btn) btn.click();
  else {
    const next = [...document.querySelectorAll('span.mat-button-wrapper')].find(el => el.textContent.trim() === 'Next');
    if (next) next.closest('button').click();
  }
}

async function runPrs() {
  if (window.location.href === "https://client.prs/enquiries/train/fare") {
    await fillTrain(TrainNo);
    await fillDate(JDate);
    await nofPsng(passengers);
    await waitAndSetLocation(["Journey From", "Source"], from);
    await waitAndSetLocation(["Journey To", "Destination"], to);
    await selectMatOption("Quota", quota === "TQ - TATKAL" ? "Tatkal" : "Normal");
    await selectMatOption("Class", coach);
    const fareBtn = [...document.querySelectorAll("span")].find(el => el.textContent.trim() === "Get Fare")?.closest("button");
    if (fareBtn) fareBtn.click();
  } else {
    await execute();
    await psngForm(passengers, mobileNumber, PaymentMode);
    await checkAvailabilityAndClickNext();
	if (passengers[0]?.concession) {
    		await executeConc();
	}
  }
}

await runPrs();
})();`;

            const link = getEl("bookmarkLink");
            link.href = generatedScript;
            link.setAttribute('draggable', 'true');

            const fromFull = getStationName(source);
            const toFull = getStationName(destination);
            const trainFull = getTrainName(train);

            showSaveDialog(fromFull, toFull, trainFull);

        }