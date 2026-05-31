import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface AgeGroup {
    age_group: string;
    male: number;
    female: number;
}

export default function AgePyramid({ data }: { data: AgeGroup[] }) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || !data?.length) return;

        const margin = { top: 24, right: 16, bottom: 28, left: 16 };
        const totalW = svgRef.current.clientWidth || 500;
        const totalH = 260;
        const w = totalW - margin.left - margin.right;
        const h = totalH - margin.top - margin.bottom;
        const half = w / 2 - 32; // space for center labels

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const g = svg.append('g').attr('transform', `translate(${margin.left + w / 2},${margin.top})`);

        const maxVal = d3.max(data, d => Math.max(d.male, d.female)) || 1;
        const x = d3.scaleLinear().domain([0, maxVal]).range([0, half]);
        const y = d3.scaleBand().domain(data.map(d => d.age_group)).range([0, h]).padding(0.2);

        // Gridlines
        for (let tick of x.ticks(4)) {
            g.append('line')
                .attr('x1', x(tick)).attr('x2', x(tick))
                .attr('y1', 0).attr('y2', h)
                .attr('stroke', '#f1f5f9').attr('stroke-width', 1);
            g.append('line')
                .attr('x1', -x(tick)).attr('x2', -x(tick))
                .attr('y1', 0).attr('y2', h)
                .attr('stroke', '#f1f5f9').attr('stroke-width', 1);
        }

        // Female bars (left)
        g.selectAll('.bar-f')
            .data(data)
            .join('rect')
            .attr('class', 'bar-f')
            .attr('x', 0).attr('y', d => y(d.age_group)!)
            .attr('width', 0).attr('height', y.bandwidth())
            .attr('fill', '#ec4899').attr('rx', 3)
            .transition().duration(700).delay((_, i) => i * 60)
            .attr('x', d => -x(d.female))
            .attr('width', d => x(d.female));

        // Male bars (right)
        g.selectAll('.bar-m')
            .data(data)
            .join('rect')
            .attr('class', 'bar-m')
            .attr('x', 0).attr('y', d => y(d.age_group)!)
            .attr('width', 0).attr('height', y.bandwidth())
            .attr('fill', '#3b82f6').attr('rx', 3)
            .transition().duration(700).delay((_, i) => i * 60)
            .attr('width', d => x(d.male));

        // Value labels – female
        g.selectAll('.lbl-f')
            .data(data)
            .join('text')
            .attr('class', 'lbl-f')
            .attr('x', d => -x(d.female) - 4)
            .attr('y', d => y(d.age_group)! + y.bandwidth() / 2 + 4)
            .attr('text-anchor', 'end').attr('font-size', 9).attr('fill', '#9ca3af')
            .text(d => d.female || '');

        // Value labels – male
        g.selectAll('.lbl-m')
            .data(data)
            .join('text')
            .attr('class', 'lbl-m')
            .attr('x', d => x(d.male) + 4)
            .attr('y', d => y(d.age_group)! + y.bandwidth() / 2 + 4)
            .attr('font-size', 9).attr('fill', '#9ca3af')
            .text(d => d.male || '');

        // Center age labels
        g.selectAll('.age-lbl')
            .data(data)
            .join('text')
            .attr('class', 'age-lbl')
            .attr('x', 0).attr('y', d => y(d.age_group)! + y.bandwidth() / 2 + 4)
            .attr('text-anchor', 'middle').attr('font-size', 10).attr('fill', '#6b7280')
            .text(d => d.age_group);

        // X-axis tick labels
        const xRight = d3.axisBottom(x).ticks(4).tickSize(3);
        const xLeft  = d3.axisBottom(d3.scaleLinear().domain([maxVal, 0]).range([0, half])).ticks(4).tickSize(3);
        g.append('g').attr('transform', `translate(0,${h})`).call(xRight)
            .call(gg => gg.select('.domain').remove())
            .selectAll('text').attr('font-size', 8).attr('fill', '#9ca3af');
        g.append('g').attr('transform', `translate(${-half},${h})`).call(xLeft)
            .call(gg => gg.select('.domain').remove())
            .selectAll('text').attr('font-size', 8).attr('fill', '#9ca3af');

        // Legend
        const leg = svg.append('g').attr('transform', `translate(${margin.left},6)`);
        leg.append('rect').attr('width', 10).attr('height', 10).attr('fill', '#ec4899').attr('rx', 2);
        leg.append('text').attr('x', 14).attr('y', 9).attr('font-size', 10).attr('fill', '#6b7280').text('Female');
        leg.append('rect').attr('x', 60).attr('width', 10).attr('height', 10).attr('fill', '#3b82f6').attr('rx', 2);
        leg.append('text').attr('x', 74).attr('y', 9).attr('font-size', 10).attr('fill', '#6b7280').text('Male');
    }, [data]);

    return <svg ref={svgRef} className="w-full" height={260} />;
}
