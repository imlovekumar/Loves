(function() {
  // define helper functions here if needed

  function train_list() {
    // your captcah Script here
        __train_list__
  }

  function psgninput() {
    // your captcah Script here
        __psgninput__
  }

  function final_captcha() {
    // your captcah Script here
        __final_captcha__
  }

  function select_pay() {
    // your select pay script here
        __select_pay__
  }

  function createFloatingTimer() {
      if (document.getElementById('floating-timer')) return;
    
      const timer = document.createElement('div');
      timer.id = 'floating-timer';
      timer.style.position = 'fixed';
      timer.style.top = '20px';
      timer.style.right = '20px';
      timer.style.padding = '10px 15px';
      timer.style.background = 'rgba(0,0,0,0.7)';
      timer.style.color = '#fff';
      timer.style.fontFamily = 'monospace';
      timer.style.fontSize = '16px';
      timer.style.borderRadius = '5px';
      timer.style.zIndex = 99999;
    
      document.body.appendChild(timer);
    
      let seconds = 0;
    
      setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timer.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }, 1000);
    }

  function removeFloatingTimer() {
    const timer = document.getElementById('floating-timer');
    if (timer) timer.remove();
  }


  // Flags to prevent re-execution
  window.hasRuntrain_list = window.hasRuntrain_list || false;
  window.hasRunpsgninput = window.hasRunpsgninput || false;
  window.hasRunFinalCaptcha = window.hasRunFinalCaptcha || false;  
  window.hasRunSelectPay = window.hasRunSelectPay || false;
  

  function checkPage() {
    const url = window.location.href;

    if (url.includes('train-list') && !window.hasRuntrain_list ) {
      window.hasRuntrain_list = true;
      train_list();
    } 
    else if (url.includes('psgninput') && !window.hasRunpsgninput ) {
      window.hasRunpsgninput = true;
      createFloatingTimer();
      psgninput();
    } 
    else if (url.includes('reviewBooking') && !window.hasRunFinalCaptcha ) {
      window.hasRunFinalCaptcha = true;
      removeFloatingTimer();
      final_captcha();
    } 
    else if (url.includes('bkgPaymentOptions') && !window.hasRunSelectPay ) {
      window.hasRunSelectPay = true;
      select_pay();
    }
  }
  // Watch every second
  if (!window.myCheckInterval) {
      window.myCheckInterval = setInterval(checkPage, 1000);
  }

  // Also re-check on every page load
  window.addEventListener('load', function() {
      console.log("Page reloaded — re-checking page");
      checkPage();
  });

})();
