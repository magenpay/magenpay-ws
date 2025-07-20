<h1 align="center">🧩 Magenpay Websocket Client</h1>



<p align="center">
  <img src="https://magenpay.com/_nuxt/magenpay_logo.D4eZEL4F.png" height="50" alt="Magenpay Logo"/>
</p>




<p align="center">
  <strong>Real-time WebSocket Client for Magenpay Ecosystem</strong><br/>
  A global super-fast and production-ready CDN client, integrated with NPM and GitHub.
</p>

<p align="center">
  <a href="https://www.magenpay.com">🌐 Website</a> · 
  <a href="https://x.com/magenpay">X (Twitter)</a> · 
  <a href="https://t.me/magenpay">Telegram</a>
</p>

<hr/>

## 🚀 Usage Guide

To integrate the client, add the following script tag to your website's HTML.  
This will load the script directly from our CDN:

## 🔧 Configuration

data-user-id: (Required) Your unique user identifier.
data-merchant-uuid: (Required) Your unique merchant identifier.

| Attribute            | Required | Description                         |
| -------------------- | -------- | ----------------------------------- |
| `data-user-id`       | ✅        | Your unique **paymentId identifier**     |
| `data-merchant-uuid` | ✅        | Your unique **merchant identifier** |


```html
<script 
  src="https://cdn.jsdelivr.net/gh/magenpay/magenpay-ws@v1.0.0/client.min.js"
  data-user-id="YOUR_PAYMENT_ID"
  data-merchant-uuid="YOUR_MERCHANT_UUID"
  async 
  defer>
</script>

