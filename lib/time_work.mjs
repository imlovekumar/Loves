import logUpdate from 'log-update';
import chalk from 'chalk';


function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}



async function get_current_time_api(zone="utc")
{
    if (zone === "utc")
    {
        var newt = new Date();
        var nnewt = newt.toISOString();
        return nnewt;
    }
}

const psg_input_await = 
{
    
    1:20000,
    2:20000,
    3:25000,
    4:25000,
    5:30000,
    6:30000,
}

async function psg_input_wait(psg_count)
{
    const sleep_time = psg_input_await[psg_count];
    //console.log('Number of Passenger -',psg_count,'\n');
    for (let i=sleep_time* 0.001 ; i>=1;i=i-1)
        { 
            logUpdate(chalk.greenBright(`Passenger Detail Submitting In`,chalk.red(`${i}`), `seconds ....`));
            await sleep(1000);
        };
    logUpdate.clear()
}

async function sleep_for_login(ticket_time)
{
    if (ticket_time === 1)
    {
        const date_time_string = await get_current_time_api();
        const currentTime = new Date(date_time_string);
        const targetTime = new Date(currentTime);
        targetTime.setUTCHours(4, 28, 0, 0);
        if (currentTime < targetTime) 
        {
            const balance_time = targetTime - currentTime;
            console.log('');
            for (let i=balance_time* 0.001 ; i>=1;i=i-1)
            {
                logUpdate(chalk.whiteBright(`\n Login @ (09:58 AM) - AC Class\n`,`Wait For`,chalk.red(`${i}`),`seconds to proceed for login...`));
                await sleep(1000);
            };
            return "Proceeding to Login";
        }
        else
        {
            return "No Sleep Required";
        }
    }
    else if (ticket_time === 2)
    {
        const date_time_string = await get_current_time_api();
        const currentTime = new Date(date_time_string);
        let targetTime = new Date(currentTime);
        targetTime.setUTCHours(5, 28, 0, 0);
        if (currentTime < targetTime) 
        {
            const balance_time = targetTime - currentTime;
            console.log('');
            for (let i=balance_time* 0.001 ; i>=1;i=i-1)
            {
                logUpdate(chalk.whiteBright(`\n Login @ (10:58 AM) - SL Class\n`,`Wait For`,chalk.red(`${i}`),`seconds to proceed for login...`));
                await sleep(1000);
            };
            return "Proceeding to Login";
        }
        else
        {
            return "No Sleep Required";
        }
    }
    else{
        return "No Sleep Required";
    }
}

async function sleep_for_availability_check(ticket_time){
    if (ticket_time === 1){
        const date_time_string = await get_current_time_api();
        const currentTime = new Date(date_time_string);
        let targetTime = new Date(currentTime);
        targetTime.setUTCHours(4,29, 57, 1);
        if (currentTime < targetTime) {
            const balance_time = targetTime - currentTime;           
            for (let i=balance_time* 0.001 ; i>=1;i=i-1)
                { 
                    logUpdate(`Availability Check In ${i} seconds ...`);
                    await sleep(1000);
                };          
           
            return "Proceeding to Check Availability";
        }
        else{
            return "No Sleep Required";
        }
    }
    else if (ticket_time === 2){
        const date_time_string = await get_current_time_api();
        const currentTime = new Date(date_time_string);
        let targetTime = new Date(currentTime);
        targetTime.setUTCHours(5, 29, 57, 1);
        if (currentTime < targetTime) {
            const balance_time = targetTime - currentTime;
            for (let i=balance_time* 0.001 ; i>=1;i=i-1)
                { 
            logUpdate(`Availability Check In ${i} seconds ...`);
            await sleep(1000);
                };          
            return "Proceeding to Check Availability";
        }
        else{
            return "No Sleep Required";
        }
    }
    else{
        return "No Sleep Required";
    }
}

async function start_before_3_minutes(ticket_time){
    if (ticket_time === 1) {
        const date_time_string = await get_current_time_api();
        const currentTime = new Date(date_time_string);
        let targetTime = new Date(currentTime);
        targetTime.setUTCHours(4, 27, 0, 0);
        let stoptime = new Date(currentTime);
        stoptime.setUTCHours(18, 30, 0, 0);
        if (currentTime < targetTime || currentTime > stoptime) {
            throw new Error("Please Start the booking after 09:57:00.000 AM IST");
               
        }
        else{
            return "Proceeding to Book Tickets";
        }
    }
    else if (ticket_time === 2) {
        const date_time_string = await get_current_time_api();
        const currentTime = new Date(date_time_string);
        let targetTime = new Date(currentTime);
        targetTime.setUTCHours(5, 27, 0, 0);
        let stoptime = new Date(currentTime);
        stoptime.setUTCHours(18, 30, 0, 0);
        if (currentTime < targetTime || currentTime > stoptime) {
            throw new Error("Please Start the booking after 10:57:00.000 AM IST");
        }
        else{
            return "Proceeding to Book Tickets";
        }
    }
    else{
        return "Proceeding to Book Tickets";
    }
}

async function ticket_120days()
    {
        const date_time_string = await get_current_time_api();
        const currentTime = new Date(date_time_string);
        let targetTime = new Date(currentTime);
        targetTime.setUTCHours(8,30, 1, 0);
        if (currentTime < targetTime) {
            const balance_time = targetTime - currentTime;           
            for (let i=balance_time* 0.001 ; i>=1;i=i-1)
                { 
                    logUpdate(`Availability Check In ${i} seconds ...`);
                    await sleep(1000);
                };          
           
            return "Proceeding to Check Availability";
        }
        else{
            return "No Sleep Required";
        }
    }


export {sleep, psg_input_wait, sleep_for_login, sleep_for_availability_check, start_before_3_minutes,get_current_time_api};