// API route for submitting content to IPFS
// This route redirects to the main consolidated API endpoint

export default async function handler(req, res) {
  // Redirect to the main API with the appropriate action
  console.log("📤 submit-content API called, redirecting to main API");

  // Forward the request to the main API endpoint
  const response = await fetch(new URL('/api/authentica', `http://${req.headers.host}`), {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
  });

  // Copy the response status and headers
  res.status(response.status);
  for (const [key, value] of response.headers.entries()) {
    res.setHeader(key, value);
  }

  // Send the response body
  if (response.ok) {
    const data = await response.json();
    return res.json(data);
  } else {
    const errorText = await response.text();
    return res.status(response.status).send(errorText);
  }
} 