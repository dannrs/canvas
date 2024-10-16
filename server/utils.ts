import axios, { type AxiosRequestConfig } from "axios";
import {
  CanvasRequest,
  CanvasRequest_Track,
  CanvasResponse,
} from "./proto/generated/canvas";
import { CANVAS_ROUTE_URL, CANVAS_TOKEN_URL } from "./constants";

interface CanvasTokenResponse {
  accessToken: string;
}

export async function getCanvasToken(): Promise<string | null> {
  try {
    const response = await axios.get<CanvasTokenResponse>(CANVAS_TOKEN_URL);
    return response.data.accessToken;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`ERROR ${CANVAS_TOKEN_URL}: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${error}`);
    }
    return null;
  }
}

export async function getCanvas(tracks: string, accessToken: string) {
  const canvasRequest = CanvasRequest.create();
  const spotifyTrack = CanvasRequest_Track.create({ trackUri: tracks });
  canvasRequest.tracks.push(spotifyTrack);

  const requestBytes = CanvasRequest.encode(canvasRequest).finish();

  const options: AxiosRequestConfig = {
    responseType: "arraybuffer",
    headers: {
      accept: "application/x-protobuf",
      authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await axios.post(CANVAS_ROUTE_URL, requestBytes, options);

    const canvasResponse = CanvasResponse.decode(response.data);

    return canvasResponse.canvases;
  } catch (error) {
    console.error(`ERROR ${CANVAS_ROUTE_URL}: ${error}`);
    return null;
  }
}

export function extractFilename(url: string): string | null {
  const match = url.match(/\/video\/([^\/]+?)\./);
  return match ? match[1] : null;
}
