import querystring from "querystring";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  let body = "";
  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const parsed = querystring.parse(body);
    const token = parsed["h-captcha-response"];

    if (!token) {
      return res.status(400).send("Captcha token missing");
    }

    const verifyRes = await fetch(
      "https://hcaptcha.com/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          secret: process.env.HCAPTCHA_SECRET,
          response: token
        })
      }
    );

    const data = await verifyRes.json();

    if (!data.success) {
      console.error("hCaptcha error:", data);
      return res.status(403).send("Captcha failed");
    }

    // ✅ Passed captcha
    res.redirect(302, "/document-verify.html");
  });
}
