
const API_URL = "http://localhost:5190/api/logger"; 

export const sendLog = async (message) => {
    try {
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
           
            body: JSON.stringify(message), 
        });
    } catch (error) {
        console.error("Logging failed:", error);
    }
};