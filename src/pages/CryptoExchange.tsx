import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CryptoOption {
  type: string;
  symbol: string;
  icon: string;
  color: string;
  rate: number;
}

const CryptoExchangePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cryptoRates, setCryptoRates] = useState<CryptoOption[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [quantity, setQuantity] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCryptoRates();
  }, []);

  const fetchCryptoRates = async () => {
    try {
      const { data, error } = await supabase
        .from("crypto_rates")
        .select("*")
        .eq("is_active", true)
        .order("crypto_type");

      if (error) throw error;

      const options: CryptoOption[] = data.map((rate) => ({
        type: rate.crypto_type,
        symbol: rate.crypto_symbol,
        icon: getCryptoIcon(rate.crypto_type),
        color: getCryptoColor(rate.crypto_type),
        rate: rate.rate_inr,
      }));

      setCryptoRates(options);
    } catch (error) {
      console.error("Error fetching rates:", error);
      toast.error("Failed to load crypto rates");
    }
  };

  const getCryptoIcon = (type: string) => {
    const icons: Record<string, string> = {
      bitcoin: "₿",
      ethereum: "Ξ",
      solana: "◎",
      litecoin: "Ł",
    };
    return icons[type] || "₿";
  };

  const getCryptoColor = (type: string) => {
    const colors: Record<string, string> = {
      bitcoin: "from-orange-400 to-orange-600",
      ethereum: "from-blue-400 to-purple-600",
      solana: "from-purple-400 to-pink-600",
      litecoin: "from-gray-400 to-gray-600",
    };
    return colors[type] || "from-orange-400 to-orange-600";
  };

  const totalAmount = selectedCrypto && quantity
    ? (parseFloat(quantity) * selectedCrypto.rate).toFixed(2)
    : "0.00";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !selectedCrypto) {
      toast.error("Please select a crypto and log in");
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (!transactionId.trim()) {
      toast.error("Please enter transaction ID");
      return;
    }

    setLoading(true);

    try {
      // Get username
      const { data: userData } = await supabase
        .from("user_data")
        .select("username")
        .eq("user_id", user.id)
        .maybeSingle();

      // Create transaction
      const { error } = await supabase.from("crypto_transactions").insert({
        user_id: user.id,
        username: userData?.username,
        crypto_type: selectedCrypto.type,
        crypto_symbol: selectedCrypto.symbol,
        quantity: parseFloat(quantity),
        rate_inr: selectedCrypto.rate,
        total_inr: parseFloat(totalAmount),
        transaction_id: transactionId,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Exchange request submitted successfully!");
      setQuantity("");
      setTransactionId("");
      setSelectedCrypto(null);
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      toast.error(error.message || "Failed to submit exchange request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-500 via-yellow-500 to-amber-600 text-white px-4 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/home")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Exchange Crypto at Highest Rates</h1>
            <p className="text-xs opacity-90">BTC, Ethereum, Solana, Litecoin</p>
          </div>
          <Coins className="h-6 w-6" />
        </div>
      </div>

      <main className="px-4 py-6 space-y-6">
        {/* Crypto Selection */}
        {!selectedCrypto ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select Cryptocurrency</h2>
            <div className="grid grid-cols-2 gap-4">
              {cryptoRates.map((crypto) => (
                <Card
                  key={crypto.type}
                  className={`p-6 bg-gradient-to-br ${crypto.color} text-white cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border-0 hover:shadow-2xl`}
                  onClick={() => setSelectedCrypto(crypto)}
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="text-5xl">{crypto.icon}</span>
                    <h3 className="text-base font-bold capitalize">{crypto.type}</h3>
                    <span className="text-sm font-semibold opacity-90">{crypto.symbol}</span>
                    <div className="text-center pt-2 border-t border-white/30 w-full">
                      <p className="text-xs opacity-75">Rate</p>
                      <p className="text-lg font-bold">₹{crypto.rate.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selected Crypto Display */}
            <Card
              className={`p-6 bg-gradient-to-br ${selectedCrypto.color} text-white shadow-xl`}
            >
              <div className="text-center space-y-2">
                <span className="text-6xl block">{selectedCrypto.icon}</span>
                <h3 className="text-2xl font-bold capitalize">{selectedCrypto.type}</h3>
                <p className="text-sm opacity-90">{selectedCrypto.symbol}</p>
                <div className="pt-3 border-t border-white/30">
                  <p className="text-xs opacity-75">Current Rate</p>
                  <p className="text-3xl font-bold">₹{selectedCrypto.rate.toLocaleString("en-IN")}</p>
                  <p className="text-xs opacity-75 mt-1">per {selectedCrypto.symbol}</p>
                </div>
              </div>
            </Card>

            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedCrypto(null)}
              className="w-full"
            >
              Change Cryptocurrency
            </Button>

            {/* Quantity Input */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-base font-semibold">
                Enter Quantity ({selectedCrypto.symbol})
              </Label>
              <Input
                id="quantity"
                type="number"
                step="0.00000001"
                placeholder={`0.00000000 ${selectedCrypto.symbol}`}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="h-12 text-lg"
                required
              />
            </div>

            {/* Payment Section */}
            <Card className="p-4 bg-blue-50 border-2 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Payment Information</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>Please send {selectedCrypto.symbol} to:</p>
                <div className="p-3 bg-white rounded-lg font-mono text-xs break-all">
                  {selectedCrypto.type === "bitcoin" && "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"}
                  {selectedCrypto.type === "ethereum" && "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}
                  {selectedCrypto.type === "solana" && "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK"}
                  {selectedCrypto.type === "litecoin" && "LQTpS3VaYTjCr4s9Y8p8X3xT7F7bLnR2Kc"}
                </div>
              </div>
            </Card>

            {/* Transaction ID Input */}
            <div className="space-y-2">
              <Label htmlFor="transactionId" className="text-base font-semibold">
                Transaction ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="transactionId"
                type="text"
                placeholder="Enter your transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="h-12 text-lg"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter the transaction ID from your wallet after sending crypto
              </p>
            </div>

            {/* Total Amount Display */}
            <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">You will receive:</span>
                <span className="text-3xl font-bold text-green-600">
                  ₹{parseFloat(totalAmount).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className={`w-full h-14 text-lg font-bold bg-gradient-to-r ${selectedCrypto.color} hover:opacity-90 text-white shadow-xl`}
            >
              {loading ? "Processing..." : "Submit Exchange Request"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              * Your request will be processed within 24 hours after verification
            </p>
          </form>
        )}
      </main>
    </div>
  );
};

export default CryptoExchangePage;
