const fs = require("fs");
const path = require("path");

 const writeToFile = (data : any) => {
    console.log("the data to write in the file : ", data)
    console.log(data);
    try {
        fs.writeFileSync(
            path.join(
                __dirname,
              //  "..",
                "../",
                "database.json"), //path completed
                JSON.stringify(data),
                "utf-8"
            );
        
    }catch(err) {
        console.log(err)
    }
}

export default writeToFile;

