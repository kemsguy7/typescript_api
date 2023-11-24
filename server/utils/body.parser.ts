import { IncomingMessage } from "http";

const requestBodyParser = async (request: IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        let body = " ";

        request.on("data", (chunk) => { 
            body += chunk;
        });

        request.on("end", () => {
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });

        // Handle errors during the request
        request.on("error", (err) => {
            console.log(err);
            reject(err);
        });
    });
};

export default requestBodyParser;
