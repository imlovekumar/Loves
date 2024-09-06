import {IRCTC} from "irctc-api";
const params = {
    "ManualCaptcha" : "t",
    "userID": "PPK01", // Secret User ID
    "password": "9024", // Secret Password
    "pnr":"0123456789" // PNR Number
};
const irctc = new IRCTC();
const response = await irctc.pnr_status(params);
console.log(response);