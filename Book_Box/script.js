javascript: (d => {
    if (document.getElementById('bmr')) return;
    d.id = 'bmr';
    d.style = 'all:initial;position:fixed;inset:0;z-index:2147483647';
    let r = d.attachShadow({
        mode: 'open'
    });
    r.innerHTML = `<style>*{box-sizing:border-box;margin:0;font:16px monospace}.o{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}.b{display:flex;flex-direction:column;gap:8px;width:90vw;max-width:400px;padding:14px;background:rgb(12,18,34);border:1px solid rgb(94,214,255);border-radius:8px;color:white}.h{display:flex;justify-content:space-between;font-weight:700}textarea{height:120px;padding:10px;color:white;background:rgb(30,40,60);border:1px solid gray;border-radius:6px;resize:none}.r{display:flex;gap:6px}button{flex:1;padding:11px;color:white;background:rgb(30,40,60);border:1px solid gray;border-radius:6px}.k{flex:2;background:green}small{color:gray}</style><div class=o><div class=b><div class=h>RUN AUTOMATION</div><textarea placeholder="Paste here" autocapitalize=off autocorrect=off spellcheck=false></textarea><div class=r><button class=k>SUBMIT</button><button class=p>PASTE</button><button class=c>CLEAR</button></div><small></small></div></div>`;
    let q = s => r.querySelector(s),
        t = q('textarea'),
        n = q('small'),
        x = () => d.remove();
    t.oninput = () => n.textContent = t.value.length + ' chars';
    q('.o').onclick = e => e.target == q('.o') && x();
    q('.k').onclick = () => {
        let c = t.value.trim().replace(/^javascript:/i, '');
        if (!c) return n.textContent = 'Nothing to run';
        x();
        try {
            (0, eval)(c)
        } catch (e) {
            try {
                if (e.name != 'SyntaxError') throw e;
                (0, eval)(decodeURIComponent(c))
            } catch (f) {
                alert(f)
            }
        }
    };
    q('.p').onclick = async () => {
        try {
            t.value = await navigator.clipboard.readText();
            t.oninput()
        } catch (e) {
            n.textContent = 'Paste blocked'
        }
    };
    q('.c').onclick = () => {
        t.value = '';
        t.oninput();
        t.focus()
    };
    document.documentElement.append(d);
    t.focus();
    t.oninput()
})(document.createElement('div'))