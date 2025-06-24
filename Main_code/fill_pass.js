(async function() 
{
    var user_data = _pax_data_;
    let keyCounter = 0x0;
    function submitPassengerDetailsForm(e) 
    {
        console.log("✓ Passenger Filling Completed");
        if (user_data.other_preferences.psgManual) 
        {
            console.log("PLz Manually submit !");
            btn = e.querySelector("#psgn-form > form div > button.train_Search.btnDefault[type='submit']")
            btn.focus();
        } 
        else 
        {
            var keyCounter = new Date().getTime();
            var t = setInterval(function() 
            {
                var o = new Date().getTime();
                if (o - keyCounter > 300) 
                {
                    clearInterval(t);
                    console.log("✓ Auto Submit");
                    btn = e.querySelector("#psgn-form > form div > button.train_Search.btnDefault[type='submit']")
                    simulateClick(btn);
                    console.log("✓ Auto Submitted");
                }
            }, 500);
        }
    }

    async function simulateMouseInteraction(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;
        const events = ["mouseover", "mouseenter", "mousemove", "mousedown", "mouseup", "click"];
        for (const type of events) {
            const event = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: x,
                clientY: y,
            });
            element.dispatchEvent(event);
            await new Promise(res => setTimeout(res, Math.random() * 60 + 40));
        }    
    }
    async function typeTextHumanLike(e, text) {
        if (!e || typeof text !== "string") return;
        await simulateMouseInteraction(e);  // Hover + Click
        e.focus();
        e.value = "";
        e.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
        for (const char of text) {
            e.dispatchEvent(new KeyboardEvent("keydown", { key: char, bubbles: true }));
            e.value += char;
            e.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, data: char, inputType: "insertText" }));
            e.dispatchEvent(new KeyboardEvent("keyup", { key: char, bubbles: true }));
            await new Promise(res => setTimeout(res, Math.random() * 100 + 100));
        }
        e.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function addDelay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    // === Utility: Simulate fast & stealthy click ===
    function simulateClick(el) {
        if (!el) return;
        const delay = ms => new Promise(res => setTimeout(res, ms));
        const fire = type => {
            el.dispatchEvent(new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                clientX: el.getBoundingClientRect().left + 1,
                clientY: el.getBoundingClientRect().top + 1
            }));
        };
        return (async () => {
            fire('mouseover');
            await delay(10 + Math.random() * 10);
            fire('mousedown');
            await delay(10 + Math.random() * 15);
            fire('mouseup');
            await delay(5 + Math.random() * 10);
            fire('click');
        })();
    }
    
    try 
    {
        let passengerInput = document.querySelector("app-passenger-input");
        let index = 1;
        while (index < user_data.passenger_details.length) {
            addDelay(200);
            document.getElementsByClassName("prenext")[0].click();
            index++;
            console.log("All",user_data.passenger_details.length,"Passenger Box Open");
        }
        // const e = document.querySelector("app-passenger-input");
        // if (!e) return alert("Not on the right page.");
        // for (let i = 1; i < user_data.passenger_details.length; i++) 
        // {
        //     await addDelay(200);
        //     simulateClick(document.getElementsByClassName("prenext")[0]);
        //     console.log("All",user_data.passenger_details.length,"Passenger Box Open");
        // }

        let passengers = [...passengerInput.querySelectorAll("app-passenger")];
        //const o = [...e.querySelectorAll("app-passenger")];
        user_data.passenger_details.forEach((p, i) => {
            let nameInput = passengers[i].querySelector("p-autocomplete > span > input");
            nameInput.value = p.name;
            nameInput.dispatchEvent(new Event("input"));

            let ageInput = passengers[i].querySelector("input[type='number'][formcontrolname='passengerAge']");
            ageInput.value = p.age;
            ageInput.dispatchEvent(new Event("input"));

            let genderSelect = passengers[i].querySelector("select[formcontrolname='passengerGender']");
            genderSelect.value = p.gender;
            genderSelect.dispatchEvent(new Event("change"));

            let berthSelect = passengers[i].querySelector("select[formcontrolname='passengerBerthChoice']");
            berthSelect.value = p.berth;
            berthSelect.dispatchEvent(new Event("change"));

            let foodSelect = passengers[i].querySelector("select[formcontrolname='passengerFoodChoice']");
            if (foodSelect) {
                foodSelect.value = p.food;
                foodSelect.dispatchEvent(new Event("change"));
            }
        });
            
        // for (let i = 0; i < user_data.passenger_details.length; i++)
        // {
        //     let el = o[i];
        //     const pnameInput = el.querySelector("p-autocomplete > span > input");
        //     if (pnameInput) 
        //     {await typeTextHumanLike(pnameInput, user_data.passenger_details[i].name);}
        //     const pageInput = el.querySelector("input[formcontrolname='passengerAge']");
        //     if(pageInput)
        //     {await typeTextHumanLike(pageInput, user_data.passenger_details[i].age);}
        //     el.querySelector("select[formcontrolname='passengerGender']").value = user_data.passenger_details[i].gender;
        //     el.querySelector("select[formcontrolname='passengerGender']").dispatchEvent(new Event("change"));
        //     el.querySelector("select[formcontrolname='passengerBerthChoice']").value = user_data.passenger_details[i].berth;
        //     el.querySelector("select[formcontrolname='passengerBerthChoice']").dispatchEvent(new Event("change"));
        //     let food = el.querySelector("select[formcontrolname='passengerFoodChoice']");
        //     if (food) 
        //     {
        //         food.value = user_data.passenger_details[i].food;
        //         food.dispatchEvent(new Event("change"));
        //     }
        // };
        console.log("👬🏾 All Passenger Detail Filled !");
        
        // Fill mobile number if provided
        if (user_data.other_preferences.mobileNumber !== "") {
            let mobileInput = passengerInput.querySelector("input#mobileNumber[formcontrolname='mobileNumber'][name='mobileNumber']");
            mobileInput.value = user_data.other_preferences.mobileNumber;
            mobileInput.dispatchEvent(new Event("input"));
            console.log("📞 Mobile Number Filled !");
        }

        // Auto upgradation
        let autoUpgradeCheckbox = passengerInput.querySelector("input#autoUpgradation[type='checkbox'][formcontrolname='autoUpgradationSelected']");
        if (autoUpgradeCheckbox) {
            autoUpgradeCheckbox.checked = !!user_data.other_preferences.autoUpgradation;
            console.log("✔ Auto Upgradation Checked !");
        }

        // Confirm berths only
        let confirmBerthsCheckbox = passengerInput.querySelector("input#confirmberths[type='checkbox'][formcontrolname='bookOnlyIfCnf']");
        if (confirmBerthsCheckbox) {
            confirmBerthsCheckbox.checked = !!user_data.other_preferences.confirmberths;
            console.log("✔ Only Confirmed Seat Checked !");
        }

        // Travel insurance
        let insuranceRadios = [...passengerInput.querySelectorAll("p-radiobutton[formcontrolname='travelInsuranceOpted'] input[type='radio'][name='travelInsuranceOpted-0']")];
        addDelay(200);
        insuranceRadios.filter(e => e.value === (user_data.travel_preferences.travelInsuranceOpted === "yes" ? "true" : "false"))[0]?.click();    
        console.log("📝 Travel Insurance YES !"); 
        
        // if (user_data.other_preferences.mobileNumber) 
        // {
        //     let m = e.querySelector("input#mobileNumber");
        //     if (m) { 
        //         await typeTextHumanLike(m, user_data.other_preferences.mobileNumber);
        //         console.log("📞 Mobile Number Filled !");
        //     }
        // }
        // let upg = e.querySelector("input#autoUpgradation");
        // if (upg && user_data.other_preferences.autoUpgradation !== upg.checked) 
        // {
        //     await addDelay(7);
        //     simulateClick(upg);
        //     console.log("✔ Auto Upgradation Checked !");
        // }
        // let conf = e.querySelector("input#confirmberths");
        // if (conf && user_data.other_preferences.confirmberths !== conf.checked)
        // {
        //     await addDelay(4);
        //     simulateClick(conf);
        //     console.log("✔ Only Confirmed Seat Checked !");
        // }
        // const insVal = user_data.travel_preferences.travelInsuranceOpted === "yes" ? "true" : 'false';
        // const ins = [...e.querySelectorAll("p-radiobutton[formcontrolname='travelInsuranceOpted'] input")].find(q => q.value === insVal);
        // if (ins) { 
        //     simulateClick(ins);
        //     console.log("📝 Travel Insurance YES !");            
        // }
        
        const method = user_data.other_preferences.paymentmethod.includes("UPI") ? '2' : '1';
        const payOptions = [...e.querySelectorAll("p-radiobutton[name='paymentType'] input")].find(q => q.value === method);
        if (payOptions) 
        {
            payOptions.focus();
            await addDelay(5);
            simulateClick(payOptions);
            console.log("पे UPI Selected");            
            await addDelay(300);
        }
        submitPassengerDetailsForm(e);
    } catch (error) {
        console.error("Error in fillPassengerDetails:", error);
    }
    // catch (e) {
    //     alert("Script error: " + e.message);
    // }
})();
