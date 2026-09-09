import { Link } from 'react-router-dom';

export function LegalConsentCheckbox({
  checked,
  onChange,
  id = 'legal-consent',
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  id?: string;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 text-sm text-ink-600 cursor-pointer select-none">
      <input
        id={id}
        type="checkbox"
        required
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-4 h-4 accent-primary-900 shrink-0"
      />
      <span>
        I have read and agree to the{' '}
        <Link to="/privacy-policy/" target="_blank" className="text-primary-700 font-semibold hover:underline">
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link to="/terms-conditions/" target="_blank" className="text-primary-700 font-semibold hover:underline">
          Terms &amp; Conditions
        </Link>
        .
      </span>
    </label>
  );
}
