import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { extractFilename, getCanvas, getCanvasToken } from "../utils";
import axios from "axios";

export const canvasRoute = new Hono()
  .get(
    "/view",
    zValidator("query", z.object({ id: z.string() })),
    async (c) => {
      const query = c.req.valid("query");
      const canvasToken = await getCanvasToken();
      const id = query.id.startsWith("spotify:track:")
        ? query.id
        : `spotify:track:${query.id}`;
      const canvasResponse = await getCanvas(id, canvasToken ?? "");
      if (!canvasResponse || canvasResponse.length === 0) {
        return c.json(null);
      }

      const data = {
        id: canvasResponse[0].id,
        canvasUrl: canvasResponse[0].canvasUrl,
        trackUri: canvasResponse[0].trackUri,
        artist: canvasResponse[0].artist
          ? {
              artistUri: canvasResponse[0].artist.artistUri,
              artistName: canvasResponse[0].artist.artistName,
              artistImgUrl: canvasResponse[0].artist.artistImgUrl,
            }
          : undefined,
        otherId: canvasResponse[0].otherId,
        canvasUri: canvasResponse[0].canvasUri,
      };

      console.log(canvasResponse[0]);
      return c.json(data);
    }
  )
  .get(
    "/download",
    zValidator("query", z.object({ url: z.string().url() })),
    async (c) => {
      const { url } = c.req.valid("query");
      const filename = extractFilename(url);
      try {
        const response = await axios.get(url, {
          responseType: "stream",
          timeout: 30000,
        });

        c.header(
          "Content-Disposition",
          `attachment; filename="${filename}.mp4"`
        );
        c.header("Content-Type", "video/mp4");

        return c.body(response.data);
      } catch (error) {
        console.error("Error downloading canvas:", error);
        return c.json({ error: "Failed to download canvas" }, 500);
      }
    }
  );
