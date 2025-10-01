import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMinimumWithdrawal } from "@/hooks/useMinimumWithdrawal";

const MinimumWithdrawalManagement = () => {
  const { config, updateConfig } = useMinimumWithdrawal();
  const [amount, setAmount] = useState(config?.minimum_amount?.toString() || "");
  const [currency, setCurrency] = useState(config?.currency || "USDT");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({ amount: parseFloat(amount), currency });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minimum Withdrawal Configuration</CardTitle>
        <CardDescription>
          Set the minimum withdrawal amount for users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Minimum Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter minimum amount"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="USDT"
              required
            />
          </div>
          <Button type="submit">Update Configuration</Button>
        </form>
        {config && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Current: {config.minimum_amount} {config.currency}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MinimumWithdrawalManagement;
