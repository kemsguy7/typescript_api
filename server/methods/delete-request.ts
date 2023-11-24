import { IncomingMessage, ServerResponse } from "http";
import writeToFile from "../utils/write-to-file";

interface CustomRequest extends IncomingMessage {
    companies?: any[]; // Replace 'any' with the actual type of your companies array
}

export default (req: CustomRequest, res: ServerResponse): void => {
    let baseUrl = req.url?.substring(0, req.url.lastIndexOf("/") + 1);
    console.log(baseUrl);
    let id = req.url?.split("/")[3];
    const regex = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

    if (!regex.test(id || "")) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                title: "Validation Failed",
                message: "UUID is not valid",
            })
        );
    } else if (baseUrl === "/api/companies/" && regex.test(id!)) { // Changed '/api/movies/' to '/api/companies/'
        const index = req.companies?.findIndex((company) => { // Changed 'movies' to 'companies'
            return company.id === id;
        });

        if (index === -1) {
            res.statusCode = 404;
            res.write(
                JSON.stringify({ title: "Not Found", message: "Company not found" }) // Changed 'Movie' to 'Company'
            );
            res.end();
        } else {
            req.companies?.splice(index !== undefined ? index : 0, 1); // Changed 'movies' to 'companies'
            writeToFile(req.companies || []); // Changed 'movies' to 'companies'
            res.writeHead(204, { "Content-Type": "application/json" });
            res.end(JSON.stringify(req.companies));
        }
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ title: "Not Found", message: "Route Not found" }));
    }
};
