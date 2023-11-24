import { v4 as uuidv4 } from 'uuid';
import requestBodyParser from '../utils/body.parser';
import writeToFile from '../utils/write-to-file';
import { IncomingMessage, ServerResponse } from 'http';

interface CustomRequest extends IncomingMessage {
    companies?: Company[]; // Replace 'Company' with the actual type of your companies array items
}

interface CompanyRequestBody {
    id: string; // Make id a required property
    // other properties
}

interface Company {
    id: string;
    // other properties
}

export default async (req: CustomRequest, res: ServerResponse): Promise<void> => {
    if (req.url === '/api/companies') { // Changed '/api/movies' to '/api/companies'
        try {
            let body: CompanyRequestBody = (await requestBodyParser(req)) as CompanyRequestBody;
            body.id = uuidv4();
            req.companies = req.companies || [];
            req.companies.push(body as Company); // Cast body to Company
            writeToFile(req.companies);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end();
        } catch (err) {
            console.log(err);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(
                JSON.stringify({
                    title: 'Validation Failed',
                    message: 'Request body is not valid',
                })
            );
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ title: 'Not found', message: 'Route not found' }));
    }
};
