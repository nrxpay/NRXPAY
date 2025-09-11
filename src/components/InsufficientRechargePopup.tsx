import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InsufficientRechargePopupProps {
  isOpen: boolean;
  onClose: () => void;
  accountType: 'savings' | 'current' | 'corporate';
}

const InsufficientRechargePopup = ({ isOpen, onClose, accountType }: InsufficientRechargePopupProps) => {
  const navigate = useNavigate();

  const getRechargeAmount = () => {
    switch (accountType) {
      case 'savings':
        return '$300';
      case 'current':
        return '$700';
      case 'corporate':
        return '$2000';
      default:
        return '$0';
    }
  };

  const getAccountDisplayName = () => {
    switch (accountType) {
      case 'savings':
        return 'Savings';
      case 'current':
        return 'Current';
      case 'corporate':
        return 'Corporate';
      default:
        return '';
    }
  };

  const handleRecharge = () => {
    onClose();
    navigate("/recharge");
  };

  const handleSupport = () => {
    onClose();
    navigate("/support-guide");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md mx-auto animate-fade-in border-0 shadow-2xl">
        <AlertDialogHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
          <AlertDialogTitle className="text-xl font-bold text-gray-900">
            Account Approved ✅
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-4 pt-2">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 animate-pulse">
              <p className="text-sm font-medium text-amber-800">
                Complete recharge to activate
              </p>
              <p className="text-2xl font-bold text-amber-700 mt-2">{getRechargeAmount()}</p>
            </div>
            <p className="text-xs text-gray-600">
              Contact support on Telegram after recharge completion
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2 pt-0">
          <AlertDialogAction onClick={handleRecharge} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 transform transition-all duration-200 hover:scale-105">
            Recharge Now
          </AlertDialogAction>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSupport} className="flex-1 py-2 hover:scale-105 transition-transform">
              Support
            </Button>
            <Button variant="ghost" onClick={onClose} className="flex-1 py-2 hover:scale-105 transition-transform">
              Later
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InsufficientRechargePopup;