export default async function handler(req,res){
if(req.method!=='POST') return res.status(405).end();
const token=req.body['h-captcha-response'];
if(!token) return res.status(400).send('Captcha missing');
const r=await fetch('https://hcaptcha.com/siteverify',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({secret:process.env.HCAPTCHA_SECRET,response:token})});
const d=await r.json();
if(!d.success) return res.status(403).send('Captcha failed');
res.redirect(302,'/document-verify.html');
}