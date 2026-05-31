import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface RaceFrame { month: string; [key: string]: string | number; }

const COLORS: Record<string, string> = {
    'Tithe':            '#3b82f6',
    'Offering':         '#10b981',
    'Special Offering': '#f59e0b',
    'Building Fund':    '#f97316',
    'Mission Fund':     '#8b5cf6',
};
const FALLBACK = ['#3b82f6', '#10b981', '#f59e0b', '#f97316', '#8b5cf6'];

export default function BarRace({ data }: { data: RaceFrame[] }) {
    const svgRef  = useRef<SVGSVGElement>(null);
    const [frame, setFrame]   = useState(0);
    const [playing, setPlaying] = useState(false);
    const initialized = useRef(false);

    const keys = data.length ? Object.keys(data[0]).filter(k => k !== 'month') : [];

    // Draw / update on frame change
    useEffect(() => {
        if (!svgRef.current || !data.length || !keys.length) return;

        const fd = data[frame];
        const entries = keys
            .map((k, i) => ({ label: k, value: fd[k] as number, color: COLORS[k] ?? FALLBACK[i % FALLBACK.length] }))
            .sort((a, b) => b.value - a.value);

        const margin = { top: 8, right: 100, bottom: 28, left: 130 };
        const totalW = svgRef.current.clientWidth || 500;
        const totalH = 240;
        const w = totalW - margin.left - margin.right;
        const h = totalH - margin.top - margin.bottom;

        const maxVal = d3.max(data.flatMap(fr => keys.map(k => fr[k] as number))) || 1;
        const x = d3.scaleLinear().domain([0, maxVal]).range([0, w]);
        const y = d3.scaleBand().domain(entries.map(e => e.label)).range([0, h]).padding(0.25);

        const svg = d3.select(svgRef.current);

        if (!initialized.current) {
            svg.selectAll('*').remove();
            svg.append('g').attr('class', 'race-g').attr('transform', `translate(${margin.left},${margin.top})`);
            svg.append('g').attr('class', 'x-axis').attr('transform', `translate(${margin.left},${margin.top + h})`);
            svg.append('g').attr('class', 'y-axis').attr('transform', `translate(${margin.left},${margin.top})`);
            initialized.current = true;
        }

        const dur = 600;
        const g = svg.select<SVGGElement>('.race-g');

        // Bars
        g.selectAll<SVGRectElement, typeof entries[0]>('.rbar')
            .data(entries, d => d.label)
            .join(
                enter => enter.append('rect').attr('class', 'rbar')
                    .attr('y', d => y(d.label)!).attr('height', y.bandwidth())
                    .attr('x', 0).attr('width', 0).attr('rx', 4)
                    .attr('fill', d => d.color),
                update => update,
                exit => exit.transition().duration(dur).attr('width', 0).remove(),
            )
            .transition().duration(dur)
            .attr('y', d => y(d.label)!)
            .attr('height', y.bandwidth())
            .attr('width', d => x(d.value))
            .attr('fill', d => d.color);

        // Value labels
        g.selectAll<SVGTextElement, typeof entries[0]>('.rval')
            .data(entries, d => d.label)
            .join(
                enter => enter.append('text').attr('class', 'rval')
                    .attr('x', 4).attr('font-size', 10).attr('fill', '#374151'),
                update => update,
            )
            .transition().duration(dur)
            .attr('x', d => x(d.value) + 6)
            .attr('y', d => y(d.label)! + y.bandwidth() / 2 + 4)
            .text(d => d.value > 0
                ? `PGK ${d.value.toLocaleString('en-PG', { maximumFractionDigits: 0 })}`
                : '');

        // Y axis
        svg.select<SVGGElement>('.y-axis')
            .transition().duration(dur)
            .call(d3.axisLeft(y).tickSize(0) as any)
            .call((gg: any) => gg.select('.domain').remove())
            .selectAll('text')
            .attr('font-size', 10).attr('fill', '#6b7280');

        // X axis
        svg.select<SVGGElement>('.x-axis')
            .transition().duration(dur)
            .call(d3.axisBottom(x).ticks(5).tickFormat((v: any) =>
                v >= 1000 ? `K${(v / 1000).toFixed(0)}k` : `${v}`) as any)
            .call((gg: any) => gg.select('.domain').remove())
            .selectAll('text').attr('font-size', 9).attr('fill', '#9ca3af');
    }, [frame, data]); // eslint-disable-line react-hooks/exhaustive-deps

    // Autoplay
    useEffect(() => {
        if (!playing) return;
        const id = setInterval(() => {
            setFrame(f => {
                if (f >= data.length - 1) { setPlaying(false); return f; }
                return f + 1;
            });
        }, 900);
        return () => clearInterval(id);
    }, [playing, data.length]);

    // Reset initialized flag when data changes
    useEffect(() => { initialized.current = false; }, [data]);

    return (
        <div>
            <svg ref={svgRef} className="w-full" height={240} />
            <div className="flex items-center justify-center gap-3 mt-3">
                <button
                    onClick={() => setFrame(f => Math.max(0, f - 1))}
                    disabled={frame === 0}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                >
                    <SkipBack className="h-4 w-4 text-gray-500" />
                </button>
                <button
                    onClick={() => {
                        if (frame >= data.length - 1) setFrame(0);
                        setPlaying(p => !p);
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gray-900 text-white text-xs font-medium"
                >
                    {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    {playing ? 'Pause' : 'Play'}
                </button>
                <button
                    onClick={() => setFrame(f => Math.min(data.length - 1, f + 1))}
                    disabled={frame >= data.length - 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                >
                    <SkipForward className="h-4 w-4 text-gray-500" />
                </button>
                <span className="text-xs text-gray-400 ml-1 tabular-nums w-16">
                    {data[frame]?.month ?? ''}
                </span>
            </div>
        </div>
    );
}
