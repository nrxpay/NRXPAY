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
      <AlertDialogContent className="max-w-md mx-auto animate-fade-in border-0 shadow-2xl">
        <AlertDialogHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-green-600" />
          </div>
          <AlertDialogTitle className="text-xl font-bold text-gray-900">
            Account Approved ✅
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-4 pt-2">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
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
          <AlertDialogAction onClick={handleRecharge} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3">
            Recharge Now
          </AlertDialogAction>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSupport} className="flex-1 py-2">
              Support
            </Button>
            <Button variant="ghost" onClick={handleCancel} className="flex-1 py-2">
              Later
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RechargePopup;