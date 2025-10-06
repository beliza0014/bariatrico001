import * as React from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ModernCalendarProps = {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  onConfirm?: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  initialFocus?: boolean;
};

function ModernCalendar({
  className,
  selected,
  onSelect,
  onConfirm,
  disabled,
  initialFocus,
  ...props
}: ModernCalendarProps) {
  const [tempSelected, setTempSelected] = React.useState<Date | undefined>(selected);

  const handleDateSelect = (date: Date | undefined) => {
    setTempSelected(date);
    onSelect?.(date);
  };

  const handleConfirm = () => {
    if (tempSelected && onConfirm) {
      onConfirm(tempSelected);
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg overflow-hidden">
      <DayPicker
        mode="single"
        selected={tempSelected}
        onSelect={handleDateSelect}
        disabled={disabled}
        initialFocus={initialFocus}
        locale={ptBR}
        className={cn("p-4", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-3 sm:space-x-3 sm:space-y-0",
          month: "space-y-3",
          caption: "flex justify-center pt-1 relative items-center mb-3",
          caption_label: "text-base font-semibold text-foreground",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-accent rounded-md transition-all duration-200"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex mb-2",
          head_cell: "text-muted-foreground rounded-md w-8 h-8 font-medium text-xs flex items-center justify-center",
          row: "flex w-full mt-1",
          cell: "h-8 w-8 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
          day: cn(
            "h-8 w-8 p-0 font-normal text-sm rounded-md transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          ),
          day_range_end: "day-range-end",
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-md font-semibold",
          day_today: "bg-accent text-accent-foreground font-semibold border-2 border-primary/30",
          day_outside: "day-outside text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
        }}
        {...props}
      />
      
      {/* Seção inferior com data selecionada e botão de confirmação */}
      <div className="border-t border-border bg-muted/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xs">
            {tempSelected ? (
              <span className="font-medium text-foreground">
                {format(tempSelected, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            ) : (
              <span className="text-muted-foreground">Nenhuma data selecionada</span>
            )}
          </div>
          
          <Button
            onClick={handleConfirm}
            disabled={!tempSelected}
            size="sm"
            className="h-7 px-3 text-xs min-w-12 transition-all duration-200"
          >
            <Check className="h-3 w-3 mr-1" />
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}

ModernCalendar.displayName = "ModernCalendar";

export { ModernCalendar };