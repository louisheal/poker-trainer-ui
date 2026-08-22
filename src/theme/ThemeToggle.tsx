import { useTheme } from "@/theme/ThemeProvider";
import { Switch } from "@/components/ui/switch";

export const ThemeToggle = () => {
  const { setTheme } = useTheme();

  const onCheckedChange = (checked: boolean) => {
    if (checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Switch onCheckedChange={onCheckedChange} className="group relative" />
    </div>
  );
};
