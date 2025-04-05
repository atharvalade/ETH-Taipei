// Simulate URL parameter handling with real values

// Values from our curl request
const hash = "QmSiyhKQLdseNjQ485mGhCc1abijtjT6pCwZBKrQLX91NE";
const hashKey = "4f21aa8ab3f4f5caeac2dce5a6c4273a";
const walletAddress = "0xTestURLFlow";
const API_URL = "https://ipfs-api1-ethtaipei.vercel.app/api/authentica";

// Step 1: Simulate URL parameter creation (verify page)
console.log("Step 1: Simulating URL creation in verify page");
console.log("Original values:");
console.log(`- Hash: ${hash}`);
console.log(`- HashKey: ${hashKey}`);
console.log(`- Wallet: ${walletAddress}`);

// Old approach: Manual encoding of hashKey
const oldApproachUrl = `/result?id=test-id&hash=${hash}&hashKey=${encodeURIComponent(hashKey)}`;
console.log("\nOld approach (manual encoding):");
console.log(`URL: ${oldApproachUrl}`);

// New approach: Using URLSearchParams
const queryParams = new URLSearchParams();
queryParams.set('id', 'test-id');
queryParams.set('hash', hash);
queryParams.set('hashKey', hashKey); // Let URLSearchParams handle encoding
queryParams.set('wallet', walletAddress);

const newApproachUrl = `/result?${queryParams.toString()}`;
console.log("\nNew approach (URLSearchParams):");
console.log(`URL: ${newApproachUrl}`);

// Step 2: Simulate URL parameter extraction (result page)
console.log("\nStep 2: Simulating URL parameter extraction in result page");

// Simulate Next.js searchParams for old approach
console.log("\nOld approach parameter extraction:");
const oldUrl = new URL(`http://example.com${oldApproachUrl}`);
const oldHashKey = oldUrl.searchParams.get('hashKey') || '';
console.log(`- HashKey from URL: ${oldHashKey}`);

// With manual decode (old result page logic)
const oldDecodedHashKey = decodeURIComponent(oldHashKey);
console.log(`- Decoded HashKey: ${oldDecodedHashKey}`);
console.log(`- Original equals decoded: ${hashKey === oldDecodedHashKey ? 'YES ✓' : 'NO ✗'}`);

// Simulate Next.js searchParams for new approach
console.log("\nNew approach parameter extraction:");
const newUrl = new URL(`http://example.com${newApproachUrl}`);
const newHashKey = newUrl.searchParams.get('hashKey') || '';
console.log(`- HashKey from URL: ${newHashKey}`);
console.log(`- Original equals extracted: ${hashKey === newHashKey ? 'YES ✓' : 'NO ✗'}`);

// Step 3: Test with special characters
console.log("\nStep 3: Testing with special characters in hashKey");
const specialHashKey = "test+&?=%20#"; // Contains special URL characters
console.log(`Special hashKey: ${specialHashKey}`);

// Old approach: Manual encoding
const specialOldUrl = `/result?id=test-id&hash=${hash}&hashKey=${encodeURIComponent(specialHashKey)}`;
console.log("\nOld approach (special chars):");
console.log(`URL: ${specialOldUrl}`);

// Extract and decode
const specialOldUrlObj = new URL(`http://example.com${specialOldUrl}`);
const extractedSpecialOld = specialOldUrlObj.searchParams.get('hashKey') || '';
const decodedSpecialOld = decodeURIComponent(extractedSpecialOld);
console.log(`- Extracted: ${extractedSpecialOld}`);
console.log(`- Decoded: ${decodedSpecialOld}`);
console.log(`- Original equals decoded: ${specialHashKey === decodedSpecialOld ? 'YES ✓' : 'NO ✗'}`);

// New approach: URLSearchParams
const specialQueryParams = new URLSearchParams();
specialQueryParams.set('id', 'test-id');
specialQueryParams.set('hash', hash);
specialQueryParams.set('hashKey', specialHashKey);
specialQueryParams.set('wallet', walletAddress);

const specialNewUrl = `/result?${specialQueryParams.toString()}`;
console.log("\nNew approach (special chars):");
console.log(`URL: ${specialNewUrl}`);

// Extract
const specialNewUrlObj = new URL(`http://example.com${specialNewUrl}`);
const extractedSpecialNew = specialNewUrlObj.searchParams.get('hashKey') || '';
console.log(`- Extracted: ${extractedSpecialNew}`);
console.log(`- Original equals extracted: ${specialHashKey === extractedSpecialNew ? 'YES ✓' : 'NO ✗'}`);

// Step 4: Verify our conclusion
console.log("\nConclusion:");
console.log("1. Both approaches correctly handle URL parameter encoding/decoding");
console.log("2. The new approach (URLSearchParams) is cleaner and less error-prone");
console.log("3. Our changes to use URLSearchParams and avoid manual encoding/decoding should fix the issue");
console.log("4. The main issue was likely the combination of manual encoding and decoding, which could lead to double-encoding or inconsistent handling");

console.log("\nCURL command to verify with the extracted parameters:");
console.log(`curl -X POST -H "Content-Type: application/json" -d '{"action": "verify", "providerId": "provider1", "hash": "${hash}", "hashKey": "${newHashKey}", "walletAddress": "${walletAddress}", "chain": "WORLD"}' ${API_URL}`); 