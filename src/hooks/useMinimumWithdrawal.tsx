import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useMinimumWithdrawal = () => {
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ["minimum-withdrawal-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("minimum_withdrawal_config")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const updateConfig = useMutation({
    mutationFn: async ({ amount, currency }: { amount: number; currency: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if config exists
      const { data: existing } = await supabase
        .from("minimum_withdrawal_config")
        .select("id")
        .eq("is_active", true)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("minimum_withdrawal_config")
          .update({ minimum_amount: amount, currency })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from("minimum_withdrawal_config")
          .insert({ minimum_amount: amount, currency, created_by: user.id });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["minimum-withdrawal-config"] });
      toast.success("Minimum withdrawal amount updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update minimum withdrawal amount");
      console.error("Error updating config:", error);
    },
  });

  return {
    config,
    isLoading,
    updateConfig: updateConfig.mutate,
  };
};
