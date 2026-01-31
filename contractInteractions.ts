// Logic for interacting with the EduVault smart contract

// ==============================================================================
// 🔧 DEPLOYMENT CONFIGURATION
// 
// 1. Run: npx hardhat run scripts/deploy.js --network amoy
// 2. Copy the deployed address from the console output.
// 3. Paste it below to connect the frontend to the live Polygon Amoy testnet.
// ==============================================================================

export const EDU_VAULT_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; 

export interface Degree {
  id: number;
  studentName: string;
  degreeType: string;
  gradYear: string;
  studentAddress: string;
  credentialHash: string;
  timestamp: number;
}

// Simulating Keccak256 Hashing for off-chain privacy
export const generateCredentialHash = (name: string, deg: string, year: string): string => {
  const raw = `${name}|${deg}|${year}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0').substring(0, 40) + '...';
};

// Simulated Blockchain Service
export const EduVaultService = {
  // Mock connecting to Metamask
  connectWallet: async (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
      }, 1000);
    });
  },

  // Mock Minting Transaction
  mintDegree: async (address: string, hash: string): Promise<{ txHash: string, status: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          txHash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
          status: 'success'
        });
      }, 2000);
    });
  },

  // Mock View Function
  verifyCredential: async (degrees: Degree[], id: string, providedHash: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const token = degrees.find(d => d.id.toString() === id);
        if (!token) {
          resolve(false);
          return;
        }
        resolve(token.credentialHash === providedHash);
      }, 1000);
    });
  }
};