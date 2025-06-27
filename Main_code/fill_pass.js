(async function() {
    var user_data = _pax_data_;
    let keyCounter = 0x0;

    function submitPassengerDetailsForm(e) 
    {
        console.log("✓ Passenger Filling Completed");
        if (user_data.other_preferences.psgManual) {
            console.log("PLz Manually submit !");
            btn = e.querySelector("#psgn-form > form div > button.train_Search.btnDefault[type='submit']")
            scrollToView(btn);
        } else {
            var keyCounter = new Date().getTime();
            var t = setInterval(function() {
                var o = new Date().getTime();
                if (o - keyCounter > 2000) {
                    clearInterval(t);
                    console.log("✓ Auto Submit");
                    btn = e.querySelector("#psgn-form > form div > button.train_Search.btnDefault[type='submit']")
                    scrollToView(btn);
                    fastClick(btn);
                    console.log("✓ Auto Submitted");
                }
            }, 500);
        }
    }

    function fastFill(element, text) {
  if (!element || typeof text !== "string") {
    console.warn("Element not provided or text is not a string for fastFill.");
    return;
  }

  element.focus();
  element.value = text;

  element.dispatchEvent(new Event("input", {
    bubbles: true,
    cancelable: true
  }));

  element.dispatchEvent(new Event("change", {
    bubbles: true,
    cancelable: true
  }));

  element.blur();
}

function fastClick(element) {
  if (element && typeof element.click === "function") {
    if (element.disabled) {
      console.warn("Element is disabled and cannot be clicked:", element);
      return;
    }

    element.click();
  } else {
    console.warn("Invalid element or element.click is not a function:", element);
  }
}

    //  // === Configuration ===
    // const config = {
    //     typingOptions: {
    //         minDelay: 5,                  // Minimum typing delay per character (ms)
    //         maxDelay: 10                   // Maximum typing delay per character (ms)
    //     }
    // };


    // // === Utility: Simulate fast & stealthy click ===
    // function simulateClick(el) {
    //     if (!el) return;
    //     const delay = ms => new Promise(res => setTimeout(res, ms));
    //     const fire = type => {
    //         el.dispatchEvent(new MouseEvent(type, {
    //             bubbles: true,
    //             cancelable: true,
    //             clientX: el.getBoundingClientRect().left + 1,
    //             clientY: el.getBoundingClientRect().top + 1
    //         }));
    //     };
    //     return (async () => {
    //         fire('mouseover');
    //         await delay(10 + Math.random() * 10);
    //         fire('mousedown');
    //         await delay(10 + Math.random() * 15);
    //         fire('mouseup');
    //         await delay(5 + Math.random() * 10);
    //         fire('click');
    //     })();
    // }

    // // === Utility: Simulate human-like typing ===
    // function simulateTyping(el, text, options = {}) {
    //     const { minDelay = 20, maxDelay = 40 } = options;
    //     const triggerKey = (type, char) => {
    //         const evt = new KeyboardEvent(type, {
    //             key: char,
    //             bubbles: true,
    //             cancelable: true
    //         });
    //         el.dispatchEvent(evt);
    //     };
    //     const triggerInput = () => {
    //         el.dispatchEvent(new Event('input', { bubbles: true }));
    //     };
    //     return (async () => {
    //         el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    //         el.focus({ preventScroll: true });
    //         el.value = '';
    //         for (const char of text) {
    //             triggerKey('keydown', char);
    //             triggerKey('keypress', char);
    //             el.value += char;
    //             triggerInput();
    //             triggerKey('keyup', char);
    //             await new Promise(res => setTimeout(res, minDelay + Math.random() * (maxDelay - minDelay)));
    //         }
    //     })();
    // }

    // async function simulateMouseInteraction(element) {
    //     const rect = element.getBoundingClientRect();
    //     const x = rect.left + Math.random() * rect.width;
    //     const y = rect.top + Math.random() * rect.height;
    //     const events = ["mouseover", "mouseenter", "mousemove", "mousedown", "mouseup", "click"];
    //     for (const type of events) {
    //         const event = new MouseEvent(type, {
    //             bubbles: true,
    //             cancelable: true,
    //             view: window,
    //             clientX: x,
    //             clientY: y,
    //         });
    //         element.dispatchEvent(event);
    //         await new Promise(res => setTimeout(res, Math.random() * 60 + 40));
    //     }
    // }
    
    // async function typeTextHumanLike(e, text) {
    //     if (!e || typeof text !== "string") return;
    //     await simulateMouseInteraction(e);  // Hover + Click
    //     e.focus();
    //     e.value = "";
    //     e.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
    //     for (const char of text) {
    //         e.dispatchEvent(new KeyboardEvent("keydown", { key: char, bubbles: true }));
    //         e.value += char;
    //         e.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, data: char, inputType: "insertText" }));
    //         e.dispatchEvent(new KeyboardEvent("keyup", { key: char, bubbles: true }));
    //         await new Promise(res => setTimeout(res, Math.random() * 100 + 50));
    //     }
    //     e.dispatchEvent(new Event("change", { bubbles: true }));
    // }

    // // === Utility: Simulate fast & stealthy click ===
    // function simulateClick(el) {
    //     if (!el) return;
    //     const delay = ms => new Promise(res => setTimeout(res, ms));
    //     const fire = type => {
    //         el.dispatchEvent(new MouseEvent(type, {
    //             bubbles: true,
    //             cancelable: true,
    //             clientX: el.getBoundingClientRect().left + 1,
    //             clientY: el.getBoundingClientRect().top + 1
    //         }));
    //     };
    //     return (async () => {
    //         fire('mouseover');
    //         await delay(10 + Math.random() * 10);
    //         fire('mousedown');
    //         await delay(10 + Math.random() * 15);
    //         fire('mouseup');
    //         await delay(5 + Math.random() * 10);
    //         fire('click');
    //     })();
    // }
    
    function scrollToView(el) {
        if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function humanDelay(min = 100, max = 300) {
        return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
    }
    
    try 
    {
        const e = document.querySelector("app-passenger-input");
        if (!e) return alert("Not on the right page.");
        // Add additional passenger rows
        for (let i = 1; i < user_data.passenger_details.length; i++) {
            fastClick(document.getElementsByClassName("prenext")[0]);
            await humanDelay(100, 300);
            console.log("All",user_data.passenger_details.length,"Passenger Box Open");
        }
        
        const o = [...e.querySelectorAll("app-passenger")];
        for (let i = 0; i < user_data.passenger_details.length; i++){
            let el = o[i];
            
            const pnameInput = el.querySelector("p-autocomplete input");
            if (pnameInput) {
                pnameInput.click();
                await fastFill(pnameInput, user_data.passenger_details[i].name);
            }

            const pageInput = el.querySelector("input[formcontrolname='passengerAge']");
            if(pageInput){
                pageInput.click();
                await fastFill(pageInput, user_data.passenger_details[i].age);
            }

            el.querySelector("select[formcontrolname='passengerGender']").value = user_data.passenger_details[i].gender;
            el.querySelector("select[formcontrolname='passengerGender']").dispatchEvent(new Event("change"));
            el.querySelector("select[formcontrolname='passengerBerthChoice']").value = user_data.passenger_details[i].berth;
            el.querySelector("select[formcontrolname='passengerBerthChoice']").dispatchEvent(new Event("change"));
            let food = el.querySelector("select[formcontrolname='passengerFoodChoice']");
            if (food) {
                food.value = user_data.passenger_details[i].food;
                food.dispatchEvent(new Event("change"));
            }
            try {
                let chk = el.querySelector("input[type='checkbox'][formcontrolname='childBerthFlag']");
                if (chk && p.passengerchildberth) chk.click();
            }
            catch (err) { console.error("Child berth error", err); }
        };
        console.log("👬🏾 All Passenger Detail Filled !");
        if (user_data.other_preferences.mobileNumber) {
            let m = e.querySelector("input#mobileNumber");
            if (m) { 
                await fastFill(m, user_data.other_preferences.mobileNumber);
                console.log("📞 Mobile Number Filled !");
            }
        }
        let upg = e.querySelector("input#autoUpgradation");
        if (upg && user_data.other_preferences.autoUpgradation !== upg.checked) {
            scrollToView(upg);
            upg.focus();
            await humanDelay();
            fastClick(upg);
            console.log("✔ Auto Upgradation Checked !");
        }
        let conf = e.querySelector("input#confirmberths");
        if (conf && user_data.other_preferences.confirmberths !== conf.checked){
            scrollToView(conf);
            conf.focus();
            await humanDelay();
            fastClick(conf);
            console.log("✔ Only Confirmed Seat Checked !");
        }
        const insVal = user_data.travel_preferences.travelInsuranceOpted === "yes" ? "true" : 'false';
        const ins = [...e.querySelectorAll("p-radiobutton[formcontrolname='travelInsuranceOpted'] input")].find(q => q.value === insVal);
        if (ins) { 
            scrollToView(ins);
            ins.focus();
            await humanDelay();
            fastClick(ins);
            console.log("📝 Travel Insurance YES !");            
        }
        let coach = e.querySelector("input[formcontrolname='coachId']");
        if (coach && user_data.travel_preferences.prefcoach) coach.value = user_data.travel_preferences.prefcoach;
        const method = user_data.other_preferences.paymentmethod.includes("UPI") ? '2' : '1';
        const payOptions = [...e.querySelectorAll("p-radiobutton[name='paymentType'] input")].find(q => q.value === method);
        if (payOptions) {
            scrollToView(payOptions);
            payOptions.focus();
            await humanDelay();
            fastClick(payOptions);
            console.log("पे UPI Selected");            
        }
        submitPassengerDetailsForm(e);
    } catch (e) { alert("Script error: " + e.message);}
})();
