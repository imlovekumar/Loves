import axios from 'axios';
import chalk from 'chalk';
import logUpdate from 'log-update';


//Free Captcha API
async function decode(captchaQuestion){
    const postdata ={"img": captchaQuestion};
    logUpdate(chalk.yellow('Decoding Captcha...'));
    const response = await axios.post(
        'https://backend.ocreditor.com/api/image/text',
        postdata,
        {
            "Reqable-Id": "",
            "Host": "backend.ocreditor.com",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/128.0.6613.92 Mobile/15E148 Safari/604.1",
            "Connection": "keep-alive",
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Content-Type": "application/json",
            "Content-Length": "",
            "Sec-Fetch-Site": "same-site",
            "Accept-Language": "en-IN,en-GB;q=0.9,en;q=0.8",
            "Sec-Fetch-Mode": "cors",
            "Origin": "https://ocreditor.com",
            "Referer": "https://ocreditor.com/",
            "Sec-Fetch-Dest": "empty"
          }
    );
    const raw = response.data.data[0];
    logUpdate(chalk.green('Captcha Decoded successfully ✓'));
    const final = raw.replaceAll(" ","");        
    return(final);
}


//TrueCaptcha API
async function premdecode(captchaQuestion){
    const postdata =
    {
        userid:'imlovekumar',
        apikey:'bQbpPoxRsIzLCFaU2t7W',
        data:  captchaQuestion,
    };
    logUpdate(chalk.yellow('Decoding Captcha...'));
    const response = await axios.post(
        'https://api.apitruecaptcha.org/one/gettext',
        postdata,
        {
            "User-Agent": "Vivaldi/1.15",
        }
    );
    const final = response.data.result;
    return(final);
}

export {decode,premdecode};

/* This Is the code for add in working file itself

        async decode(){
        const postdata ={"images":this.captchaQuestion};
        logUpdate(chalk.yellow('Decoding Captcha...'));
        const response = await this.axios_instance.post(
            'https://www.imagetotext.cc/file-upload-data',
            postdata,
            {
                "User-Agent": "Vivaldi/1.15",
            }
        );
        const raw = response.data.text;
        const final = raw.replaceAll("\n","").replaceAll(" ","");        
        return(final);
    }

    async premdecode(){
        const postdata ={userid:'imlovekumar',
            apikey:'bQbpPoxRsIzLCFaU2t7W',
            data:  this.captchaQuestion,};
        logUpdate(chalk.yellow('Decoding Captcha...'));
        const response = await this.axios_instance.post(
            'https://api.apitruecaptcha.org/one/gettext',
            postdata,
            {
                "User-Agent": "Vivaldi/1.15",
            }
        );
        const final = response.data.result;
        return(final);
    }
*/
