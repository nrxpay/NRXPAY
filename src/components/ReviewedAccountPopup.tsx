import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ReviewedAccountPopupProps {
  isOpen: boolean;
  onClose: () => void;
  accountType: 'savings' | 'current' | 'corporate';
}

const ReviewedAccountPopup = ({ isOpen, onClose, accountType }: ReviewedAccountPopupProps) => {
  const navigate = useNavigate();

  const handleRecharge = () => {
    onClose();
    navigate("/recharge");
  };

  const getRechargeAmount = () => {
    switch (accountType) {
      case 'savings':
        return '$200';
      case 'current':
        return '$600';
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

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-sm mx-auto animate-fade-in">
        <AlertDialogHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
          <AlertDialogTitle className="text-center flex items-center justify-center gap-2 pt-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Account Reviewed
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-4">
            <p className="text-base font-medium text-green-600">
              Your account has been reviewed and is eligible for otp work
            </p>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">
                {getAccountDisplayName()} account requires recharge to be done before it can start working
              </p>
              <p className="text-2xl font-bold text-primary mt-2">{getRechargeAmount()}</p>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>The deposit is 100% refundable and can be withdrawn anytime</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleRecharge} className="w-full">
            Proceed to Recharge
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReviewedAccountPopup;