import { Switch } from "@headlessui/react";

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}

export function Toggle({ enabled, onChange, label }: ToggleProps) {
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-sm text-gray-300">{label}</span>}
      <Switch
        checked={enabled}
        onChange={onChange}
        className={`${
          enabled ? 'bg-purple-600' : 'bg-gray-600'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
      >
        <span
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  );
}