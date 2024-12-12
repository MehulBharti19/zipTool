const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const app = express();
const PORT = 3000;

const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

app.post("/upload", upload.array("files"), async (req, res) => {
    try {
        const files = req.files;
        const compressedFolder = path.join(__dirname, "compressed");

        if (!fs.existsSync(compressedFolder)) {
            fs.mkdirSync(compressedFolder);
        }

        const zipPath = path.join(compressedFolder, "compressed_files.zip");
        const output = fs.createWriteStream(zipPath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        output.on("close", () => {
            res.json({ downloadUrl: "/compressed/compressed_files.zip" });
        });

        archive.on("error", (err) => {
            throw err;
        });

        archive.pipe(output);

        for (const file of files) {
            const filePath = path.join(__dirname, file.path);
            archive.append(fs.createReadStream(filePath), { name: file.originalname });
        }

        archive.finalize();
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while processing your files.");
    }
});

app.use("/compressed", express.static(path.join(__dirname, "compressed")));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
