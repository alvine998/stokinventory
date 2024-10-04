import moment from "moment";

export const toMoney = (number: number) => {
    // Check if the input is a valid number
    if (isNaN(number)) {
        throw new Error("Input must be a valid number");
    }

    // Convert the number to a string with two decimal places
    let price = number?.toFixed(0);

    // Add comma as thousands separator
    price = price?.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Add the currency symbol
    return `${price}`;
}

export const generateTrxCode = (lastCode: any) => {
    let today = moment().format("YYYYMMDD")
    let increment = String(lastCode?.slice(0, 8) == `${today}` ? lastCode?.slice(9, 11) : 1).padStart(3, '0');
    const trx_code = `${today}${increment}`
    return trx_code
}