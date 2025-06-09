import express from "express";
import fs from "fs";
import lodash from "lodash";
import path from "path";
import { uploadsDir } from "../middleware/multer.js";

const router = express.Router();

router.get("/single", (req, res) => {
    const uploadArray = fs.readdirSync(uploadsDir);
    const randomFile = lodash.sample(uploadArray);
    if (!randomFile) {
        return res.status(503).json({ message: "Empty directory" });
    }
    res.sendFile(path.join(uploadsDir, randomFile));
});

router.get("/multiple", (req, res) => {
    const uploadArray = fs.readdirSync(uploadsDir);
    const randomFiles = lodash.sampleSize(uploadArray, 3);
    if (!randomFiles) {
        return res.status(503).json({ message: "Empty directory" });
    }
    // res.sendFile(path.join(uploadsDir, randomFile));// This will not work anymore
    res.json(randomFiles);
});

// setup a helper function to fetch the files
router.get("/file/:filename", (req, res) => {
    res.sendFile(path.join(uploadsDir, "../uploads", req.params.filename));
});

export default router;
