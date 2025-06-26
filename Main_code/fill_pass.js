(async function() {
   var user_data = _pax_data_;

   let keyCounter = 0x0;
   function submitPassengerDetailsForm(e) {
     console.log("✓ Passenger Filling Completed");
     window.scrollBy(0, 258, "smooth");   
     if (user_data.other_preferences.psgManual) {
         console.log("✎ Please submit manually!");
         btn = e.querySelector("#psgn-form > form div > button.train_Search.btnDefault[type='submit']")
         btn.focus();
     } else {
         var keyCounter = new Date().getTime();
         var t = setInterval(function() {
             var o = new Date().getTime();
             if (o - keyCounter > 300) {
                 clearInterval(t);
                 btn = e.querySelector("#psgn-form > form div > button.train_Search.btnDefault[type='submit']")
                 btn.focus();
                 simulateClick(btn);
                 console.log("✓ Auto Submitted");
             }
         }, 500);
     }
   }
   
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

   function addDelay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
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
      await simulateMouseInteraction(e);
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

   try {
      let passengerInput = document.querySelector("app-passenger-input");
      let index = 1;
      while (index < user_data.passenger_details.length) {
         await addDelay(200);
         document.getElementsByClassName("prenext")[0].click();
         index++;
         console.log("All", user_data.passenger_details.length, "Passenger Box Open");
      }
      let passengers = [...passengerInput.querySelectorAll("app-passenger")];
      for (let i = 0; i < user_data.passenger_details.length; i++) {
         const p = user_data.passenger_details[i];
         //Name
         const nameInput = passengers[i].querySelector("p-autocomplete > span > input");
         await typeTextHumanLike(nameInput, p.name);
         // Age
         const ageInput = passengers[i].querySelector("input[type='number'][formcontrolname='passengerAge']");
         await typeTextHumanLike(ageInput, String(p.age));
         //Gender
         const genderSelect = passengers[i].querySelector("select[formcontrolname='passengerGender']");
         genderSelect.value = p.gender;
         genderSelect.dispatchEvent(new Event("change"));
         // Berth Select
         const berthSelect = passengers[i].querySelector("select[formcontrolname='passengerBerthChoice']");
         berthSelect.value = p.berth;
         berthSelect.dispatchEvent(new Event("change"));
         // Food Selection
         const foodSelect = passengers[i].querySelector("select[formcontrolname='passengerFoodChoice']");
         if (foodSelect) {
            foodSelect.value = p.food;
            foodSelect.dispatchEvent(new Event("change"));
         }
         await addDelay(Math.floor(Math.random() * 100) + 100);
      }
      console.log("👬🏾 All Passenger Detail Filled !");

      if (user_data.other_preferences.mobileNumber) 
        {
            let m = e.querySelector("input#mobileNumber");
            if (m) { 
                await typeTextHumanLike(m, user_data.other_preferences.mobileNumber);
                console.log("📞 Mobile Number Filled !");
            }
        }


        let upg = e.querySelector("input#autoUpgradation");
        if (upg && user_data.other_preferences.autoUpgradation !== upg.checked) 
        {
            upg.focus();
            await addDelay(7);
            simulateClick(upg);
            console.log("✔ Auto Upgradation Checked !");
            await addDelay(53);
        }

        let conf = e.querySelector("input#confirmberths");
        if (conf && user_data.other_preferences.confirmberths !== conf.checked)
        {
            conf.focus();
            await addDelay(4);
            simulateClick(conf);
            console.log("✔ Only Confirmed Seat Checked !");
            await addDelay(49);
        }

        const insVal = user_data.travel_preferences.travelInsuranceOpted === "yes" ? "true" : 'false';
        const ins = [...e.querySelectorAll("p-radiobutton[formcontrolname='travelInsuranceOpted'] input")].find(q => q.value === insVal);
        if (ins) { 
            simulateClick(ins);
            console.log("📝 Travel Insurance YES !");            
        }


        let coach = e.querySelector("input[formcontrolname='coachId']");
        if (coach && user_data.travel_preferences.prefcoach) coach.value = user_data.travel_preferences.prefcoach;

        const method = user_data.other_preferences.paymentmethod.includes("UPI") ? '2' : '1';
        const payOptions = [...e.querySelectorAll("p-radiobutton[name='paymentType'] input")].find(q => q.value === method);
        if (payOptions) 
        {
            payOptions.focus();
            await addDelay(5);
            simulateClick(payOptions);
            console.log("पे UPI Selected");            
            await addDelay(500);
        }

      //Submit Pax Data
      submitPassengerDetailsForm(passengerInput);

   } catch (error) {
      console.error("Error in fillPassengerDetails:", error);
      window.alert("An error occurred while filling passenger details:\n" + error.message);
   }
})();
