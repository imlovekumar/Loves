(async function() 
{

    var user_data = _pax_data_;
    let keyCounter = 0x0;

    function submitPassengerDetailsForm(e) 
    {
        console.log("✓ Passenger Filling Completed");
        //window.scrollBy(0, 258, "smooth");

        if (user_data.other_preferences.psgManual) 
        {
            console.log("PLz Manually submit !");
            // btn = e.querySelector("#psgn-form > form div > button.train_Search.btnDefault[type='submit']")
            // scrollToView(btn);
            // btn.focus();
        } 
        else 
        {
            var keyCounter = new Date().getTime();
            var t = setInterval(function() 
            {
                var o = new Date().getTime();
                if (o - keyCounter > 2000) 
                {
                    clearInterval(t);
                    simulateClick(e.querySelector("#psgn-form > form div > button.train_Search.btnDefault[type='submit']"));
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
    async function typeTextHumanLike(e, text,minDelay =50, maxDelay = 150) {
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
            const delay = Math.random() * (maxDelay - minDelay) + minDelay;
            await new Promise(res => setTimeout(res, delay));
        }

        e.dispatchEvent(new Event("change", { bubbles: true }));
    }

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

    function scrollToView(el) {
        if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function humanDelay(min = 100, max = 250) {
        return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
    }


    
    try 
    {
        const e = document.querySelector("app-passenger-input");
        if (!e) return alert("Not on the right page.");
        for (let i = 1; i < user_data.passenger_details.length; i++) 
        {
            await humanDelay(150, 400);  // slower, more human
            simulateClick(document.getElementsByClassName("prenext")[0]);
            await humanDelay(150, 400);  // slower, more human
            console.log("All",user_data.passenger_details.length,"Passenger Box Open");
        }

        const o = [...e.querySelectorAll("app-passenger")];
        for (let i = 0; i < user_data.passenger_details.length; i++) {
            let el = o[i];
            const pnameInput = el.querySelector("p-autocomplete input");
            if (pnameInput) 
            {await typeTextHumanLike(pnameInput, user_data.passenger_details[i].name,100,300);}
            const pageInput = el.querySelector("input[formcontrolname='passengerAge']");
            if(pageInput)
            {await typeTextHumanLike(pageInput, user_data.passenger_details[i].age,100,400);}
            el.querySelector("select[formcontrolname='passengerGender']").value = user_data.passenger_details[i].gender;
            el.querySelector("select[formcontrolname='passengerGender']").dispatchEvent(new Event("change"));
            el.querySelector("select[formcontrolname='passengerBerthChoice']").value = user_data.passenger_details[i].berth;
            el.querySelector("select[formcontrolname='passengerBerthChoice']").dispatchEvent(new Event("change"));
            let food = el.querySelector("select[formcontrolname='passengerFoodChoice']");
            if (food) 
            {
                food.value = user_data.passenger_details[i].food;
                food.dispatchEvent(new Event("change"));
            }
            await humanDelay();
        };
        console.log("👬🏾 All Passenger Detail Filled !");


        if (user_data.other_preferences.mobileNumber) 
        {
            let m = e.querySelector("input#mobileNumber");
            if (m) {
                scrollToView(m);
                await typeTextHumanLike(m, user_data.other_preferences.mobileNumber);
                console.log("📞 Mobile Number Filled !");
            }
        }


        // let upg = e.querySelector("input#autoUpgradation");
        // if (upg && user_data.other_preferences.autoUpgradation !== upg.checked) 
        // {
        //     scrollToView(upg);
        //     upg.focus();
        //     await humanDelay();
        //     simulateClick(upg);
        //     console.log("✔ Auto Upgradation Checked !");
        //     await humanDelay();
        // }

        let conf = e.querySelector("input#confirmberths");
        if (conf && user_data.other_preferences.confirmberths !== conf.checked)
        {
            conf.style.border = "2px solid red";
            conf.style.backgroundColor = "yellow";
            scrollToView(conf);
            // conf.focus();
            // await humanDelay();
            // simulateClick(conf);
            // console.log("✔ Only Confirmed Seat Checked !");
            // await humanDelay();
        }

        // const insVal = user_data.travel_preferences.travelInsuranceOpted === "yes" ? "true" : 'false';
        // const ins = [...e.querySelectorAll("p-radiobutton[formcontrolname='travelInsuranceOpted'] input")].find(q => q.value === insVal);
        // if (ins) { 
        //     scrollToView(ins);
        //     simulateClick(ins);
        //     console.log("📝 Travel Insurance YES !");            
        // }
        
        // const method = user_data.other_preferences.paymentmethod.includes("UPI") ? '2' : '1';
        // const payOptions = [...e.querySelectorAll("p-radiobutton[name='paymentType'] input")].find(q => q.value === method);
        // if (payOptions) 
        // {
        //     scrollToView(payOptions);
        //     payOptions.focus();
        //     await humanDelay();
        //     simulateClick(payOptions);
        //     console.log("पे UPI Selected");            
        //     await humanDelay();
        // }
        

        submitPassengerDetailsForm(e);
    } catch (e) { alert("Script error: " + e.message);}
})();
