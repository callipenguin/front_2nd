// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from "react";
import express from "express";
import ReactDOMServer from "react-dom/server";
import { App } from "./App.tsx";

const app = express();
const port = 3333;

const cache = new Map<string, { html: string; timestamp: number }>();

// 캐시 만료 시간 설정 (5분)
const CACHE_TTL = 5 * 60 * 1000; // 5분을 밀리초로 표현

// 자주 사용되는 URL 목록 정의
const popularUrls = ["/", "/about", "/contact"];

// 서버 시작 시 자주 사용되는 URL 미리 캐싱
popularUrls.forEach((url) => {
  const content = ReactDOMServer.renderToString(<App url={url} />);
  const html = generateHTML(content, url);
  cache.set(url, { html, timestamp: Date.now() });
});

app.get("*", (req, res) => {
  const url = req.url;

  // 캐시된 응답 확인 및 반환
  const cachedData = cache.get(url);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    return res.send(cachedData.html);
  }

  // 캐시에 없거나 만료된 경우, 렌더링 수행
  const content = ReactDOMServer.renderToString(<App url={url} />);
  const html = generateHTML(content, url);

  // 렌더링 결과 캐싱
  cache.set(url, { html, timestamp: Date.now() });

  res.send(html);
});

// HTML 생성 함수
function generateHTML(content: string, url: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple SSR - ${url}</title>
    </head>
    <body>
      <div id="root">${content}</div>
    </body>
    </html>
  `;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
