(function() {
    // ✅ List of fallback pairs in priority order
    const paymentPairs = [
    { group: "BHIM/ UPI/ USSD", option: "Pay using BHIM (Powered by PAYTM ) also accepts UPI" },
    { group: "Multiple Payment Service", option: "Credit & Debit cards / Wallet / UPI (Powered by PhonePe)" },
    { group: "Multiple Payment Service", option: "Credit & Debit cards / Net Banking / Wallet / UPI (Powered by Paytm)" },            
    { group: "IRCTC iPay (Credit Card/Debit Card/UPI)", option: "Credit cards/Debit cards/Netbanking/UPI (Powered by IRCTC)" },
    // ➜ Add more pairs as needed
    ];

    let currentIndex = 0;

    // ✅ Try selecting the current pair
    function trySelectPair() {
        if (currentIndex >= paymentPairs.length) {
            console.log("No matching payment options found. Please select manually.");
            return;
        }

        const { group: paymentGroup, option: paymentOption } = paymentPairs[currentIndex];
        console.log(`Trying: ${paymentGroup} > ${paymentOption}`);

        let groups = document.getElementById("pay-type")?.getElementsByTagName("div") || [];
        let groupFound = false;

            for (let group of groups) {
                if (group.innerText.includes(paymentGroup)) {
                simulateClick(group);
                console.log(paymentGroup, "Selected!");
                groupFound = true;

                setTimeout(() => {
                    let methods = document.getElementsByClassName("border-all no-pad");
                    let found = false;

                    for (let method of methods) {
                    let label = method.querySelector("span")?.innerText || "";
                    if (method.getBoundingClientRect().top !== 0 &&
                        label.trim().toUpperCase() === paymentOption.trim().toUpperCase()) {
                        simulateClick(method);
                        console.log(paymentOption, "Selected!");
                        found = true;

                        let payButton = document.querySelector(".btn-primary");
                        if (payButton) {
                        payButton.scrollIntoView({ behavior: "smooth", block: "center" });
                        setTimeout(() => {
                            console.log("Auto Pay & Book Clicked!");
                            simulateClick(payButton);
                        }, 1000);
                        }
                        break;
                    }
                    }

                    if (!found) {
                    console.log(paymentOption, "Not found in", paymentGroup, "— trying next pair...");
                    currentIndex++;
                    trySelectPair();
                    }

                }, 500);

                break; // stop searching other groups
                }
            }

            if (!groupFound) {
                console.log(paymentGroup, "not found — trying next pair...");
                currentIndex++;
                trySelectPair();
            }
    }

    // ✅ Wait until payment section is loaded
    const interval = setInterval(() => {
    if (document.getElementsByClassName("bank-type").length > 1) {
        clearInterval(interval);
        trySelectPair();
    }
    }, 500);

    // ✅ Human-like click helper (your version)
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
})();
