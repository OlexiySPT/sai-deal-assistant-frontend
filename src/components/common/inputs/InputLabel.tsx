export default function InputLabel({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <label className="mt- mr-2 text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
      {label}:
    </label>
  );
}
