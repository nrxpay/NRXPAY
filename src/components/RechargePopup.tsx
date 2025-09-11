import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface RechargePopupProps {
  isOpen: boolean;
  onClose: () => void;
  accountType: 'savings' | 'current' | 'corporate';
}

const RechargePopup = ({ isOpen, onClose, accountType }: RechargePopupProps) => {
  const navigate = useNavigate();

  const handleRecharge = () => {
    onClose();
    navigate("/recharge");
  };

  const handleSupport = () => {
    onClose();
    navigate("/support-guide");
  };

  const handleCancel = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      const tableName = accountType === 'savings' ? 'savings_accounts' : 
                       accountType === 'current' ? 'current_accounts' : 
                       'corporate_accounts';

      await supabase
        .from(tableName)
        .update({ show_recharge_popup: false })
        .eq('user_id', user.data.user.id);
    } catch (error) {
      console.error('Error updating popup flag:', error);
    }
    onClose();
  };
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
        return 'saving';
      case 'current':
        return 'current';
      case 'corporate':
        return 'corporate';
      default:
        return '';
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-sm mx-auto animate-fade-in">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center flex items-center justify-center gap-2">
            <Lock className="h-5 w-5 text-green-600" />
            Account Status
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-3">
            <p className="text-base font-medium text-green-700">
              Request has been approved. But minimum recharge has not been completed. Please continue to recharge and if completed contact support on telegram to start running
            </p>
            <p className="text-base font-medium">
              You must recharge {getRechargeAmount()} to activate your {getAccountDisplayName()} account
            </p>
            <p className="text-2xl font-bold text-primary">{getRechargeAmount()}</p>
            <div className="text-sm text-muted-foreground">
              <p>The deposit is 100% refundable and can be withdrawed anytime</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-3 sm:gap-2">
          <AlertDialogAction onClick={handleRecharge} className="w-full text-white font-semibold py-3 sm:py-2">
            Recharge Now
          </AlertDialogAction>
          <Button variant="outline" onClick={handleSupport} className="w-full py-3 sm:py-2 font-medium">
            Contact Support
          </Button>
          <Button variant="secondary" onClick={handleCancel} className="w-full py-3 sm:py-2 font-medium">
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RechargePopup;