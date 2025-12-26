
export function convertToLocalDateString(dateString) {
    // console.log(dateString);
    
    const formattedDate = new Date(dateString).toISOString().slice(0, 10);
    return formattedDate;
}
