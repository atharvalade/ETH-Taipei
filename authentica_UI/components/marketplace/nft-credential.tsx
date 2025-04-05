"use client";

export default function NFTCredential() {
  return (
    <div className="max-w-6xl mx-auto text-white">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">NFT Credentials for Human Creation</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-indigo-900">
          <p className="text-xl text-gray-900 mb-6 font-medium">
            When human-created content is verified with a confidence score above 95%, 
            creators can mint an NFT credential as proof of authenticity.
          </p>
          <ul className="space-y-4 text-gray-900 mb-8">
            <li className="flex items-start">
              <svg className="w-6 h-6 text-indigo-900 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Verifiable proof of human creation</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-indigo-900 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Blockchain-backed authenticity</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-indigo-900 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Easy sharing and embedding options</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-indigo-900 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Protect your intellectual property</span>
            </li>
          </ul>
          <button className="bg-indigo-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all border-2 border-indigo-900">
            Learn More
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-indigo-900">
          <div className="bg-indigo-900 rounded-xl p-6 flex flex-col items-center justify-center text-center border-2 border-white">
            <div className="font-mono text-sm mb-4 text-white font-bold">NFT CREDENTIAL #A728F9</div>
            <div className="text-2xl font-bold mb-2 text-white">Verified Human Creation</div>
            <div className="text-sm text-white mb-6 font-medium">Confidence Score: 98.7%</div>
            <div className="w-32 h-32 rounded-lg bg-white flex items-center justify-center border-2 border-white">
              <svg className="w-16 h-16 text-indigo-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 