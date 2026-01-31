import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Wallet, 
  School, 
  Lock, 
  Terminal, 
  ArrowRight,
  Database,
  Fingerprint,
  Network,
  Users,
  Key,
  RefreshCw,
  Server,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Activity,
  EyeOff,
  FileJson
} from 'lucide-react';

import { EduVaultService, generateCredentialHash, Degree } from './contractInteractions';

// --- Components ---

const App = () => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'architecture' | 'admin'>('simulation');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">EduVault<span className="text-indigo-500">.sol</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-1 bg-slate-900 p-1 rounded-full border border-slate-800">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'simulation' 
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Live Simulation
            </button>
             <button
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'architecture' 
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Architecture
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'admin' 
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Admin Panel
            </button>
          </nav>
          {/* Mobile Nav Toggle could go here, for now using simple responsive text */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            POLYGON AMOY
          </div>
        </div>
        {/* Mobile Nav Bar */}
        <div className="md:hidden flex overflow-x-auto p-2 gap-2 bg-slate-900 border-b border-slate-800 no-scrollbar">
             <button onClick={() => setActiveTab('simulation')} className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium ${activeTab === 'simulation' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Simulation</button>
             <button onClick={() => setActiveTab('architecture')} className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium ${activeTab === 'architecture' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>Architecture</button>
             <button onClick={() => setActiveTab('admin')} className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium ${activeTab === 'admin' ? 'bg-violet-600 text-white' : 'text-slate-400'}`}>Admin</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {activeTab === 'simulation' && <SimulationDashboard />}
        {activeTab === 'architecture' && <ArchitectureViewer />}
        {activeTab === 'admin' && <UniversityAdminDashboard />}
      </main>
    </div>
  );
};

const UniversityAdminDashboard = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    degreeHash: ''
  });
  
  const [mintStatus, setMintStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState('');

  const handleConnect = async () => {
    setIsConnecting(true);
    const address = await EduVaultService.connectWallet();
    setWalletAddress(address);
    setIsConnecting(false);
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    setMintStatus('idle');
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) return;

    setMintStatus('pending');
    
    // Call simulated contract
    const result = await EduVaultService.mintDegree(walletAddress, formData.degreeHash);
    
    setTxHash(result.txHash);
    setMintStatus('success');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <LayoutDashboard className="w-6 h-6 text-violet-500" />
                    University Admin Dashboard
                </h2>
                <p className="text-slate-400">Manage credentials and issue new Soulbound Tokens to the blockchain.</p>
            </div>
            
            {!walletAddress ? (
                <button 
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition-all font-medium whitespace-nowrap"
                >
                    {isConnecting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
                            Connecting...
                        </>
                    ) : (
                        <>
                            <div className="w-8 h-8 -ml-1 flex items-center justify-center bg-orange-500/10 rounded-full">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-5 h-5" />
                            </div>
                            Connect Wallet
                        </>
                    )}
                </button>
            ) : (
                <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-700 rounded-lg p-1.5 pr-4">
                     <div className="bg-gradient-to-br from-orange-400 to-orange-600 w-8 h-8 rounded flex items-center justify-center shadow-lg">
                        <Wallet className="w-4 h-4 text-white" />
                     </div>
                     <div className="text-sm">
                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Connected as Admin</div>
                        <div className="font-mono text-slate-200">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</div>
                     </div>
                     <button onClick={handleDisconnect} className="ml-2 text-slate-500 hover:text-red-400">
                        <LogOut className="w-4 h-4" />
                     </button>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Form */}
            <div className="md:col-span-2">
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
                    {!walletAddress && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                            <Lock className="w-12 h-12 text-slate-600 mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">Wallet Connection Required</h3>
                            <p className="text-slate-400 text-sm max-w-xs mb-6">Please connect your authorized university administrator wallet to access the minting terminal.</p>
                            <button 
                                onClick={handleConnect}
                                className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                            >
                                Connect MetaMask
                            </button>
                        </div>
                    )}
                    
                    <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Shield className="w-4 h-4 text-violet-400" />
                            Issue New Credential
                        </h3>
                    </div>
                    
                    <form onSubmit={handleMint} className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Student ID</label>
                                <input 
                                    type="text" 
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    placeholder="e.g. 2024-CS-042"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500 transition-colors font-mono text-sm placeholder-slate-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Rahul Verma"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500 transition-colors font-mono text-sm placeholder-slate-700"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Degree Hash (SHA-256)
                                <span className="ml-2 normal-case text-slate-600 font-normal">Generated off-chain for privacy</span>
                            </label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    name="degreeHash"
                                    value={formData.degreeHash}
                                    onChange={handleChange}
                                    placeholder="0x..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500 transition-colors font-mono text-sm placeholder-slate-700"
                                    required
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
                                    <Fingerprint className="w-4 h-4" />
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2">
                                * This hash represents the Student Name, Degree Type, Year, and GPA. Only this hash is stored on-chain.
                            </p>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={mintStatus === 'pending' || mintStatus === 'success'}
                                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg ${
                                    mintStatus === 'success' 
                                        ? 'bg-emerald-600 text-white shadow-emerald-900/20' 
                                        : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-900/20'
                                }`}
                            >
                                {mintStatus === 'pending' ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Minting to Blockchain...
                                    </>
                                ) : mintStatus === 'success' ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        SBT Minted Successfully
                                    </>
                                ) : (
                                    <>
                                        <Shield className="w-5 h-5" />
                                        Mint Soulbound Token
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Column: Status / Info */}
            <div className="space-y-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                     <h4 className="text-slate-300 font-semibold mb-4 text-sm flex items-center gap-2">
                        <Activity className="w-4 h-4 text-violet-400" />
                        Network Status
                     </h4>
                     <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Network</span>
                            <span className="text-emerald-400 font-mono text-xs bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/50">Polygon Amoy</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Gas Price</span>
                            <span className="text-slate-300 font-mono text-xs">32 Gwei</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Contract</span>
                            <span className="text-slate-300 font-mono text-xs">0xEdu...Vault</span>
                        </div>
                     </div>
                </div>

                {mintStatus === 'success' && (
                    <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-5 animate-fade-in">
                        <h4 className="text-emerald-400 font-semibold mb-2 text-sm flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Transaction Confirmed
                        </h4>
                        <div className="text-xs text-slate-400 mb-3">
                            The degree has been permanently bound to the student's identity.
                        </div>
                        <div className="bg-slate-950/50 rounded border border-emerald-500/20 p-2">
                            <div className="text-[10px] text-slate-500 uppercase mb-1">Transaction Hash</div>
                            <div className="text-emerald-300 font-mono text-[10px] break-all">
                                {txHash}
                            </div>
                        </div>
                        <button 
                            onClick={() => { setMintStatus('idle'); setFormData({studentId: '', name: '', degreeHash: ''}); }}
                            className="mt-4 w-full text-xs text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1"
                        >
                            Issue Another <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

const ArchitectureViewer = () => {
  const [view, setView] = useState<'recovery' | 'privacy'>('privacy');

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex justify-center gap-4 mb-6">
            <button 
                onClick={() => setView('privacy')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'privacy' ? 'bg-slate-800 text-white ring-1 ring-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
            >
                DPDP Privacy & Compliance
            </button>
            <button 
                onClick={() => setView('recovery')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'recovery' ? 'bg-slate-800 text-white ring-1 ring-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
            >
                Social Recovery (ERC-4337)
            </button>
        </div>

        {view === 'recovery' && (
         <>
            <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-2xl font-bold text-white mb-3">ERC-4337 Social Recovery Logic</h2>
                <p className="text-slate-400">
                    To prevent permanent loss of academic credentials, EduVault utilizes Account Abstraction (ERC-4337). 
                    If a student loses their private key, "Guardians" can collaborate to rotate the signing key without moving the tokens.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                {/* Visual Connecting Lines (Desktop only) */}
                <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent -z-10"></div>
                
                {/* Guardian 1 */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative group hover:border-emerald-500/30 transition-colors">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-950 p-2 rounded-full border border-slate-800 text-emerald-500">
                    <School className="w-6 h-6" />
                    </div>
                    <h3 className="text-center mt-4 font-semibold text-white">Guardian 1: University</h3>
                    <p className="text-center text-xs text-slate-400 mt-2 mb-4">Verifies student ID via physical presence or SSO portal.</p>
                    <div className="bg-slate-950 rounded p-2 text-center">
                        <span className="text-xs font-mono text-emerald-400">Sign(RecoveryOp)</span>
                    </div>
                </div>

                {/* Smart Account (Center) */}
                <div className="bg-gradient-to-b from-indigo-900/20 to-slate-900 border border-indigo-500/50 rounded-xl p-8 relative shadow-2xl shadow-indigo-900/20 transform scale-105 z-10">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-950 p-3 rounded-full border border-indigo-500 text-white shadow-lg shadow-indigo-500/30">
                    <Shield className="w-8 h-8" />
                    </div>
                    <h3 className="text-center mt-4 font-bold text-lg text-white">Student Smart Account</h3>
                    <div className="text-center text-xs font-mono text-indigo-300 mt-1 mb-6">ERC-4337 Compliant</div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm p-2 bg-slate-950/50 rounded border border-slate-700/50">
                            <span className="text-slate-400">Owner Key</span>
                            <span className="font-mono text-red-400 line-through">0xLost...Key</span>
                        </div>
                        <div className="flex justify-center">
                            <ArrowRight className="w-4 h-4 text-slate-600 rotate-90" />
                        </div>
                        <div className="flex items-center justify-between text-sm p-2 bg-emerald-950/30 rounded border border-emerald-500/30">
                            <span className="text-emerald-100">New Key</span>
                            <span className="font-mono text-emerald-400">0xNew...Key</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-indigo-500/20 text-center">
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/20">Threshold: 2 of 3</span>
                    </div>
                </div>

                {/* Guardian 2 */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative group hover:border-emerald-500/30 transition-colors">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-950 p-2 rounded-full border border-slate-800 text-emerald-500">
                    <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-center mt-4 font-semibold text-white">Guardian 2: Family</h3>
                    <p className="text-center text-xs text-slate-400 mt-2 mb-4">Verified backup wallet held by parents or cold storage.</p>
                    <div className="bg-slate-950 rounded p-2 text-center">
                        <span className="text-xs font-mono text-emerald-400">Sign(RecoveryOp)</span>
                    </div>
                </div>
            </div>

            {/* Technical Flow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <StepCard 
                    icon={Key} 
                    step="1" 
                    title="Key Lost" 
                    desc="Student loses access to their mobile device containing the signing key." 
                />
                <StepCard 
                    icon={RefreshCw} 
                    step="2" 
                    title="Initiate Recovery" 
                    desc="Student generates new key pair on new device and requests recovery." 
                />
                <StepCard 
                    icon={Network} 
                    step="3" 
                    title="Guardian Consensus" 
                    desc="University node & Family wallet sign the 'UserOperation' via Bundler." 
                />
                <StepCard 
                    icon={Server} 
                    step="4" 
                    title="Execution" 
                    desc="Smart Contract verifies signatures > threshold and updates owner state." 
                />
            </div>
         </>
        )}

        {view === 'privacy' && (
            <div className="animate-fade-in">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <h2 className="text-2xl font-bold text-white mb-3">Privacy-Preserving Attribute Verification</h2>
                    <p className="text-slate-400 mb-2">
                        Compliance with <strong>DPDP Act 2023</strong> (Data Minimization).
                    </p>
                    <p className="text-sm text-slate-500">
                        Employers can verify if a GPA is above a threshold (e.g., &gt; 7.5) without ever seeing the exact GPA (e.g., 8.2), 
                        by utilizing <strong>Granular Attribute Hashing</strong> on-chain.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Step 1: Off-Chain Data */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
                                <FileJson className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-white">1. Off-Chain Data</h3>
                        </div>
                        <div className="space-y-3 font-mono text-xs">
                             <div className="bg-slate-950 p-3 rounded border border-slate-800">
                                <span className="text-slate-500 block mb-1">// Actual Data</span>
                                <div className="flex justify-between">
                                    <span className="text-indigo-300">GPA:</span>
                                    <span className="text-white">8.2</span>
                                </div>
                             </div>
                             <div className="flex justify-center">
                                <ArrowRight className="w-4 h-4 text-slate-600 rotate-90" />
                             </div>
                             <div className="bg-slate-950 p-3 rounded border border-slate-800">
                                <span className="text-slate-500 block mb-1">// Generated Claim</span>
                                <div className="text-emerald-300">"GPA_ABOVE_7.5"</div>
                             </div>
                        </div>
                    </div>

                    {/* Step 2: Hashing */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative">
                        <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-10 bg-slate-800 rounded-full p-1 border border-slate-700 hidden md:block">
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-violet-500/20 p-2 rounded-lg text-violet-400">
                                <Fingerprint className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-white">2. Salted Hashing</h3>
                        </div>
                        <div className="space-y-4 font-mono text-xs">
                             <p className="text-slate-400 text-[10px] leading-relaxed">
                                The claim is combined with a random "Salt" so standard dictionary attacks fail.
                             </p>
                             <div className="bg-slate-950 p-3 rounded border border-slate-800">
                                <div className="text-slate-500 mb-2">Input:</div>
                                <div className="text-emerald-300 break-all">"GPA_ABOVE_7.5" <span className="text-slate-500">+</span> "x9zR2m..."</div>
                             </div>
                             <div className="flex justify-center">
                                <ArrowRight className="w-4 h-4 text-slate-600 rotate-90" />
                             </div>
                             <div className="bg-slate-950 p-3 rounded border border-slate-800 border-l-4 border-l-violet-500">
                                <div className="text-slate-500 mb-1">Output Hash (On-Chain):</div>
                                <div className="text-violet-300 break-all">0x4a2b9...e7f1</div>
                             </div>
                        </div>
                    </div>

                    {/* Step 3: Verification */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative">
                         <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-10 bg-slate-800 rounded-full p-1 border border-slate-700 hidden md:block">
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-white">3. Zero-Knowledge Check</h3>
                        </div>
                        <div className="space-y-3">
                             <div className="bg-emerald-950/20 p-3 rounded border border-emerald-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <EyeOff className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-bold text-white">Employer Sees:</span>
                                </div>
                                <ul className="text-[10px] text-slate-300 space-y-1 ml-5 list-disc">
                                    <li>Claim: <span className="text-emerald-300">"GPA {'>'} 7.5"</span></li>
                                    <li>Is Valid? <span className="text-emerald-300">TRUE</span></li>
                                    <li>Actual GPA? <span className="text-red-400">HIDDEN</span></li>
                                </ul>
                             </div>
                             <p className="text-[10px] text-slate-500 mt-2">
                                The smart contract confirms the hash exists without revealing the input data, satisfying "Data Minimization".
                             </p>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

const StepCard = ({ icon: Icon, step, title, desc }: { icon: any, step: string, title: string, desc: string }) => (
    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg hover:bg-slate-800/50 transition-colors">
        <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs font-bold border border-slate-700">{step}</span>
            <Icon className="w-4 h-4 text-indigo-400" />
            <h4 className="font-semibold text-slate-200 text-sm">{title}</h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

// --- SIMULATION LOGIC ---

const SimulationDashboard = () => {
  // --- Mock Blockchain State ---
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [blockHeight, setBlockHeight] = useState(1402394);
  
  // --- Issuer State ---
  const [studentName, setStudentName] = useState('Rahul Verma');
  const [degreeType, setDegreeType] = useState('B.Tech Computer Science');
  const [gradYear, setGradYear] = useState('2024');
  const [studentAddress, setStudentAddress] = useState('0x71C...9A2');
  const [isMinting, setIsMinting] = useState(false);

  // --- Verifier State ---
  const [verifyId, setVerifyId] = useState('');
  const [verifyName, setVerifyName] = useState('');
  const [verifyDegree, setVerifyDegree] = useState('');
  const [verifyYear, setVerifyYear] = useState('');
  const [verificationResult, setVerificationResult] = useState<'idle' | 'success' | 'failure'>('idle');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleMint = async () => {
    setIsMinting(true);
    const newHash = generateCredentialHash(studentName, degreeType, gradYear);
    
    // Simulate async network delay
    await new Promise(r => setTimeout(r, 1500));
    
    const newDegree: Degree = {
      id: degrees.length + 1,
      studentName,
      degreeType,
      gradYear,
      studentAddress,
      credentialHash: newHash,
      timestamp: Date.now()
    };
    setDegrees([...degrees, newDegree]);
    setBlockHeight(prev => prev + 1);
    setIsMinting(false);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationResult('idle');

    // Simulate async network delay
    await new Promise(r => setTimeout(r, 1200));

    const token = degrees.find(d => d.id.toString() === verifyId);
    
    if (!token) {
      setVerificationResult('failure');
      setIsVerifying(false);
      return;
    }

    const inputHash = generateCredentialHash(verifyName, verifyDegree, verifyYear);
    const isValid = await EduVaultService.verifyCredential(degrees, verifyId, inputHash);
    
    if (isValid) {
      setVerificationResult('success');
    } else {
      setVerificationResult('failure');
    }
    setIsVerifying(false);
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* SECTION 1: UNIVERSITY PORTAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <School className="w-32 h-32 text-indigo-500" />
            </div>
            <div className="relative">
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <School className="w-5 h-5 text-indigo-500" />
                University Portal
              </h2>
              <p className="text-slate-400 text-sm mb-6">Issue a tamper-proof Soulbound Degree.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Student Name</label>
                  <input 
                    type="text" 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Degree</label>
                        <input 
                            type="text" 
                            value={degreeType}
                            onChange={(e) => setDegreeType(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Year</label>
                        <input 
                            type="text" 
                            value={gradYear}
                            onChange={(e) => setGradYear(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm"
                        />
                    </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Wallet Address</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={studentAddress}
                      onChange={(e) => setStudentAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm"
                    />
                    <button className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors">
                        <Wallet className="w-5 h-5 text-indigo-400" />
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleMint}
                    disabled={isMinting}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
                  >
                    {isMinting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Minting SBT...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Issue Credential (Mint)
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOCK BLOCKCHAIN VISUALIZER */}
        <div className="lg:col-span-7">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Polygon Ledger State
                </h3>
                <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Block #{blockHeight}
                </span>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {degrees.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-lg min-h-[200px]">
                    <Terminal className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">No transactions found in mempool.</p>
                </div>
              ) : (
                degrees.map((d) => (
                    <div key={d.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 group hover:border-indigo-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-indigo-400">Token ID #{d.id}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{new Date(d.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm font-mono text-slate-400 mb-3">
                            <div>
                                <span className="text-[10px] uppercase text-slate-600 block">Owner</span>
                                <span className="truncate block">{d.studentAddress}</span>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase text-slate-600 block">Hash (Hidden Data)</span>
                                <span className="text-emerald-500/80 truncate block">{d.credentialHash}</span>
                            </div>
                        </div>
                        <div className="flex gap-2 text-xs">
                             <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">Soulbound</span>
                             <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">ERC-721</span>
                        </div>
                    </div>
                )).reverse()
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800"></div>

      {/* SECTION 2: EMPLOYER VERIFICATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Employer Verification
            </h2>
            <p className="text-slate-400 text-sm mb-6">
                Employers verify credentials by rehashing the candidate's claims and querying the blockchain. 
                The actual data is never revealed to the public.
            </p>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Token ID</label>
                        <input 
                            type="text" 
                            placeholder="e.g. 1"
                            value={verifyId}
                            onChange={(e) => setVerifyId(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-mono text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Claimed Name</label>
                        <input 
                            type="text" 
                            value={verifyName}
                            onChange={(e) => setVerifyName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-mono text-sm"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Claimed Degree</label>
                        <input 
                            type="text" 
                            value={verifyDegree}
                            onChange={(e) => setVerifyDegree(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-mono text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Claimed Year</label>
                        <input 
                            type="text" 
                            value={verifyYear}
                            onChange={(e) => setVerifyYear(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-mono text-sm"
                        />
                    </div>
                </div>

                <button 
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Verifying on-chain...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-4 h-4" />
                        Verify Credential
                      </>
                    )}
                  </button>
            </div>
        </div>

        <div className="flex flex-col justify-center">
            {verificationResult === 'idle' && (
                <div className="text-center text-slate-600 p-8 border-2 border-dashed border-slate-800 rounded-xl">
                    <Fingerprint className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Enter credential details to verify against the smart contract.</p>
                </div>
            )}
            
            {verificationResult === 'success' && (
                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-8 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Verified Authentic</h3>
                    <p className="text-slate-400 text-sm mb-4">
                        The cryptographic hash of the provided data matches the immutable record on the Polygon blockchain.
                    </p>
                    <div className="bg-emerald-950/50 rounded p-3 font-mono text-xs text-emerald-300 break-all">
                        {generateCredentialHash(verifyName, verifyDegree, verifyYear)}
                    </div>
                </div>
            )}

            {verificationResult === 'failure' && (
                <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-8 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Verification Failed</h3>
                    <p className="text-slate-400 text-sm mb-4">
                        The provided data does not match the on-chain record for Token ID #{verifyId}. This credential may be forged or the data entered is incorrect.
                    </p>
                </div>
            )}
        </div>
      </div>

    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);