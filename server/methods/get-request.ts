import { IncomingMessage, ServerResponse } from "http";

interface CustomRequest extends IncomingMessage {
    companies?: any[]; // Replace 'any' with the actual type of your companies array
}

export default (req: CustomRequest, res: ServerResponse): void => {
    let baseUrl = req.url?.substring(0, req.url.lastIndexOf("/") + 1);
    console.log(baseUrl);
    let id = req.url?.split("/")[3];
    const regex = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

    if (req.url === "/api/companies") { // Changed '/api/movies' to '/api/companies'
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(req.companies)); // Changed 'movies' to 'companies'
        res.end();
    } else if (!regex.test(id || "")) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                title: "Validation Failed",
                message: "UUID is not valid",
            })
        );
    } else if (baseUrl === "/api/companies/" && regex.test(id!)) { // Changed '/api/movies/' to '/api/companies/'
        const filteredCompany = req.companies?.filter((company) => { // Changed 'movies' to 'companies'
            return company.id === id;
        }) || [];

        if (filteredCompany.length > 0) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify(filteredCompany));
            res.end();
        } else {
            res.statusCode = 404;
            res.write(
                JSON.stringify({
                    title: "Not Found",
                    message: "Company not found", // Changed 'Movie' to 'Company'
                })
            );
            res.end();
        }
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ title: "Not Found", message: "Route Not found" }));
    }
};
