import { useState, useEffect } from "react";
import { Play, ChevronRight, Gift, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import CautionBanner from "@/components/CautionBanner";
import AttentionPopup from "@/components/AttentionPopup";
import RechargeSpinWheel from "@/components/RechargeSpinWheel";
import CryptoExchange from "@/components/CryptoExchange";
import { useUSDTRates } from "@/hooks/useUSDTRates";
import { useSpinWheelConfig } from "@/hooks/useSpinWheelConfig";

const Home = () => {
  const { rates } = useUSDTRates();
  const { config: spinConfig } = useSpinWheelConfig();
  const navigate = useNavigate();
  const [showAttentionPopup, setShowAttentionPopup] = useState(false);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showCryptoExchange, setShowCryptoExchange] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<{ type: string; symbol: string } | null>(null);

  const cryptoOptions = [
    { type: "bitcoin", symbol: "BTC", icon: "₿", color: "from-orange-400 to-orange-600" },
    { type: "ethereum", symbol: "ETH", icon: "Ξ", color: "from-blue-400 to-purple-600" },
    { type: "solana", symbol: "SOL", icon: "◎", color: "from-purple-400 to-pink-600" },
    { type: "litecoin", symbol: "LTC", icon: "Ł", color: "from-gray-400 to-gray-600" },
  ];

  const handleCryptoClick = (crypto: { type: string; symbol: string }) => {
    setSelectedCrypto(crypto);
    setShowCryptoExchange(true);
  };

  useEffect(() => {
    // Show popup only once per user session
    const hasSeenPopup = localStorage.getItem('hasSeenAttentionPopup');
    if (!hasSeenPopup) {
      setShowAttentionPopup(true);
    }
  }, []);

  const handleClosePopup = () => {
    setShowAttentionPopup(false);
    localStorage.setItem('hasSeenAttentionPopup', 'true');
  };

  return (
    <div className="min-h-screen bg-background pb-20 max-w-md mx-auto">
      <Header />
      
      <main className="px-4 py-4 space-y-4 animate-slide-up">
        {/* Poster Banner */}
        <div className="w-full">
          <img 
            src="/lovable-uploads/banner-106.png" 
            alt="NRX PAY Promotion Banner - 1 USDT = 106 rs ONLY ON NRX PAY" 
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Recharge Bonus Spin Wheel */}
        <Card 
          className="p-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white cursor-pointer hover:scale-105 transition-transform shadow-lg border-0 animate-glow"
          onClick={() => setShowSpinWheel(true)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold mb-1 text-white flex items-center gap-2">
                {spinConfig?.title || "🎊 Festival Recharge Bonus 🎊"}
              </h3>
              <p className="text-xs text-white/90 font-medium">
                {spinConfig?.body_text || "Spin the wheel & win up to 40% bonus on recharge!"}
              </p>
            </div>
            <Gift className="h-6 w-6 text-white/90" />
          </div>
        </Card>

        {/* Tutorial Section */}
        <Card 
          className="p-4 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white cursor-pointer hover:scale-105 transition-transform shadow-lg border-0"
          onClick={() => navigate("/earning-guide")}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold mb-1 text-white">How to Earn Using NRX PAY</h3>
              <p className="text-xs text-white/90 font-medium">
                Discover earning opportunities & maximize your profits
              </p>
            </div>
            <Play className="h-6 w-6 text-white/90" />
          </div>
        </Card>

        {/* Crypto Exchange Section */}
        <div className="space-y-3 mt-4">
          <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Exchange Crypto at Highest Rates
          </div>
          <div className="grid grid-cols-2 gap-3">
            {cryptoOptions.map((crypto) => (
              <Card
                key={crypto.type}
                className={`p-4 bg-gradient-to-br ${crypto.color} text-white cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg border-0 hover:shadow-xl`}
                onClick={() => handleCryptoClick(crypto)}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <span className="text-4xl">{crypto.icon}</span>
                  <h3 className="text-sm font-bold capitalize">{crypto.type}</h3>
                  <span className="text-xs font-semibold opacity-90">{crypto.symbol}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Corporate Account Section */}
        <div className="text-sm text-muted-foreground font-medium mb-2">
          Upload Corporate Account
        </div>
        <Card 
          className="p-4 bg-gray-50 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate("/corporate-account")}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-sm">📋</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Earn <span className="text-xl text-orange-600 font-extrabold">50K</span> every day!
              </h3>
            </div>
          </div>
        </Card>

        {/* Current Account Section */}
        <div className="text-sm text-muted-foreground font-medium mb-2">
          Upload Current Account
        </div>
        <Card 
          className="p-4 bg-gray-50 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate("/current-account")}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-sm">🏦</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Earn <span className="text-xl text-blue-600 font-extrabold">30K</span> every day!
              </h3>
            </div>
          </div>
        </Card>

        {/* Recharge Button */}
        <Button
          onClick={() => navigate("/recharge")}
          className="w-full h-14 text-lg font-bold gradient-success text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <span className="mr-2 text-xl">💳</span>
          Recharge Now
        </Button>

        {/* Guide Section */}
        <div className="space-y-4 mt-8">
          <div className="text-left mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              📖 Guide
            </h3>
            <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 mt-1"></div>
          </div>
          
          {/* Guide Items */}
          <div className="space-y-2">
            <button 
              onClick={() => navigate("/bank-guide")}
              className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">How to add a Bank account?</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
            
            <button 
              onClick={() => navigate("/pin-guide")}
              className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">How to change PIN?</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
            
            <button 
              onClick={() => navigate("/support-guide")}
              className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">How to contact Customer Support?</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          </div>
        </div>

        {/* Join Us & Copyright */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-base font-medium neon-text">Join us</p>
          <p className="text-xs text-muted-foreground">© NRX PAY 2025</p>
        </div>
      </main>

      <AttentionPopup 
        isOpen={showAttentionPopup}
        onClose={handleClosePopup}
        usdtRate={rates?.buy_rate || 99}
      />

      <RechargeSpinWheel 
        isOpen={showSpinWheel}
        onClose={() => setShowSpinWheel(false)}
      />

      {selectedCrypto && (
        <CryptoExchange
          isOpen={showCryptoExchange}
          onClose={() => {
            setShowCryptoExchange(false);
            setSelectedCrypto(null);
          }}
          cryptoType={selectedCrypto.type}
          cryptoSymbol={selectedCrypto.symbol}
        />
      )}

      <BottomNavigation />
    </div>
  );
};

export default Home;