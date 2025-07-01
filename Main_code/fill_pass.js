(async function() 
{
    var user_data = _pax_data_;
    let keyCounter = 0x0;
    function submitPassengerDetailsForm(e) {
        console.log("✓ Passenger Filling Completed");
        if (user_data.other_preferences.psgManual) {
            console.log("PLz Manually submit !");
            btn = e.querySelector("#psgn-form > form div > button.train_Search.btnDefault[type='submit']")
            scrollToView(btn);
            btn.focus();
        } else {
            var keyCounter = new Date().getTime();
            var t = setInterval(function() {
                var o = new Date().getTime();
                if (o - keyCounter > 2000) {
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
    
    function highlightBlinkingLabel(labelText, blinkSpeed = 0.5) {
      const labels = document.querySelectorAll('label');
      labels.forEach(label => {
        if (label.textContent.trim() === labelText) {
          for (const node of label.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === labelText) {
              const span = document.createElement('span');
              span.className = 'blinking-highlight';
              span.textContent = labelText;
              label.replaceChild(span, node);
              break;
            }
          }
      if (!document.getElementById('blinking-style')) {
        const style = document.createElement('style');
        style.id = 'blinking-style';
        style.textContent = `
          @keyframes blinkColor {
            0%   { background-color: yellow; }
            50%  { background-color: red; }
            100% { background-color: yellow; }
          }
          .blinking-highlight {
            animation: blinkColor ${blinkSpeed}s infinite;
            padding: 2px 4px;
            border-radius: 4px;
            font-weight: bold;
            margin-left: 5px;
          }
        `;
        document.head.appendChild(style);
      }
    }
  });
}
    
    function waitForCheckboxToBeChecked(el) {
        return new Promise((resolve) => {
            if (!el) return resolve();
            scrollToView(el);
            el.focus();
            if (el.checked) return resolve();
            const onChange = () => {
                if (el.checked) {
                    el.removeEventListener('change', onChange);
                    resolve();
                }
            };
            el.addEventListener('change', onChange);
        });
    }

    function startVisualTimer(durationMs) {
      const timerDiv = document.createElement('div');
      timerDiv.style.position = 'fixed';
      timerDiv.style.top = '10px';
      timerDiv.style.left = '10px';
      timerDiv.style.backgroundColor = 'black';
      timerDiv.style.color = 'lime';
      timerDiv.style.fontSize = '18px';
      timerDiv.style.padding = '8px 12px';
      timerDiv.style.borderRadius = '8px';
      timerDiv.style.zIndex = '9999';
      timerDiv.style.fontFamily = 'monospace';
      timerDiv.textContent = `${Math.ceil(durationMs / 1000)}s`;
      document.body.appendChild(timerDiv);
    
      const startTime = Date.now();
      const interval = setInterval(() => {
        const remaining = Math.max(0, durationMs - (Date.now() - startTime));
        timerDiv.textContent = `${Math.ceil(remaining / 1000)}s`;
    
        if (remaining <= 0) {
          clearInterval(interval);
          timerDiv.remove();
            
          // Play a beep sound using Web Audio API
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
    
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz = A5
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    
          oscillator.start();
          oscillator.stop(ctx.currentTime + 0.5); // play for 0.5 seconds
        }
      }, 1000);
    }

    function scrollToView(el) {
        if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function humanDelay(min = 100, max = 250) {
        return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
    }

    try 
    {
        if (user_data.other_preferences.psgManual) {
            
            const delay = 30000; // 30 seconds
            const startTime = Date.now();
            startVisualTimer(delay);
            const btnInterval = setInterval(() => {
                const button = document.querySelector("#psgn-form > form > div > div.col-lg-9.col-md-9.col-sm-12.remove-padding > p-sidebar > div > div > div.pull-right > button");
                if (button) {
                    const elapsed = Date.now() - startTime;
                    button.disabled = true;
                
                    if (elapsed >= delay) {
                      button.disabled = false;
                    const style = document.createElement('style');
                    style.innerHTML = `
                     @keyframes blinkRedYellow {
                        0%   { background-color: red; }
                        50%  { background-color: yellow; }
                        100% { background-color: red; }
                     }
                     .blink-button {
                         animation: blinkRedYellow 0.3s infinite;
                     }`;
                     document.head.appendChild(style);
                     button.classList.add('blink-button');
                      clearInterval(btnInterval);
                    (() => { let clicked = false; if (button) { button.addEventListener('click', () => clicked = true); setTimeout(() => !clicked && button.click(), 4000); } })();
                    }
                }
            }, 300);
            
            const e = document.querySelector("app-passenger-input");
            if (!e) return alert("Not on the right page.");
            
            for (let i = 1; i < user_data.passenger_details.length; i++) {
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
                {await typeTextHumanLike(pnameInput, user_data.passenger_details[i].name);}
                const pageInput = el.querySelector("input[formcontrolname='passengerAge']");
                if(pageInput)
                {await typeTextHumanLike(pageInput, user_data.passenger_details[i].age);}
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
            
            let conf = e.querySelector("input#confirmberths");
            if (conf && user_data.other_preferences.confirmberths !== conf.checked){
                scrollToView(conf);
                highlightBlinkingLabel('Book only if confirm berths are allotted.', 0.3);
                await waitForCheckboxToBeChecked(conf);
                await humanDelay();
                console.log("✔ Only Confirmed Seat Checked !");
            }
            
            const method = user_data.other_preferences.paymentmethod.includes("UPI") ? '2' : '1';
            const payOptions = [...e.querySelectorAll("p-radiobutton[name='paymentType'] input")].find(q => q.value === method);
            if (payOptions) {
                const style = document.createElement('style');
                style.innerHTML = `
                @keyframes blinkRedYellow {
                  0%   { background-color: red; color: white; }
                  50%  { background-color: yellow; color: black; }
                  100% { background-color: red; color: white; }
                }
                .blink-label {
                  animation: blinkRedYellow 0.3s infinite;
                  padding: 4px;
                  border-radius: 4px;
                  display: inline-block;
                }
                `;
                document.head.appendChild(style);
                const label = payOptions.closest('label');
                  if (label) {
                    label.classList.add('blink-label');
                  }
                scrollToView(payOptions);
                console.log("Plz Select UPI");
            }
            console.log("Wait For CONTINUE To Blink");
        } else {
            const e = document.querySelector("app-passenger-input");
            if (!e) return alert("Not on the right page.");
            
            for (let i = 1; i < user_data.passenger_details.length; i++) {
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
                {await typeTextHumanLike(pnameInput, user_data.passenger_details[i].name);}
                const pageInput = el.querySelector("input[formcontrolname='passengerAge']");
                if(pageInput)
                {await typeTextHumanLike(pageInput, user_data.passenger_details[i].age);}
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
    
    
            if (user_data.other_preferences.mobileNumber) {
                let m = e.querySelector("input#mobileNumber");
                if (m) {
                    scrollToView(m);
                    await typeTextHumanLike(m, user_data.other_preferences.mobileNumber);
                    console.log("📞 Mobile Number Filled !");
                }
            }
    
    
             let upg = e.querySelector("input#autoUpgradation");
             if (upg && user_data.other_preferences.autoUpgradation !== upg.checked) {
                 scrollToView(upg);
                 upg.focus();
                 await humanDelay();
                 simulateClick(upg);
                 console.log("✔ Auto Upgradation Checked !");
                 await humanDelay();
             }
            
            let conf = e.querySelector("input#confirmberths");
            if (conf && user_data.other_preferences.confirmberths !== conf.checked){
                scrollToView(conf);
                //highlightBlinkingLabel('Book only if confirm berths are allotted.', 0.3);
                //console.log("Plz Check Manually");
                //await waitForCheckboxToBeChecked(conf);
                await humanDelay();
                simulateClick(conf);
                console.log("✔ Only Confirmed Seat Checked !");
            }
            
            const insVal = user_data.travel_preferences.travelInsuranceOpted === "yes" ? "true" : 'false';
            const ins = [...e.querySelectorAll("p-radiobutton[formcontrolname='travelInsuranceOpted'] input")].find(q => q.value === insVal);
            if (ins) { 
                scrollToView(ins);
                simulateClick(ins);
                console.log("📝 Travel Insurance YES !");            
            }
            
            const method = user_data.other_preferences.paymentmethod.includes("UPI") ? '2' : '1';
            const payOptions = [...e.querySelectorAll("p-radiobutton[name='paymentType'] input")].find(q => q.value === method);
            if (payOptions) {
                scrollToView(payOptions);
                console.log("Plz Select UPI");
                //highlightBlinkingLabel('Pay through BHIM/UPI', 0.3);
                payOptions.focus();
                await humanDelay();
                simulateClick(payOptions);
                console.log("पे UPI Selected");            
            }
            submitPassengerDetailsForm(e);
        }
    } catch (e) { alert("Script error: " + e.message);}
})();
