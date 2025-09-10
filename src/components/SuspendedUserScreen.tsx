import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SuspendedUserScreen = () => {
  const openTelegramSupport = () => {
    window.open('https://t.me/NRXPAYSUPPORT', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 max-w-md mx-auto flex items-center justify-center px-4">
      <Card className="p-8 bg-black/30 backdrop-blur-md border-red-500/20 shadow-2xl">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Account Suspended</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your account has been suspended. Please contact our support team for assistance.
            </p>
          </div>

          <Button
            onClick={openTelegramSupport}
            className="w-full h-12 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300"
          >
            Contact Support
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SuspendedUserScreen;