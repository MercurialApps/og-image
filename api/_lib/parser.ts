import { IncomingMessage } from "http";
import { parse } from "url";
import { ParsedRequest, Theme } from "./types";

export function parseRequest(req: IncomingMessage) {
  console.log("HTTP " + req.url);
  const { pathname, query } = parse(req.url || "/", true);
  const {
    fontSize,
    images,
    widths,
    heights,
    theme,
    md,
    siteName,
    desc,
    siteNameFontSize,
    descFontSize,
    more,
  } = query || {};

  if (Array.isArray(fontSize)) {
    throw new Error("Expected a single fontSize");
  }
  if (Array.isArray(siteNameFontSize)) {
    throw new Error("Expected a single siteNameFontSize");
  }
  if (Array.isArray(descFontSize)) {
    throw new Error("Expected a single descFontSize");
  }
  if (Array.isArray(siteName)) {
    throw new Error("Expected a single siteName");
  }
  if (Array.isArray(desc)) {
    throw new Error("Expected a single desc");
  }
  if (Array.isArray(theme)) {
    throw new Error("Expected a single theme");
  }
  if (Array.isArray(more)) {
    throw new Error("Expected a single desc");
  }

  const arr = (pathname || "/").slice(1).split(".");
  let extension = "";
  let text = "";
  if (arr.length === 0) {
    text = "";
  } else if (arr.length === 1) {
    text = arr[0];
  } else {
    extension = arr.pop() as string;
    text = arr.join(".");
  }

  const parsedRequest: ParsedRequest = {
    fileType: extension === "jpeg" ? extension : "png",
    text: decodeURIComponent(text),
    theme: theme === "dark" ? "dark" : "light",
    md: md === "1" || md === "true",
    fontSize: fontSize || "96px",
    images: getArray(images),
    widths: getArray(widths),
    heights: getArray(heights),
    siteName: siteName || "",
    desc: desc || "",
    siteNameFontSize: siteNameFontSize || "50px",
    descFontSize: descFontSize || "70px",
    more: more || "",
  };
  parsedRequest.images = getDefaultImages(
    parsedRequest.images,
    parsedRequest.theme
  );
  return parsedRequest;
}

function getArray(stringOrArray: string[] | string | undefined): string[] {
  if (typeof stringOrArray === "undefined") {
    return [];
  } else if (Array.isArray(stringOrArray)) {
    return stringOrArray;
  } else {
    return [stringOrArray];
  }
}

function getDefaultImages(images: string[], theme: Theme): string[] {
  const defaultImage =
    theme === "light"
      ? "https://og.mercurialapps.com/mercurialapps-light.png"
      : "https://og.mercurialapps.com/mercurialapps-dark.png";

  if (!images || !images[0]) {
    return [defaultImage];
  }
  if (!images[0].startsWith("https://og.mercurialapps.com/")) {
    images[0] = defaultImage;
  }
  return images;
}
