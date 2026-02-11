
import { cn } from '../../lib/utils';

interface LogoProps {
    className?: string;
    showText?: boolean;
    variant?: 'light' | 'dark';
}

export function Logo({ className, showText = true, variant = 'dark' }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 shadow-sm transition-transform hover:scale-105">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                >
                    {/* Stylized Africa Map / Abstract shape */}
                    <path
                        d="M16.5 3C16.5 3 19 6 18 10C17 14 13 18 12 21C11 18 7 14 6 10C5 6 7.5 3 7.5 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-90"
                    />
                    {/* Ethiopia Location Star/Dot at the Horn */}
                    <circle cx="14" cy="9" r="1.5" fill="currentColor" className="animate-pulse" />
                </svg>
            </div>
            {showText && (
                <span className={cn(
                    "text-xl font-bold tracking-tight",
                    variant === 'dark' ? "text-slate-900" : "text-white"
                )}>
                    Afri<span className="text-primary-600">Talent</span>
                </span>
            )}
        </div>
    );
}
