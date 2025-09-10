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
      <AlertDialogContent className="max-w-sm mx-auto animate-fade-in">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center flex items-center justify-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Insufficient Recharge
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-3">
            <p className="text-base font-medium text-green-700">
              🎉 Your account has been approved and is eligible to run but you need to recharge first.
            </p>
            <p className="text-base font-medium">
              You need to recharge {getRechargeAmount()} to access your {getAccountDisplayName()} account features.
            </p>
            <p className="text-2xl font-bold text-orange-600">{getRechargeAmount()}</p>
            <div className="text-sm text-muted-foreground">
              <p>The deposit is 100% refundable and can be withdrawn anytime</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-3 sm:gap-2">
          <AlertDialogAction onClick={handleRecharge} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 sm:py-2">
            Recharge Now
          </AlertDialogAction>
          <Button variant="outline" onClick={handleSupport} className="w-full py-3 sm:py-2 font-medium">
            Contact Support
          </Button>
          <Button variant="secondary" onClick={onClose} className="w-full py-3 sm:py-2 font-medium">
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InsufficientRechargePopup;