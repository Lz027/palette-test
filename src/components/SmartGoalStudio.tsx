import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Target, CheckCircle2, Calendar, TrendingUp, ShieldCheck, Clock } from "lucide-react";
import { usePalette } from "@/contexts/PaletteContext";
import { toast } from "sonner";

interface SmartGoalStudioProps {
  boardId: string;
  onComplete?: () => void;
}

export const SmartGoalStudio = ({ boardId, onComplete }: SmartGoalStudioProps) => {
  const { boards, updateBoard } = usePalette();
  const board = boards.find(b => b.id === boardId);
  
  const [goal, setGoal] = useState(board?.smartGoal || {
    specific: '',
    measurable: '',
    attainable: '',
    realistic: '',
    timeBound: '',
    deadline: ''
  });

  if (!board) return null;

  const handleSave = () => {
    updateBoard(boardId, { smartGoal: goal });
    toast.success("SMART Goal updated!");
    if (onComplete) onComplete();
  };

  const steps = [
    {
      id: 'specific',
      title: 'Specific',
      description: 'What exactly do you want to achieve?',
      icon: <Target className="w-5 h-5 text-palette-purple" />,
      placeholder: 'e.g., Increase Instagram followers by 20% through daily reels.'
    },
    {
      id: 'measurable',
      title: 'Measurable',
      description: 'How will you track your progress?',
      icon: <TrendingUp className="w-5 h-5 text-palette-red" />,
      placeholder: 'e.g., Use Instagram Insights to track follower count weekly.'
    },
    {
      id: 'attainable',
      title: 'Attainable',
      description: 'Is this goal realistic with your resources?',
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      placeholder: 'e.g., I have 1 hour daily to create and edit reels.'
    },
    {
      id: 'realistic',
      title: 'Realistic',
      description: 'Why is this goal important now?',
      icon: <ShieldCheck className="w-5 h-5 text-blue-500" />,
      placeholder: 'e.g., Growing my audience is key for my upcoming product launch.'
    },
    {
      id: 'timeBound',
      title: 'Time-bound',
      description: 'What is your target date?',
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      placeholder: 'e.g., Achieve this within the next 30 days.'
    }
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-black tracking-tighter">SMART Goal Studio</h2>
        <p className="text-muted-foreground">Craft a solid foundation for "{board.name}"</p>
      </div>

      <div className="grid gap-6">
        {steps.map((step) => (
          <Card key={step.id} className="rounded-[2rem] border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-background shadow-sm">
                  {step.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription className="text-xs">{step.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Textarea 
                placeholder={step.placeholder}
                value={(goal as any)[step.id]}
                onChange={(e) => setGoal({ ...goal, [step.id]: e.target.value })}
                className="min-h-[100px] rounded-2xl bg-muted/20 border-none focus-visible:ring-2 focus-visible:ring-palette-purple/20 resize-none"
              />
            </CardContent>
          </Card>
        ))}

        <Card className="rounded-[2rem] border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/50 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-background shadow-sm">
                <Calendar className="w-5 h-5 text-palette-purple" />
              </div>
              <div>
                <CardTitle className="text-lg">Target Deadline</CardTitle>
                <CardDescription className="text-xs">When do you want to cross the finish line?</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <Input 
              type="date"
              value={goal.deadline}
              onChange={(e) => setGoal({ ...goal, deadline: e.target.value })}
              className="h-12 rounded-2xl bg-muted/20 border-none focus-visible:ring-2 focus-visible:ring-palette-purple/20"
            />
          </CardContent>
        </Card>
      </div>

      <Button 
        onClick={handleSave}
        className="w-full h-14 rounded-[1.5rem] bg-palette-purple hover:bg-palette-purple/90 text-lg font-bold shadow-lg shadow-palette-purple/20"
      >
        Save SMART Goal
      </Button>
    </div>
  );
};
