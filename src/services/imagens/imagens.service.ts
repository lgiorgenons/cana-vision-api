import { Storage } from "@google-cloud/storage";

const storage = new Storage();
const bucketName = "atmos-agro-data-lake-dev";

export class ImagensService {
  async listTiffImages(prefix = "processed/") {
    const [files] = await storage
      .bucket(bucketName)
      .getFiles({ prefix });

    return Promise.all(
      files
        .filter(f => f.name.match(/\.(tif|tiff)$/i))
        .map(async f => {
          const [url] = await f.getSignedUrl({
            version: "v4",
            action: "read",
            expires: Date.now() + 15 * 60 * 1000,
          });

          return {
            name: f.name,
            url,
          };
        })
    );
  }
}
