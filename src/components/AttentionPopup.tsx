import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AttentionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  usdtRate: number;
}

const AttentionPopup = ({ isOpen, onClose, usdtRate }: AttentionPopupProps) => {
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
          <AlertDialogTitle className="text-center text-lg font-bold text-red-600 pt-4">
            ⚠️ Attention
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-base font-bold text-blue-800">
                1 USDT = {usdtRate} INR
              </p>
            </div>
            
            <p className="text-sm font-medium text-orange-600">
              Upload bank accounts manually only on NRX PAY
            </p>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg space-y-2">
              <p className="text-sm font-medium text-yellow-800">
                • Savings requires minimal <span className="font-bold">$200</span> recharge
              </p>
              <p className="text-sm font-medium text-yellow-800">
                • Current requires minimal <span className="font-bold">$500</span> recharge
              </p>
              <p className="text-sm font-medium text-yellow-800">
                • Corporate requires minimal <span className="font-bold">$2000</span> recharge
              </p>
            </div>
            
            <p className="text-sm font-medium text-green-600">
              This is not security deposit, it can be withdrawn anytime
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AttentionPopup;