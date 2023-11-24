const fs = require("fs");
const path = require("path");

const writeToFile = (data: any[]) => {
    console.log("the data to write in the file: ", data);
    console.log(data);
    try {
        const enrichedData = data.map((item: { createdAt: string; }) => {
            // Check if 'createdAt' property exists, if not add it with the current timestamp
            if (!item.createdAt) {
                item.createdAt = new Date().toISOString();  //create a new date ISO string
            }
            return item;
        });

        fs.writeFileSync(
            path.join(__dirname, "../", "database.json"),
            JSON.stringify(enrichedData),
            "utf-8"
        );

    } catch (err) {
        console.log(err);
    }
};

export default writeToFile;
