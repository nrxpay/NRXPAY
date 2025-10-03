import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface RechargeSpinWheelProps {
  isOpen: boolean;
  onClose: () => void;
}

const RechargeSpinWheel = ({ isOpen, onClose }: RechargeSpinWheelProps) => {
  const { user } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonBonus, setWonBonus] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Prize segments - 1% to 40%
  const prizes = [
    { percentage: 20, color: "from-yellow-400 to-yellow-600", angle: 0 },
    { percentage: 5, color: "from-pink-400 to-pink-600", angle: 45 },
    { percentage: 10, color: "from-purple-400 to-purple-600", angle: 90 },
    { percentage: 1, color: "from-blue-400 to-blue-600", angle: 135 },
    { percentage: 15, color: "from-green-400 to-green-600", angle: 180 },
    { percentage: 30, color: "from-red-400 to-red-600", angle: 225 },
    { percentage: 25, color: "from-indigo-400 to-indigo-600", angle: 270 },
    { percentage: 40, color: "from-orange-400 to-orange-600", angle: 315 },
  ];

  useEffect(() => {
    if (isOpen && user) {
      checkSpinStatus();
    }
  }, [isOpen, user]);

  const checkSpinStatus = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("recharge_bonus_spins")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setHasSpun(data.has_spun);
        if (data.has_spun) {
          setWonBonus(data.bonus_percentage);
        }
      }
    } catch (error) {
      console.error("Error checking spin status:", error);
    } finally {
      setLoading(false);
    }
  };

  const spinWheel = async () => {
    if (!user || hasSpun || isSpinning) return;

    setIsSpinning(true);

    // Calculate rotation to land on 20% (index 0, angle 0)
    // Add 5 full spins (1800 degrees) + offset to land on 20%
    const targetAngle = 0; // 20% is at 0 degrees
    const spins = 5; // Number of full rotations
    const finalRotation = 360 * spins + targetAngle;

    setRotation(finalRotation);

    // Wait for animation to complete
    setTimeout(async () => {
      setIsSpinning(false);
      setWonBonus(20);
      setHasSpun(true);

      try {
        // Record the spin in database
        const { error } = await supabase
          .from("recharge_bonus_spins")
          .upsert({
            user_id: user.id,
            bonus_percentage: 20,
            has_spun: true,
            spun_at: new Date().toISOString(),
          });

        if (error) throw error;

        toast.success(`🎉 Congratulations! You won 20% recharge bonus!`, {
          duration: 5000,
        });
      } catch (error) {
        console.error("Error recording spin:", error);
        toast.error("Failed to record your spin. Please contact support.");
      }
    }, 4000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            🎊 Festival Recharge Bonus Spin! 🎊
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Wheel Container */}
            <div className="relative mx-auto w-80 h-80">
              {/* Festival decorations */}
              <div className="absolute -top-4 -left-4 animate-pulse">
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="absolute -top-4 -right-4 animate-pulse" style={{ animationDelay: "0.5s" }}>
                <Sparkles className="w-8 h-8 text-pink-400" />
              </div>
              <div className="absolute -bottom-4 -left-4 animate-pulse" style={{ animationDelay: "1s" }}>
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <div className="absolute -bottom-4 -right-4 animate-pulse" style={{ animationDelay: "1.5s" }}>
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>

              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-500 drop-shadow-lg"></div>
              </div>

              {/* Wheel */}
              <div
                className="w-full h-full rounded-full relative overflow-hidden shadow-2xl border-8 border-yellow-400 animate-glow"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? "transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
                }}
              >
                {prizes.map((prize, index) => (
                  <div
                    key={index}
                    className={`absolute w-full h-full bg-gradient-to-br ${prize.color}`}
                    style={{
                      clipPath: "polygon(50% 50%, 100% 0, 100% 50%)",
                      transform: `rotate(${prize.angle}deg)`,
                      transformOrigin: "center",
                    }}
                  >
                    <div
                      className="absolute font-bold text-white text-xl drop-shadow-lg"
                      style={{
                        top: "30%",
                        right: "25%",
                        transform: `rotate(${22.5}deg)`,
                      }}
                    >
                      {prize.percentage}%
                    </div>
                  </div>
                ))}

                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-xl border-4 border-white flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SPIN</span>
                </div>
              </div>
            </div>

            {/* Result Message */}
            {wonBonus && (
              <div className="text-center bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 p-4 rounded-lg animate-pulse">
                <p className="text-white font-bold text-xl">
                  🎉 You Won {wonBonus}% Bonus! 🎉
                </p>
                <p className="text-white/90 text-sm mt-2">
                  Your next recharge will include this bonus!
                </p>
              </div>
            )}

            {/* Spin Button */}
            <div className="text-center space-y-2">
              {hasSpun ? (
                <p className="text-muted-foreground font-medium">
                  You've already used your spin! Come back next time! 🎊
                </p>
              ) : (
                <>
                  <Button
                    onClick={spinWheel}
                    disabled={isSpinning || hasSpun}
                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-700 text-white shadow-lg"
                  >
                    {isSpinning ? "🎰 Spinning..." : "🎰 Spin Now!"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    * One spin per user only
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RechargeSpinWheel;
