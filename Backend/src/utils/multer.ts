import multer from "multer";
import path from "path";

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const normalizeMimeType = (mimeType?: string) => mimeType?.toLowerCase() || "";
const isMimeTypeAllowed = (mimeType: string, allowedPrefixes: string[]) => {
  const normalizedMimeType = normalizeMimeType(mimeType);
  return allowedPrefixes.some((prefix) => normalizedMimeType.startsWith(prefix));
};

const isAllowedExtension = (fileExt: string, allowedExtensions: string[]) =>
  allowedExtensions.includes(fileExt);

// file filter (sirf audio allow)
const fileFilter = (req: any, file: any, cb: any) => {
  const audioExtensions = [".mp3", ".wav", ".m4a", ".ogg", ".webm", ".flac", ".aac"];
  const imageExtensions = [".jpeg", ".jpg", ".png", ".webp"];
  const fileExt = path.extname(file.originalname || "").toLowerCase();
  const mimeType = normalizeMimeType(file.mimetype);

  if (file.fieldname === "file") {
    const isAudio =
      isMimeTypeAllowed(mimeType, ["audio/"]) || isAllowedExtension(fileExt, audioExtensions);

    if (isAudio) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Only audio files are allowed for the song file. Supported formats: ${audioExtensions.join(", ")}`,
        ),
        false,
      );
    }
  } else if (file.fieldname === "coverImage" || file.fieldname === "avatar") {
    const isImage =
      isMimeTypeAllowed(mimeType, ["image/"]) || isAllowedExtension(fileExt, imageExtensions);

    if (isImage) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Only image files are allowed for cover image. Supported formats: ${imageExtensions.join(", ")}`,
        ),
        false,
      );
    }
  } else {
    cb(new Error("Unexpected field"), false);
  }
};

// image filter for playlist covers
const imageFilter = (req: any, file: any, cb: any) => {
  const imageExtensions = [".jpeg", ".jpg", ".png", ".webp"];
  const fileExt = path.extname(file.originalname || "").toLowerCase();
  const mimeType = normalizeMimeType(file.mimetype);
  const isImage =
    isMimeTypeAllowed(mimeType, ["image/"]) || isAllowedExtension(fileExt, imageExtensions);

  if (isImage) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
});

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
});
