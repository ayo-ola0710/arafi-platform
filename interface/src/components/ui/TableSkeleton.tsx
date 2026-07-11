interface TableSkeletonProps {
    rows?: number;
    cols: number;
    /** Width hint per column index — e.g. ['w-1/4', 'w-1/3', 'w-1/5'] */
    colWidths?: string[];
}

export default function TableSkeleton({ rows = 4, cols, colWidths }: TableSkeletonProps) {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <tr key={rowIdx} className="border-b border-outline-variant">
                    {Array.from({ length: cols }).map((_, colIdx) => (
                        <td key={colIdx} className="px-6 py-4">
                            <div
                                className={`h-3.5 rounded-full bg-surface-container-high animate-pulse ${colWidths?.[colIdx] ?? 'w-3/4'}`}
                                style={{ animationDelay: `${(rowIdx * cols + colIdx) * 60}ms` }}
                            />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}
