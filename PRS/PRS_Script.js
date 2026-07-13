javascript: (async function() {
    const passengers = [
		{ name: "Manish",	gender: "Male",	age: "28"
        },
        { name: "Mehul",	gender: "Male",	age: "32"
        },
        { name: "Love",	gender: "Male",	age: "30"
        },
        { name: "sanjiv", gender: "Female",age: "25"
        }
    ];
	const TrainNo = "17216";
    const JDate = "04.07.2026";
    const from = "KDP";
    const to = "GNT";
    const coach = "SL - SLEEPER";
    const mobileNumber = "9876543210";
    const PaymentMode = "Cash";

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function setAngularValue(element, value) {
        if (!element) return;
        const setter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value"
        ).set;
        setter.call(element, value);
        element.dispatchEvent(new Event("input", {
            bubbles: true
        }));
        element.dispatchEvent(new Event("change", {
            bubbles: true
        }));
    }

    async function selectMatOption(placeholder, optionText, index = 0) {
        const selects = [...document.querySelectorAll('mat-select')]
            .filter(el => el.getAttribute("placeholder") === placeholder);
        if (!selects[index]) return;
        selects[index].click();

        while (true) {
            const option = [...document.querySelectorAll(".mat-option-text")]
                .find(el => el.textContent.trim() == optionText);
            if (option) {
                option.click();
                await sleep(200);
                return;
            }
            await sleep(50);
        }
    }

    async function selectTrain(optionText) {
        const option = [...document.querySelectorAll(".mat-option-text")]
            .find(el => el.textContent.trim().startsWith(optionText));
        if (option) {
            option.click();
            await sleep(200);
            return;
        }
        await sleep(50);
    }

    async function fillTrain(TrainNo) {
        const tNO = document.querySelector('input[name="inputTrainNo"]');
        if (tNO) {
            setAngularValue(tNO, TrainNo);
            tNO.click();
            await selectTrain(TrainNo);
        }
    }

    async function fillDate(JDate) {
        const date = document.querySelector('input[name="journeyDate"]');
        if (date) {
            setAngularValue(date, JDate);
        }
    }

    async function Class(coach) {
        const desti = document.querySelector('input[data-placeholder="Journey To"]');
        desti.value = '';
        while (!desti.value.trim()) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        await selectMatOption("Class", coach);
    }

    async function nofPsng(passengers) {
        const nofPsng = document.querySelector('input[data-placeholder="No. of Passengers"]');
        setAngularValue(nofPsng, passengers.length);
        nofPsng.dispatchEvent(new Event("blur", {
            bubbles: true
        }));
    }
	
	async function waitSource(from) {
        const source = document.querySelector('input[data-placeholder="Journey From"]');
        setAngularValue(source, from);
        source.click();
        await selectTrain(from);
    }

    async function waitDesti(to) {
        const desti = document.querySelector('input[data-placeholder="Journey To"]');
        while (!desti.value.trim()) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        setAngularValue(desti, to);
        desti.click();
        await selectTrain(to);
    }

    async function execute() {
        await fillTrain(TrainNo);
        await fillDate(JDate);
        await nofPsng(passengers);
        await Class(coach);
        await waitSource(from);
        await waitDesti(to);
    }

    async function psngForm(passengers, mobileNumber, PaymentMode) {
        const nameInputs = document.querySelectorAll('input[formcontrolname="psgnName"]');
        const ageInputs = document.querySelectorAll('input[formcontrolname="psgnAge"]');
        passengers.forEach((p, i) => {
            if (nameInputs[i])
                setAngularValue(nameInputs[i], p.name.toUpperCase());

            if (ageInputs[i])
                setAngularValue(ageInputs[i], p.age);
        });

        const mobileInput = document.querySelector('input[formcontrolname="mobileNumber"]');
        if (mobileInput) {
            setAngularValue(mobileInput, mobileNumber)
        }

        for (let i = 0; i < passengers.length; i++) {
            await selectMatOption("Gender", passengers[i].gender, i);
        }

        //if ("food" in passengers[0]) {
            //    for (let i = 0; i < passengers.length; i++) {
            //        await selectMatOption("Food Choice", passengers[i].food, i);
            //    }
            //}
            
        await selectMatOption("PAYMENT TYPE", PaymentMode);
    }

    async function checkAvailabilityAndClickNext() {

        function clickNext() {
            const btn = document.querySelector('button[type="submit"].mat-raised-button.mat-accent');

            if (btn) {
                btn.click();
                return;
            }
            const next = [...document.querySelectorAll("span.mat-button-wrapper")]
                .find(el => el.textContent.trim() === "Next");

            next?.closest("button")?.click();
        }

        function processStatus() {
            const status = [...document.querySelectorAll("span")]
                .find(el => el.textContent.includes("AVAILABILITY STATUS"));

            if (!status) return null; // Not loaded yet

            const text = status.textContent.toUpperCase();
            if (/\bAVAILABLE\b/i.test(text)) {
                clickNext();
                return true;
            }

            console.log("Not Available");
            return false;
        }

        const result = processStatus();
        if (result !== null) 
            return result;

        return new Promise(resolve => {

            const observer = new MutationObserver(() => {
                const result = processStatus();
                if (result !== null) {
                    observer.disconnect();
                    resolve(result);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });

        });
    }

    await execute();
    await psngForm(passengers, mobileNumber, PaymentMode);
    await checkAvailabilityAndClickNext();

})();