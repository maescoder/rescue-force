const ftp = require("basic-ftp");
const fs = require("fs");

async function upload() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        console.log("Connecting to FTP...");
        await client.access({
            host: "ftpupload.net",
            user: "if0_42096528",
            password: "ymslQZg2rgDuE",
            secure: false
        });
        
        console.log("Navigating to htdocs...");
        await client.cd("htdocs");
        
        console.log("Uploading API folder...");
        await client.ensureDir("api");
        await client.uploadFromDir("api");
        await client.cd("..");

        console.log("Uploading INC folder...");
        await client.ensureDir("inc");
        await client.uploadFromDir("inc");
        await client.cd("..");

        console.log("Uploading VENDOR folder...");
        await client.ensureDir("vendor");
        await client.uploadFromDir("vendor");
        await client.cd("..");

        console.log("Uploading PHP files...");
        const files = fs.readdirSync('.').filter(f => f.endsWith('.php'));
        for(let f of files) {
            console.log("Uploading " + f);
            await client.uploadFrom(f, f);
        }
        
        console.log("ALL FILES UPLOADED SUCCESSFULLY!");
    } catch(err) { 
        console.error("Upload failed:", err); 
    }
    client.close();
}

upload();
