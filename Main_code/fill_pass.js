(async function() 
{
    var user_data = _pax_data_;
    function submitPassengerDetailsForm(e) 
    {
        console.log("✓ Passenger Filling Completed");
        addDelay(200);
        e.querySelector("#psgn-form > form div > button.train_Search.btnDefault[type='submit']")?.click();
        console.log("✓ Auto Submitted");
    }
    
    function addDelay(ms) { 
        return new Promise(resolve => setTimeout(resolve, ms)); 
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
        let passengers = [...passengerInput.querySelectorAll("app-passenger")];
        // Fill passenger details
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

        // Set payment type
        const paymentRadios = [...passengerInput.querySelectorAll("p-radiobutton[formcontrolname='paymentType'][name='paymentType'] input[type='radio']")];
        addDelay(100);
        const paymentValue = (user_data.other_preferences.paymentmethod || "").includes("UPI") ? '2' : '1';
        paymentRadios.find(e => e.value === paymentValue)?.click();
        console.log("पे UPI Selected");
        
        // Submit the form
        submitPassengerDetailsForm(passengerInput);
    } catch (error) {
        console.error("Error in fillPassengerDetails:", error);
        window.alert("An error occurred while filling passenger details:\n" + error.message);
    }
})();
