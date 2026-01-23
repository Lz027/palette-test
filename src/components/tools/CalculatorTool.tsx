import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Calculator, Copy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CalculatorToolProps {
  boardId: string;
  onClose: () => void;
}

export const CalculatorTool = ({ boardId, onClose }: CalculatorToolProps) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(display);
    } else if (operation) {
      const currentValue = parseFloat(previousValue);
      let result = 0;

      switch (operation) {
        case '+': result = currentValue + inputValue; break;
        case '-': result = currentValue - inputValue; break;
        case '×': result = currentValue * inputValue; break;
        case '÷': result = inputValue !== 0 ? currentValue / inputValue : 0; break;
        case '%': result = currentValue % inputValue; break;
      }

      const resultStr = String(parseFloat(result.toFixed(10)));
      setDisplay(resultStr);
      setPreviousValue(resultStr);
      
      if (nextOperation === '=') {
        setHistory(prev => [...prev.slice(-4), `${currentValue} ${operation} ${inputValue} = ${resultStr}`]);
      }
    }

    setWaitingForOperand(true);
    setOperation(nextOperation === '=' ? null : nextOperation);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(display);
    toast.success('Copied to clipboard!');
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const handleButtonClick = (btn: string) => {
    if (btn >= '0' && btn <= '9') inputDigit(btn);
    else if (btn === '.') inputDecimal();
    else if (btn === 'C') clear();
    else if (btn === '±') setDisplay(String(-parseFloat(display)));
    else if (['+', '-', '×', '÷', '%', '='].includes(btn)) performOperation(btn);
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Calculator className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="font-semibold">Calculator</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* History */}
        {history.length > 0 && (
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {history.map((item, i) => (
              <div key={i} className="text-xs text-muted-foreground text-right">
                {item}
              </div>
            ))}
          </div>
        )}

        {/* Display */}
        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {previousValue && operation ? `${previousValue} ${operation}` : ''}
            </span>
            <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-6 w-6">
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <div className="text-3xl font-bold text-right font-mono truncate">
            {display}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {buttons.flat().map((btn) => (
            <motion.button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "h-14 rounded-xl font-semibold text-lg transition-colors",
                btn === '0' && "col-span-2",
                ['÷', '×', '-', '+', '='].includes(btn)
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : ['C', '±', '%'].includes(btn)
                  ? "bg-muted hover:bg-muted/80 text-foreground"
                  : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              )}
            >
              {btn}
            </motion.button>
          ))}
        </div>

        {/* Link to Board */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="text-xs text-muted-foreground">Result can be linked to board columns</span>
          <ArrowRight className="w-3 h-3 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};