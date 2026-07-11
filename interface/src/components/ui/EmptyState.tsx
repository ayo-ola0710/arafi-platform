import { Link } from 'react-router-dom';

interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
    ctaLabel?: string;
    ctaTo?: string;
    onCtaClick?: () => void;
}

export default function EmptyState({ icon, title, description, ctaLabel, ctaTo, onCtaClick }: EmptyStateProps) {
    return (
        <tr>
            <td colSpan={99}>
                <div className="flex flex-col items-center justify-center py-14 px-6 gap-3 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-1 border border-outline-variant/50">
                        <span className="material-symbols-outlined text-[28px] text-on-surface-variant">{icon}</span>
                    </div>
                    <p className="font-bold text-on-surface text-sm">{title}</p>
                    <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">{description}</p>
                    {ctaLabel && ctaTo && (
                        <Link
                            to={ctaTo}
                            className="mt-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-label-mono font-bold hover:brightness-110 transition-all flex items-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                            {ctaLabel}
                        </Link>
                    )}
                    {ctaLabel && onCtaClick && (
                        <button
                            onClick={onCtaClick}
                            className="mt-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-label-mono font-bold hover:brightness-110 transition-all flex items-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                            {ctaLabel}
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}
