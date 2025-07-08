(async () => {
    // === Configuration ===
    const config = {
        selectors: {
            loginButton: "a.search_btn.loginText.ng-star-inserted",    // Button that opens the login form
            username: "input[formcontrolname='userid']",                // Username input field
            password: "input[formcontrolname='password']"             // Password input field
        },
        values: {
            username: '__USERNAME__',        // Set your actual username
            password: '__PASSWORD__'        // Set your actual password
        },
        typingOptions: {
            minDelay: 5,                  // Minimum typing delay per character (ms)
            maxDelay: 10                   // Maximum typing delay per character (ms)
        },
        timeouts: {
            elementWait: 10000,            // Max wait time for elements to appear (ms)
            afterTypingDelay: 50          // Delay after typing each field (ms)
        }
    };

    // === Utility: Wait for element ===
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(`⏱ Timeout: ${selector} not found`);
            }, timeout);
        });
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

    // === Utility: Simulate human-like typing ===
    function simulateTyping(el, text, options = {}) {
        const { minDelay = 20, maxDelay = 40 } = options;
        const triggerKey = (type, char) => {
            const evt = new KeyboardEvent(type, {
                key: char,
                bubbles: true,
                cancelable: true
            });
            el.dispatchEvent(evt);
        };
        const triggerInput = () => {
            el.dispatchEvent(new Event('input', { bubbles: true }));
        };
        return (async () => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.focus({ preventScroll: true });
            el.value = '';
            for (const char of text) {
                triggerKey('keydown', char);
                triggerKey('keypress', char);
                el.value += char;
                triggerInput();
                triggerKey('keyup', char);
                await new Promise(res => setTimeout(res, minDelay + Math.random() * (maxDelay - minDelay)));
            }
        })();
    }

    function search_train() {
        __FIND_TRAIN__
    }

    function launchCelebration() {
  // Load confetti script if not already loaded
  if (typeof confetti === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    script.onload = () => {
      confetti({
        particleCount: 400,
        spread: 70,
        origin: { y: 0.6 }
      });
    };
    document.body.appendChild(script);
  } else {
    confetti({
      particleCount: 400,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}


    async function captcha_logic() {
        __CAPTCHA__
    }

    function continueScript() {
        const selector = "body > app-root > app-home > div.header-fix > app-header > div.col-sm-12.h_container > div.text-center.h_main_div > div.row.col-sm-12.h_head1 > a.search_btn.loginText.ng-star-inserted";
        const observer = new MutationObserver(() => {
        const loginBtn = document.querySelector(selector);
        if (!loginBtn) return;    
        const text = loginBtn.innerText.trim().toUpperCase();    
        if (text === "LOGOUT" && window.location.href.includes("train-search")) {
            observer.disconnect(); // Stop observing after detecting logout
            console.log("✔ Login Successfully...");
            launchCelebration();
            search_train();
        }
      });    
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    function scrollToView(el) {
        if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // === Main Automation Flow (Up to password only) ===
    (async () => {
        try {
            document.querySelector('button[aria-label*="Aadhaar authenticated"]')?.click();            
            const { loginButton, username, password,captchaInput } = config.selectors;
            const { username: unameVal, password: pwdVal} = config.values;
            const { elementWait, afterTypingDelay } = config.timeouts;

            // 1. Click login button
            const loginBtn = await waitForElement(loginButton, elementWait);
            await simulateClick(loginBtn);

            document.querySelectorAll('img[src*="contents.irctc.co.in"]').forEach(el => el.remove());
            document.querySelector('[id^="google_ads_iframe_"][id*="IRCTC_LOGIN_CAPTCHA"]')?.remove();

                        
            // 2. Type username
            const userEl = await waitForElement(username, elementWait);
            await simulateTyping(userEl, unameVal, config.typingOptions);
            await new Promise(res => setTimeout(res, afterTypingDelay));

            // 3. Type password
            const passEl = await waitForElement(password, elementWait);
            await simulateTyping(passEl, pwdVal, config.typingOptions);
            await new Promise(res => setTimeout(res, afterTypingDelay));

            // 4. Log: now solve CAPTCHA
            console.log('✔ Username & password filled.');
            await captcha_logic();
            continueScript();            
        } catch (err) {
            console.error('❌ Automation error:', err);
        }
    })();
})();
