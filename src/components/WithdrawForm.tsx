import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUSDTRates } from "@/hooks/useUSDTRates";
import { toast } from "sonner";

interface BankAccount {
  user_id: string;
  account_number: string;
  account_holder_name: string;
  bank_name: string;
  branch_name: string;
  ifsc_code: string;
}

interface WithdrawFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const WithdrawForm = ({ isOpen, onClose, onSuccess }: WithdrawFormProps) => {
  const { user } = useAuth();
  const { rates } = useUSDTRates();
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(true);

  const usdtAmount = parseFloat(amount) || 0;
  const inrAmount = usdtAmount * (rates?.sell_rate || 98);
  const isValidAmount = usdtAmount >= 100;

  useEffect(() => {
    if (isOpen && user) {
      fetchBankAccounts();
    }
  }, [isOpen, user]);

  const fetchBankAccounts = async () => {
    if (!user) return;
    
    setLoadingBanks(true);
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (error) throw error;
      setBankAccounts(data || []);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      toast.error('Failed to load bank accounts');
    } finally {
      setLoadingBanks(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('Please log in to submit a withdrawal');
      return;
    }
    
    if (!isValidAmount || !selectedBank) {
      toast.error('Please fill all fields with valid data');
      return;
    }

    setLoading(true);
    try {
      // Get the selected bank account details
      const bankIndex = parseInt(selectedBank.split('-')[1]);
      const selectedBankAccount = bankAccounts[bankIndex];
      
      console.log('Selected bank account:', selectedBankAccount);
      console.log('Bank account index:', bankIndex);
      console.log('Selected bank value:', selectedBank);
      
      const { error } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.id,
          amount_usdt: usdtAmount,
          amount_inr: inrAmount,
          bank_account_id: user.id, // Using user_id as bank account reference for now
          usdt_rate: rates?.sell_rate || 102,
          status: 'ongoing'
        });

      console.log('Withdrawal submission result:', { error });

      if (error) throw error;

      toast.success('Withdrawal request submitted successfully');
      setAmount("");
      setSelectedBank("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      toast.error('Failed to submit withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
            <DialogTitle className="text-lg">Withdraw Funds</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USDT)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount in USDT"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="100"
              step="0.01"
            />
            <p className="text-xs text-muted-foreground">
              Minimum withdrawal: $100 USDT
            </p>
            {!isValidAmount && amount && (
              <p className="text-xs text-red-500">Minimum amount is $100 USDT</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank">Select Bank Account</Label>
            {loadingBanks ? (
              <div className="text-sm text-muted-foreground">Loading bank accounts...</div>
            ) : bankAccounts.length === 0 ? (
              <div className="space-y-3">
                <div className="text-sm text-red-500 p-3 bg-red-50 border border-red-200 rounded-md">
                  No bank accounts found. Please add a bank account first.
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onClose();
                    // Navigate to add bank page - you might need to implement this
                    window.location.href = '/add-bank';
                  }}
                  className="w-full"
                >
                  Add Bank Account First
                </Button>
              </div>
            ) : (
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose bank account" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  {bankAccounts.map((bank, index) => (
                    <SelectItem key={`${bank.user_id}-${index}`} value={`${bank.user_id}-${index}`}>
                      {bank.bank_name} - {bank.account_number.slice(-4)} ({bank.account_holder_name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {usdtAmount > 0 && (
            <Card className="p-4 bg-gray-50">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>USDT Amount:</span>
                  <span className="font-medium">${usdtAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Exchange Rate:</span>
                  <span className="font-medium">1 USDT = ₹{rates?.sell_rate || 98}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>INR Amount:</span>
                  <span>₹{inrAmount.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !isValidAmount || !selectedBank || bankAccounts.length === 0}
          >
            {loading ? "Processing..." : "Submit Withdrawal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawForm;