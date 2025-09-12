import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AvailableFunds from "@/components/AvailableFunds";
import RechargePopup from "@/components/RechargePopup";
import ReviewedAccountPopup from "@/components/ReviewedAccountPopup";
import InsufficientRechargeMessage from "@/components/InsufficientRechargeMessage";
import { useAuth } from "@/hooks/useAuth";
import { useUserAccounts } from "@/hooks/useUserAccounts";
import UserAccountsList from "@/components/UserAccountsList";
import { supabase } from "@/integrations/supabase/client";


const CorporateAccount = () => {
  const navigate = useNavigate();
  const [showRechargePopup, setShowRechargePopup] = useState(false);
  const [showReviewedPopup, setShowReviewedPopup] = useState(false);
  const [showInsufficientMessage, setShowInsufficientMessage] = useState(false);
  const { user } = useAuth();
  const { corporateAccounts, loading } = useUserAccounts(user?.id);
  const [showAccountsList, setShowAccountsList] = useState(false);

  // Check if user has approved accounts and show appropriate popup
  useEffect(() => {
    if (corporateAccounts.length > 0) {
      const approvedAccount = corporateAccounts.find(account => account.status === 'approved');
      if (approvedAccount) {
        // Show or hide recharge popup based on database flag
        if (approvedAccount.show_recharge_popup) {
          setShowRechargePopup(true);
        } else {
          setShowRechargePopup(false);
        }
      }
    }
  }, [corporateAccounts]);

  const handleRechargeClose = async () => {
    setShowRechargePopup(false);
    // Reset the popup flag in database
    if (corporateAccounts.length > 0) {
      const approvedAccount = corporateAccounts.find(account => account.status === 'approved' && account.show_recharge_popup);
      if (approvedAccount) {
        await supabase
          .from('corporate_accounts')
          .update({ show_recharge_popup: false })
          .eq('id', approvedAccount.id);
      }
    }
  };

  const handleUploadClick = () => {
    if (corporateAccounts.length > 0) {
      setShowAccountsList(true);
    } else {
      navigate("/corporate-form");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (showAccountsList) {
    return (
      <UserAccountsList
        accountType="corporate"
        accounts={corporateAccounts}
        onAddNew={() => navigate("/corporate-form")}
      />
    );
  }

  // Check if should show insufficient recharge message
  const approvedAccount = corporateAccounts.find(account => account.status === 'approved');
  if (showInsufficientMessage && approvedAccount && !approvedAccount.show_recharge_popup) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto">
        <header className="bg-white border-b border-border sticky top-0 z-40">
          <div className="flex items-center h-14 px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Corporate Account</h1>
          </div>
        </header>
        <main className="px-4 py-6">
          <InsufficientRechargeMessage accountType="corporate" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="flex items-center h-14 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Corporate Account</h1>
        </div>
      </header>
      
      <main className="px-4 py-6 space-y-6 animate-slide-up pb-20">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            💎 Life-Changing Opportunity
          </h2>
          <p className="text-lg font-semibold text-muted-foreground">
            for All NRX PAY Members
          </p>
        </div>

        {/* Hero Banner - Mobile Optimized */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl animate-scale-in">
          <div className="aspect-[16/10] sm:aspect-[16/9] w-full">
            <img 
              src="/lovable-uploads/cdd47bcd-5651-4bb2-b5cc-2bdb150770c3.png" 
              alt="Earn up to 5 Lakh everyday with NRX PAY Corporate Account"
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700 brightness-110 contrast-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-orange-500/10"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-4 right-4 animate-pulse">
            <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg"></div>
          </div>
          <div className="absolute bottom-6 left-6 animate-bounce">
            <div className="w-2 h-2 bg-orange-400 rounded-full shadow-lg"></div>
          </div>
          <div className="absolute top-8 left-8 animate-pulse delay-300">
            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full shadow-lg"></div>
          </div>
        </div>

        {/* Description */}
        <Card className="p-6 space-y-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm">💼</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-800">
                Step into the World of Corporate Business — Earn Big, Risk-Free!
              </p>
              <p className="text-sm text-muted-foreground">
                This is the corporate account business where you can earn more than ₹1 lakh daily, up to ₹20 lakh or more in total! Join thousands of successful members already earning.
              </p>
            </div>
          </div>
        </Card>

        {/* Upload Button */}
        <Button
          onClick={handleUploadClick}
          className="w-full h-14 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in"
        >
          🚀 {corporateAccounts.length > 0 ? 'View My Accounts' : 'Upload Corporate Account Now'}
        </Button>

        {/* Available Funds */}
        <AvailableFunds />

        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">💎 Why Choose Us?</h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-sm">100% Secure & Reliable</p>
                <p className="text-xs text-muted-foreground">All funds are real game-related transactions</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-sm">Daily Bonus Payouts</p>
                <p className="text-xs text-muted-foreground">Withdraw anytime, no lock-ins</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-sm">High Returns, Zero Risk</p>
                <p className="text-xs text-muted-foreground">Trusted platform with years of stable operations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Who Can Join */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">🔥 Who Can Join?</h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <div>
                <p className="font-medium text-sm">New to corporate accounts?</p>
                <p className="text-xs text-muted-foreground">We'll guide you step-by-step!</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <div>
                <p className="font-medium text-sm">Experienced users?</p>
                <p className="text-xs text-muted-foreground">You know the potential — now it's time to scale up!</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <div>
                <p className="font-medium text-sm">Big investors?</p>
                <p className="text-xs text-muted-foreground">Our VIP channel is ready to help you earn even more!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Options */}
        <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">🏦</div>
            <div>
              <p className="font-bold text-base text-emerald-800">Multiple Bank Options Available</p>
              <p className="text-sm text-emerald-600 font-medium">Start earning from Day 1!</p>
            </div>
          </div>
        </Card>

        {/* Convincing Bottom Section */}
        <div className="space-y-4 mt-8">
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
            <div className="text-center space-y-3">
              <div className="text-4xl">⭐</div>
              <h3 className="text-xl font-bold text-orange-800">Don't Miss This Golden Opportunity!</h3>
              <p className="text-sm text-orange-700 font-medium">
                Over 10,000+ members are already earning lakhs monthly. Join the elite circle of successful entrepreneurs.
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-green-800 flex items-center">
                <span className="mr-2">✅</span>
                Guaranteed Success Features
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-700 font-medium">24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-700 font-medium">Instant Payouts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-700 font-medium">No Hidden Fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-700 font-medium">100% Secure</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl">
            <p className="text-lg font-bold mb-2">🎯 Limited Time Offer</p>
            <p className="text-sm opacity-90">
              First 100 corporate accounts get bonus ₹10,000 starting credit!
            </p>
          </div>
        </div>
      </main>
      
      <RechargePopup 
        isOpen={showRechargePopup}
        onClose={handleRechargeClose}
        accountType="corporate"
      />
      
      <ReviewedAccountPopup 
        isOpen={showReviewedPopup}
        onClose={() => setShowReviewedPopup(false)}
        accountType="corporate"
      />
    </div>
  );
};

export default CorporateAccount;