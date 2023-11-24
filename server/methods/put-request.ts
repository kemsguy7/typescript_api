import requestBodyParser from "../utils/body.parser";
import writeToFile from "../utils/write-to-file";
import { IncomingMessage, ServerResponse } from "http";

interface CustomRequest extends IncomingMessage {
    companies?: any[]; // Replace 'any' with the actual type of your companies array
}

export default async (req: CustomRequest, res: ServerResponse): Promise<void> => {
    let baseUrl = req.url?.substring(0, req.url.lastIndexOf("/") + 1);
    let id = req.url?.split("/")[3];
    const regexV4 = new RegExp(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    );

    if (!regexV4.test(id || "")) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                title: "Validation Failed",
                message: "UUID is not valid",
            })
        );
    } else if (baseUrl === "/api/companies/" && regexV4.test(id || "")) {
        try {
            let body = await requestBodyParser(req);
            const index = req.companies?.findIndex((company) => {
                return company.id === id;
            }) ?? -1;

            if (index === -1) {
                res.statusCode = 404;
                res.write(
                    JSON.stringify({ title: "Not Found", message: "Company not found" })
                );
                res.end();
            } else {
                // Update updatedAt dynamically
                const updatedAt = new Date().toISOString();
                req.companies![index] = { id, ...body, updatedAt };
                
                writeToFile(req.companies || []);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(req.companies![index]));
            }
        } catch (err) {
            console.log(err);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    title: "Validation Failed",
                    message: "Request body is not valid",
                })
            );
        }
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ title: "Not Found", message: "Route not found" }));
    }
};
