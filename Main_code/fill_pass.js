(async function() {
   var user_data = _pax_data_;

   function submitPassengerDetailsForm(containerElement) {
      console.log("✓ Passenger Filling Completed");
      const submitButton = containerElement.querySelector("#psgn-form > form div > button.train_Search.btnDefault[type='submit']");
      if (user_data.other_preferences.psgManual) {
         console.log("✎ Please submit manually!");
         submitButton.focus();
      } else {
         setTimeout(() => {
            submitButton.focus();
            submitButton.click();
            console.log("✓ Auto Submitted");
         }, 500);
      }
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

         const nameInput = passengers[i].querySelector("p-autocomplete > span > input");
         await typeTextHumanLike(nameInput, p.name);

         const ageInput = passengers[i].querySelector("input[type='number'][formcontrolname='passengerAge']");
         await typeTextHumanLike(ageInput, String(p.age));

         const genderSelect = passengers[i].querySelector("select[formcontrolname='passengerGender']");
         genderSelect.value = p.gender;
         genderSelect.dispatchEvent(new Event("change"));

         const berthSelect = passengers[i].querySelector("select[formcontrolname='passengerBerthChoice']");
         berthSelect.value = p.berth;
         berthSelect.dispatchEvent(new Event("change"));

         const foodSelect = passengers[i].querySelector("select[formcontrolname='passengerFoodChoice']");
         if (foodSelect) {
            foodSelect.value = p.food;
            foodSelect.dispatchEvent(new Event("change"));
         }
      }

      console.log("👬🏾 All Passenger Detail Filled !");

      if (user_data.other_preferences.mobileNumber !== "") {
         const mobileInput = passengerInput.querySelector("input#mobileNumber[formcontrolname='mobileNumber'][name='mobileNumber']");
         await typeTextHumanLike(mobileInput, user_data.other_preferences.mobileNumber);
         console.log("📞 Mobile Number Filled !");
      }

      const autoUpgradeCheckbox = passengerInput.querySelector("input#autoUpgradation[type='checkbox'][formcontrolname='autoUpgradationSelected']");
      if (autoUpgradeCheckbox) {
         autoUpgradeCheckbox.focus();
         await addDelay(7);
         autoUpgradeCheckbox.checked = !!user_data.other_preferences.autoUpgradation;
         console.log("✔ Auto Upgradation Checked !");
      }

      const confirmBerthsCheckbox = passengerInput.querySelector("input#confirmberths[type='checkbox'][formcontrolname='bookOnlyIfCnf']");
      if (confirmBerthsCheckbox) {
         confirmBerthsCheckbox.focus();
         await addDelay(7);
         confirmBerthsCheckbox.checked = !!user_data.other_preferences.confirmberths;
         console.log("✔ Only Confirmed Seat Checked !");
      }

      const insuranceRadios = [...passengerInput.querySelectorAll("p-radiobutton[formcontrolname='travelInsuranceOpted'] input[type='radio'][name='travelInsuranceOpted-0']")];
      await addDelay(200);
      insuranceRadios.filter(e => e.value === (user_data.travel_preferences.travelInsuranceOpted === "yes" ? "true" : "false"))[0]?.click();
      console.log("📝 Travel Insurance YES !");

      const paymentRadios = [...passengerInput.querySelectorAll("p-radiobutton[formcontrolname='paymentType'][name='paymentType'] input[type='radio']")];
      await addDelay(100);
      const paymentValue = (user_data.other_preferences.paymentmethod || "").includes("UPI") ? '2' : '1';
      paymentRadios.find(e => e.value === paymentValue)?.click();
      console.log("पे UPI Selected");

      submitPassengerDetailsForm(passengerInput);

   } catch (error) {
      console.error("Error in fillPassengerDetails:", error);
      window.alert("An error occurred while filling passenger details:\n" + error.message);
   }
})();