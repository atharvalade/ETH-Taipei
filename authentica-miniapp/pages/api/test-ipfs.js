// Test endpoint for Pinata IPFS integration
// Using native fetch in Next.js

export default async function handler(req, res) {
  console.log("🚀 IPFS Test API called");
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    console.log("🚀 OPTIONS request received");
    return res.status(200).end();
  }
  
  try {
    const PINATA_JWT = process.env.PINATA_JWT;
    
    if (!PINATA_JWT) {
      console.error("❌ Missing Pinata JWT token");
      return res.status(500).json({
        success: false,
        error: 'Missing Pinata JWT token'
      });
    }
    
    console.log("✅ Pinata JWT found, preparing test content");
    
    // Create test content
    const testContent = {
      content: "This is a test content from Authentica app",
      timestamp: new Date().toISOString(),
      app: 'authentica-test',
      type: 'content-verification-test'
    };
    
    console.log("📤 Uploading to Pinata IPFS...");
    
    // Upload to Pinata
    const uploadResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pinataContent: testContent,
        pinataMetadata: {
          name: `authentica-test-${Date.now()}`
        }
      })
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error(`❌ Pinata upload failed: ${errorText}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to upload to IPFS',
        details: errorText,
        status: uploadResponse.status
      });
    }
    
    const uploadData = await uploadResponse.json();
    const ipfsHash = uploadData.IpfsHash;
    console.log(`✅ Content uploaded to IPFS with hash: ${ipfsHash}`);
    
    // Now try to retrieve the content
    console.log("📥 Retrieving content from IPFS...");
    const retrieveResponse = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    
    if (!retrieveResponse.ok) {
      console.error(`❌ IPFS retrieval failed: ${retrieveResponse.statusText}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve from IPFS',
        ipfsHash,
        status: retrieveResponse.status
      });
    }
    
    const retrievedData = await retrieveResponse.json();
    console.log("✅ Content successfully retrieved from IPFS");
    console.log("📋 Retrieved content:", JSON.stringify(retrievedData));
    
    // Return success with both uploaded and retrieved data
    console.log("🎉 Test completed successfully");
    return res.status(200).json({
      success: true,
      ipfsHash,
      uploadedData: testContent,
      retrievedData,
      pinataResponse: uploadData
    });
    
  } catch (error) {
    console.error('❌ IPFS test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 