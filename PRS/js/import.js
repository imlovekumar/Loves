function importBookmarklet() {

    const input = document.getElementById("bookmarkletInput");
    let code = input.value.trim();

    if (!code) {
        alert("Please paste a bookmarklet.");
        input.focus();
        return;
    }

    try {

        // ==========================================
        // REMOVE javascript: PREFIX
        // ==========================================

        code = code.replace(/^javascript:\s*/i, "");


        // ==========================================
        // GET VARIABLE FROM BOOKMARKLET
        // ==========================================

        function getVariable(name) {

            const regex = new RegExp(
                `const\\s+${name}\\s*=\\s*"([^"]*)"`
            );

            const match = code.match(regex);

            return match ? match[1] : "";
        }


        // ==========================================
        // READ BOOKMARKLET VALUES
        // ==========================================

        const formNo =
            getVariable("FormNo");

        const train =
            getVariable("TrainNo");

        const doj =
            getVariable("JDate");

        const source =
            getVariable("from");

        const destination =
            getVariable("to");

        const coach =
            getVariable("coach");

        const quota =
            getVariable("quota");

        const mobile =
            getVariable("mobileNumber");

        const payment =
            getVariable("PaymentMode");


        // ==========================================
        // VALIDATE BOOKMARKLET
        // ==========================================

        if (
            !train &&
            !doj &&
            !source &&
            !destination
        ) {

            alert(
                "Invalid bookmarklet or unsupported format."
            );

            return;
        }


        // ==========================================
        // FORM NO.
        // ==========================================

        const bookmarkName =
            document.getElementById("bookmarkName");

        if (bookmarkName && formNo) {

            bookmarkName.value = formNo;

            bookmarkName.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );

            if (
                typeof updateButtonText ===
                "function"
            ) {
                updateButtonText();
            }
        }


        // ==========================================
        // TRAIN NUMBER
        // ==========================================

        const trainInput =
            document.getElementById("trainNumber");

        if (trainInput) {

            trainInput.value = train;

            trainInput.dispatchEvent(
                new Event("input", {
                    bubbles: true
                })
            );

            trainInput.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );
        }


        // ==========================================
        // DATE
        // ==========================================

        const dateInput =
            document.getElementById("date");

        if (dateInput) {

            dateInput.value = doj;

            dateInput.dispatchEvent(
                new Event("input", {
                    bubbles: true
                })
            );

            dateInput.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );
        }


        // ==========================================
        // FROM STATION
        // ==========================================

        const sourceInput =
            document.getElementById("source");

        if (sourceInput && source) {

            sourceInput.value =
                source.toUpperCase();

            sourceInput.dispatchEvent(
                new Event("input", {
                    bubbles: true
                })
            );

            sourceInput.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );


            // Keep boarding station synchronized
            const brdStn =
                document.getElementById("brdStn");

            if (brdStn) {

                brdStn.value =
                    source.toUpperCase();

                brdStn.dispatchEvent(
                    new Event("input", {
                        bubbles: true
                    })
                );

                brdStn.dispatchEvent(
                    new Event("change", {
                        bubbles: true
                    })
                );
            }
        }


        // ==========================================
        // TO STATION
        // ==========================================

        const destinationInput =
            document.getElementById("destination");

        if (
            destinationInput &&
            destination
        ) {

            destinationInput.value =
                destination.toUpperCase();

            destinationInput.dispatchEvent(
                new Event("input", {
                    bubbles: true
                })
            );

            destinationInput.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );
        }


        // ==========================================
        // CLASS
        // ==========================================

        const coachInput =
            document.getElementById("coach");

        if (coachInput && coach) {

            coachInput.value = coach;

            coachInput.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );
        }


        // ==========================================
        // QUOTA
        // ==========================================

        const quotaSelect =
            document.getElementById("quota");

        const quotaToggle =
            document.getElementById("quotaToggle");

        if (quotaSelect && quota) {

            quotaSelect.disabled = false;

            quotaSelect.value = quota;

            quotaSelect.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );
        }

        if (quotaToggle) {

            quotaToggle.checked = true;

            quotaToggle.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );
        }

        // ==========================================
        // concessiontoggle
        // ==========================================


        const concToggle = document.getElementById("concToggle");

        if (concToggle) {

            const code = input.value;

            const hasConcession =
                /concession\s*:\s*["'][^"']+["']/i.test(code);

            concToggle.checked = hasConcession;

            concToggle.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );
        }


        // ==========================================
        // MOBILE
        // ==========================================

        const mobileInput =
            document.getElementById("mobile");

        if (mobileInput) {

            mobileInput.value = mobile;

            mobileInput.dispatchEvent(
                new Event("input", {
                    bubbles: true
                })
            );

            mobileInput.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );
        }


        // ==========================================
        // PAYMENT
        // ==========================================

        const paymentInput =
            document.getElementById("payment");

        if (paymentInput && payment) {

            paymentInput.value = payment;

            paymentInput.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );
        }


        // ==========================================
        // FIND PASSENGER ARRAY
        // ==========================================

        const passengerStart =
            code.indexOf("const passengers = [");

        if (passengerStart === -1) {

            alert(
                "Passenger data not found."
            );

            return;
        }


        const arrayStart =
            code.indexOf(
                "[",
                passengerStart
            );

        const arrayEnd =
            code.indexOf(
                "];",
                arrayStart
            );

        if (
            arrayStart === -1 ||
            arrayEnd === -1
        ) {

            alert(
                "Unable to read passenger data."
            );

            return;
        }


        const passengerText =
            code.substring(
                arrayStart + 1,
                arrayEnd
            );


        // ==========================================
        // PASSENGER REGEX
        // ==========================================

        const passengerRegex =
            /\{\s*name:\s*"([^"]*)"\s*,\s*gender:\s*"([^"]*)"\s*,\s*age:\s*"([^"]*)"\s*,\s*berth:\s*"([^"]*)"(?:\s*,\s*food:\s*"([^"]*)")?(?:\s*,\s*concession:\s*"([^"]*)"\s*,\s*otp:\s*"([^"]*)"\s*,\s*upn:\s*"([^"]*)")?\s*\}/g;


        const passengers = [];

        let match;

        while (
            (match =
                passengerRegex.exec(
                    passengerText
                )) !== null
        ) {

            passengers.push({

                name: match[1],

                gender: match[2],

                age: match[3],

                berth: match[4],

                food: match[5] || "",

                concession: match[6] || "",

                otp: match[7] || "",

                upn: match[8] || ""

            });
        }


        // ==========================================
        // CHECK PASSENGERS
        // ==========================================

        if (!passengers.length) {

            alert(
                "No passenger information found."
            );

            return;
        }


        // ==========================================
        // PASSENGER COUNT
        // ==========================================

        const count =
            document.getElementById("count");

        if (!count) {

            alert(
                "Passenger count field not found."
            );

            return;
        }

        count.value =
            passengers.length;

        count.dispatchEvent(
            new Event("change", {
                bubbles: true
            })
        );


        // ==========================================
        // CREATE PASSENGER ROWS
        // ==========================================

        createPassRows();


        // ==========================================
        // GET PASSENGER ELEMENTS
        // ==========================================

        const names =
            document.querySelectorAll(
                "#passArea .name"
            );

        const genders =
            document.querySelectorAll(
                "#passArea .gender"
            );

        const ages =
            document.querySelectorAll(
                "#passArea .age"
            );

        const berths =
            document.querySelectorAll(
                "#passArea .berth"
            );

        const foods =
            document.querySelectorAll(
                "#passArea .food"
            );

        const foodToggles =
            document.querySelectorAll(
                "#passArea .food-toggle"
            );

        const concessions =
            document.querySelectorAll(
                "#passArea .concession"
            );

        const otps =
            document.querySelectorAll(
                "#passArea .otp"
            );

        const upns =
            document.querySelectorAll(
                "#passArea .upn"
            );


        // ==========================================
        // FILL PASSENGER DATA
        // ==========================================

        passengers.forEach((p, i) => {

            if (names[i]) {
                names[i].value =
                    p.name;
            }

            if (genders[i]) {
                genders[i].value =
                    p.gender;
            }

            if (ages[i]) {
                ages[i].value =
                    p.age;
            }

            if (berths[i]) {
                berths[i].value =
                    p.berth;
            }


            // ======================================
            // FOOD
            // ======================================

            if (p.food) {

                if (foodToggles[i]) {

                    foodToggles[i].checked =
                        true;

                    foodToggles[i].dispatchEvent(
                        new Event("change", {
                            bubbles: true
                        })
                    );
                }

                if (foods[i]) {

                    foods[i].disabled =
                        false;

                    foods[i].value =
                        p.food;
                }
            }


            // ======================================
            // DUTY PASS
            // ======================================

            if (concessions[i]) {

                concessions[i].value =
                    p.concession;
            }

            if (otps[i]) {

                otps[i].value =
                    p.otp;
            }

            if (upns[i]) {

                upns[i].value =
                    p.upn;
            }

        });


        // ==========================================
        // UPDATE DUTY PASS ROW VISIBILITY
        // ==========================================

        if (
            typeof toggleDutyPassRows ===
            "function"
        ) {

            toggleDutyPassRows();
        }


        // ==========================================
        // CLOSE IMPORT BOX
        // ==========================================

        closeImportBox();


    } catch (error) {

        console.error(
            "Bookmarklet import error:",
            error
        );

        alert(
            "Unable to import bookmarklet.\n\n" +
            error.message
        );
    }
}