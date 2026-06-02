import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface HeatDay { date: string; amount: number; }

export default function CalendarHeatmap({ data }: { data: HeatDay[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const cell  = 12;
        const gap   = 2;
        const step  = cell + gap;
        const margin = { top: 20, right: 8, bottom: 6, left: 28 };

        const now   = new Date();
        const start = new Date(now);
        start.setFullYear(start.getFullYear() - 1);
        start.setDate(start.getDate() + 1);

        const dataMap = new Map(data.map(d => [d.date, d.amount]));
        const fmt     = d3.timeFormat('%Y-%m-%d');
        const days    = d3.timeDays(start, new Date(now.getTime() + 86_400_000));
        const weeks   = d3.timeWeeks(d3.timeWeek.floor(start), new Date(now.getTime() + 7 * 86_400_000));

        const maxAmt = d3.max(data, d => d.amount) || 1;
        const color  = d3.scaleSequential([0, maxAmt], d3.interpolate('#e2e8f0', '#059669'));

        const svgW = weeks.length * step + margin.left + margin.right;
        const svgH = 7 * step + margin.top + margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('width', svgW).attr('height', svgH);

        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        // Cells
        g.selectAll('rect')
            .data(days)
            .join('rect')
            .attr('x', d => d3.timeWeek.count(d3.timeWeek.floor(start), d) * step)
            .attr('y', d => d.getDay() * step)
            .attr('width', cell).attr('height', cell).attr('rx', 2)
            .attr('fill', d => {
                const v = dataMap.get(fmt(d)) ?? 0;
                return v > 0 ? color(v) : '#f1f5f9';
            })
            .append('title')
            .text(d => {
                const v = dataMap.get(fmt(d)) ?? 0;
                return `${fmt(d)}: ${v > 0 ? `PGK ${v.toFixed(2)}` : 'no giving'}`;
            });

        // Month labels
        const monthFmt = d3.timeFormat('%b');
        g.selectAll('.mlbl')
            .data(d3.timeMonths(d3.timeMonth.floor(start), now))
            .join('text')
            .attr('class', 'mlbl')
            .attr('x', d => d3.timeWeek.count(d3.timeWeek.floor(start), d3.timeWeek.ceil(d)) * step)
            .attr('y', -6)
            .attr('font-size', 9).attr('fill', '#94a3b8')
            .text(d => monthFmt(d));

        // Day-of-week labels (Mon / Wed / Fri)
        [['Mon', 1], ['Wed', 3], ['Fri', 5]].forEach(([lbl, day]) => {
            svg.append('text')
                .attr('x', margin.left - 4)
                .attr('y', margin.top + (day as number) * step + cell * 0.8)
                .attr('text-anchor', 'end')
                .attr('font-size', 8).attr('fill', '#94a3b8')
                .text(lbl as string);
        });

        // Color legend
        const legW = 80;
        const legG = svg.append('g').attr('transform', `translate(${svgW - legW - margin.right},${svgH - 14})`);
        d3.scaleLinear().domain([0, maxAmt]).range([0, legW]);
        const defs = svg.append('defs');
        const grad = defs.append('linearGradient').attr('id', 'heat-grad');
        grad.append('stop').attr('offset', '0%').attr('stop-color', '#e2e8f0');
        grad.append('stop').attr('offset', '100%').attr('stop-color', '#059669');
        legG.append('rect').attr('width', legW).attr('height', 6).attr('rx', 2).attr('fill', 'url(#heat-grad)');
        legG.append('text').attr('y', 14).attr('font-size', 8).attr('fill', '#94a3b8').text('Less');
        legG.append('text').attr('x', legW).attr('y', 14).attr('text-anchor', 'end').attr('font-size', 8).attr('fill', '#94a3b8').text('More');
    }, [data]);

    return (
        <div ref={containerRef} className="overflow-x-auto">
            <svg ref={svgRef} />
        </div>
    );
}
