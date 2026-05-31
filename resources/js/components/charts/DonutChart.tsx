import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Slice { label: string; value: number; }

const COLORS = ['#10b981', '#6b7280', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function DonutChart({ data, centerLabel }: { data: Slice[]; centerLabel?: string }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const size   = 180;
    const radius = size / 2 - 12;
    const inner  = radius * 0.58;

    useEffect(() => {
        if (!svgRef.current || !data?.length) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const g = svg.append('g').attr('transform', `translate(${size / 2},${size / 2})`);

        const pie  = d3.pie<Slice>().value(d => d.value).sort(null);
        const arc  = d3.arc<d3.PieArcDatum<Slice>>().innerRadius(inner).outerRadius(radius);
        const arcH = d3.arc<d3.PieArcDatum<Slice>>().innerRadius(inner).outerRadius(radius + 7);

        const slices = g.selectAll<SVGPathElement, d3.PieArcDatum<Slice>>('.slice')
            .data(pie(data))
            .join('path')
            .attr('class', 'slice')
            .attr('fill', (_, i) => COLORS[i % COLORS.length])
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('mouseover', function (_, d) {
                d3.select(this).transition().duration(150).attr('d', arcH(d)!);
            })
            .on('mouseout', function (_, d) {
                d3.select(this).transition().duration(150).attr('d', arc(d)!);
            });

        slices.transition().duration(800).attrTween('d', function (d) {
            const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return t => arc(i(t))!;
        });

        const total = d3.sum(data, d => d.value);

        if (centerLabel) {
            g.append('text').attr('text-anchor', 'middle').attr('dy', '-0.4em')
                .attr('font-size', 10).attr('fill', '#9ca3af').text(centerLabel);
        }
        g.append('text').attr('text-anchor', 'middle')
            .attr('dy', centerLabel ? '1em' : '0.35em')
            .attr('font-size', 24).attr('font-weight', 700).attr('fill', '#111827')
            .text(total.toLocaleString());
    }, [data, centerLabel, inner, radius]);

    const total = data?.reduce((s, d) => s + d.value, 0) ?? 0;

    return (
        <div className="flex items-center gap-5">
            <svg ref={svgRef} width={size} height={size} className="flex-shrink-0" />
            <ul className="space-y-2 text-sm w-full">
                {data?.map((d, i) => (
                    <li key={d.label} className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                            style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-gray-600 flex-1">{d.label}</span>
                        <span className="font-semibold text-gray-900">{d.value.toLocaleString()}</span>
                        <span className="text-gray-400 text-xs w-10 text-right">
                            {total > 0 ? `${((d.value / total) * 100).toFixed(0)}%` : '—'}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
