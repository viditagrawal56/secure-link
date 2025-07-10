import { Hono } from "hono";
import type { Bindings, Variables } from "../types";
import { UrlService } from "../services/urlService";

const staticRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

staticRoutes.get("/s/:shortCode", async (c) => {
  try {
    const shortCode = c.req.param("shortCode");
    const urlService = new UrlService(c.env.DB);

    const url = await urlService.getUrlByShortCode(shortCode);

    if (!url) {
      return c.text("URL not found", 404);
    }
    if (!url.active) {
      return c.text("URL Inactive", 403);
    }
    if (!url.isProtected) {
      return c.redirect(url.originalUrl);
    }

    const accessPageHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Access Required - Secure Link</title>
      </head>
      <body>
        <div>
          <h1>Protected URL</h1>
          <p>
            This URL is protected and requires email verification. 
            Please enter your email address to request access.
          </p>
          
          <form id="accessForm">
            <div>
              <label for="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="your@email.com" 
                required 
                autocomplete="email"
              >
            </div>
            
            <button type="submit" id="submitBtn">
              <span id="btnText">Request Access</span>
            </button>
          </form>
          
          <div id="alertMessage"></div>
        </div>
        
        <script>
          document.getElementById('accessForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const submitBtn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            const alertMessage = document.getElementById('alertMessage');
            
            alertMessage.style.display = 'none';
            alertMessage.className = 'alert';
            
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            
            try {
              const response = await fetch('/api/request-access/${shortCode}', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
              });
              
              const data = await response.json();
              
              if (response.ok && data.success) {
                alertMessage.textContent = data.message;
                alertMessage.className = 'alert success';
                alertMessage.style.display = 'block';
                document.getElementById('email').value = '';
              } else {
                alertMessage.textContent = data.error || 'Failed to send verification email';
                alertMessage.className = 'alert error';
                alertMessage.style.display = 'block';
              }
            } catch (error) {
              console.error('Network error:', error);
              alertMessage.textContent = 'Network error. Please check your connection and try again.';
              alertMessage.className = 'alert error';
              alertMessage.style.display = 'block';
            } finally {
              submitBtn.disabled = false;
              btnText.textContent = 'Request Access';
            }
          });
        </script>
      </body>
      </html>
    `;

    return c.html(accessPageHtml);
  } catch (err) {
    console.log("Error accessing URL:", err);
    return c.text("Internal Server Error", 500);
  }
});

export { staticRoutes };

staticRoutes.get("*", async (c) => {
  // Try to serve the static asset first
  const url = new URL(c.req.url);
  const assetResponse = await c.env.ASSETS.fetch(c.req.raw);

  // If the asset exists (not 404), return it
  if (assetResponse.status !== 404) {
    return assetResponse;
  }

  // If it's not a static asset and not an API route, serve index.html for SPA routing
  if (!url.pathname.startsWith("/api/")) {
    const indexResponse = await c.env.ASSETS.fetch(
      new Request(new URL("/", url).href)
    );
    return indexResponse;
  }

  return c.text("Not found", 404);
});
