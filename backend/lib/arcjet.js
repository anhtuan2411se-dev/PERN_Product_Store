import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import "dotenv/config";

// Khởi tạo Arcjet với các quy tắc bảo vệ
export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    // Shield: Bảo vệ khỏi các cuộc tấn công phổ biến (SQL injection, XSS, etc.)
    shield({
      mode: "LIVE",
    }),
    // DetectBot: Phát hiện và chặn bot (trừ các công cụ tìm kiếm)
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    // Rate Limiting: Token Bucket - giới hạn 20 yêu cầu mỗi phút
    // refillRate: 5 tokens mỗi 10 giây = 30 tokens/phút
    // capacity: 10 tokens tối đa
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: "10s",
      capacity: 10,
    }),
  ],
});
