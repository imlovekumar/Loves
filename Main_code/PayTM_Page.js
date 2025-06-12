(function(){
  
  const user_data = 
  {
    vpa: { vpa: "__your_UPI__" },
    other_preferences: { paymentmethod: "PAYTMUPIID" }
  };

  function simulateClick(element) {
        if (element && typeof element.dispatchEvent === "function") {
            if (typeof element.focus === "function") 
            {
                try {  element.focus();    }
                catch (err) { console.warn("Could not focus element before click:", element, err.message);    }
            }
            if (element.disabled) {   console.warn("Attempted to click on a disabled element:", element); return; }
            const mouseDown = new MouseEvent("mousedown", { bubbles: true, cancelable: true, view: window, button: 0 });
            const mouseUp = new MouseEvent("mouseup", { bubbles: true, cancelable: true, view: window, button: 0 });
            const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true, view: window, button: 0 });
            element.dispatchEvent(mouseDown);
            element.dispatchEvent(mouseUp);
            element.dispatchEvent(clickEvent);
        } else { console.warn("Invalid element for simulateClick:", element);    }
    }

  function updateTextChange(elem, value) 
  {
    elem.dispatchEvent(new Event("keydown", { bubbles: true }));
    elem.value = value;
    elem.dispatchEvent(new Event("keyup", { bubbles: true }));
    elem.dispatchEvent(new Event("input", { bubbles: true }));
    elem.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function waitForPtmUpi(n = 0) 
  {
    if (n >= 100) {
      console.warn("ptm-upi element not found after 50 seconds.");
      alert("Unable to request UPI payment. Please proceed manually");
      return;
    }
    const upiTab = document.getElementById("ptm-upi")?.querySelectorAll("div")[1]?.querySelectorAll("div")[0];
    if (!upiTab) {
      console.log(`ptm-upi tab not ready (attempt ${n + 1}). Retrying...`);
      return setTimeout(() => waitForPtmUpi(n + 1), 500);
    }
    console.log("ptm-upi tab found, clicking...");
    simulateClick(upiTab);
    proceedToFill();
  }

  function proceedToFill() 
  {
    console.log("Fill paytm VPA-after click");
    const tt = setInterval(function() {
      if (document.getElementsByName("upiMode").length > 0) {
        clearInterval(tt);
        const tt2 = setInterval(function() {
          const elem = document.getElementsByName("upiMode")[0]
            ?.parentNode?.parentNode?.parentNode?.getElementsByTagName("input")[1];
          if (elem != null) {
            clearInterval(tt2);
            updateTextChange(elem, user_data.vpa.vpa);
            setTimeout(function() {
              try {
                const proceedButton = document.evaluate("//span[text()='Proceed']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                console.log("click proceedButton");
                simulateClick(proceedButton);
              } catch (err) {
                console.error(err);
                alert("Unable to request UPI payment. Please proceed manually");
              }
            }, 500);
          }
        }, 100);
      }
    }, 500);
  }

  if (user_data.other_preferences.paymentmethod === "PAYTMUPIID") 
  {
    if (document.readyState !== "loading") 
    {
      waitForPtmUpi();
    }
    else
    {
      document.addEventListener("DOMContentLoaded", waitForPtmUpi);
    }
  }
})();
