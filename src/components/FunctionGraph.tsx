import React, { useEffect, useRef, useState } from 'react';
import { FunctionData, Point } from '../types';

interface Props {
  data: FunctionData;
  highlightX?: number;
  highlightY?: number;
  showInterval?: [number, number];
  intervalType?: 'pos' | 'neg' | 'dom' | 'im' | 'roots' | 'extrema' | 'value_at' | 'growth' | 'decay' | 'constant';
}

export const FunctionGraph: React.FC<Props> = ({ data, highlightX, highlightY, showInterval, intervalType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; label?: string } | null>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Calculate required domain and range based on data and some padding
    const allX = data.points ? data.points.map(p => p.x) : [data.domain[0], data.domain[1]];
    const allY = data.points ? data.points.map(p => p.y) : [data.range[0], data.range[1]];
    
    const minX = Math.min(-5, ...allX) - 1;
    const maxX = Math.max(5, ...allX) + 1;
    const minY = Math.min(-5, ...allY) - 1;
    const maxY = Math.max(5, ...allY) + 1;

    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    
    const scaleX = width / rangeX;
    const scaleY = height / rangeY;
    const scale = Math.min(scaleX, scaleY) * 0.9; // Use min scale for uniformity, 90% zoom

    const centerX = width / 2 - ((maxX + minX) / 2) * scale;
    const centerY = height / 2 + ((maxY + minY) / 2) * scale;

    const toX = (x: number) => centerX + x * scale;
    const toY = (y: number) => centerY - y * scale;

    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = Math.floor(minX); x <= Math.ceil(maxX); x++) {
      const px = toX(x);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();
    }
    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      const py = toY(y);
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
    }

    // Draw Axes
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    // X axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    // Y axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 10px Inter';
    for (let x = Math.floor(minX); x <= Math.ceil(maxX); x++) {
      if (x === 0) continue;
      ctx.fillText(x.toString(), toX(x) - 4, centerY + 14);
    }
    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      if (y === 0) continue;
      ctx.fillText(y.toString(), centerX + 8, toY(y) + 4);
    }

    // Highlight Intervals if requested
    const drawInterval = (start: number, end: number, type: string) => {
      ctx.save();
      ctx.globalAlpha = 0.15;
      if (type === 'pos') ctx.fillStyle = '#ef4444'; 
      else if (type === 'neg') ctx.fillStyle = '#22c55e'; 
      else if (type === 'growth') ctx.fillStyle = '#8b5cf6'; 
      else if (type === 'decay') ctx.fillStyle = '#f97316'; 
      else if (type === 'constant') ctx.fillStyle = '#06b6d4'; 
      else if (type === 'dom') ctx.fillStyle = '#3b82f6'; 
      else ctx.fillStyle = '#6366f1';
      
      if (type === 'im') {
        const pyStart = toY(start);
        const pyEnd = toY(end);
        ctx.fillRect(0, Math.min(pyStart, pyEnd), width, Math.abs(pyEnd - pyStart));
      } else {
        const pxStart = toX(start);
        const pxEnd = toX(end);
        ctx.fillRect(pxStart, 0, pxEnd - pxStart, height);
      }
      ctx.restore();
    };

    if (showInterval) {
      // If we are looking for a type that might have multiple intervals
      const intervalsToHighlight: [number, number][] = [];
      if (intervalType === 'pos') intervalsToHighlight.push(...data.positivity);
      else if (intervalType === 'neg') intervalsToHighlight.push(...data.negativity);
      else if (intervalType === 'growth') intervalsToHighlight.push(...data.growth);
      else if (intervalType === 'decay') intervalsToHighlight.push(...data.decay);
      else if (intervalType === 'constant') intervalsToHighlight.push(...data.constantIntervals);
      else intervalsToHighlight.push(showInterval as [number, number]);

      intervalsToHighlight.forEach(([start, end]) => drawInterval(start, end, intervalType || ''));
    }

    // Roots highlighting
    if (intervalType === 'roots' || hoverCoord?.label) {
        data.roots.forEach((root, idx) => {
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(toX(root), toY(0), 6, 0, Math.PI * 2);
            ctx.fill();
            
            if (intervalType === 'roots') {
                ctx.fillStyle = '#f59e0b';
                ctx.font = 'bold 12px Inter';
                const label = data.rootLabels?.[idx] || root.toString();
                ctx.fillText(label, toX(root) - 10, toY(0) - 12);
            }
        });
    }

    // Extrema highlighting
    if (intervalType === 'extrema') {
        data.extrema.forEach(ext => {
            ctx.fillStyle = ext.type === 'max' ? '#ef4444' : '#3b82f6';
            ctx.beginPath();
            ctx.arc(toX(ext.x), toY(ext.y), 6, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Draw Function
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    if (data.points) {
      // Piecewise linear
      ctx.beginPath();
      data.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(toX(p.x), toY(p.y));
        else ctx.lineTo(toX(p.x), toY(p.y));
      });
      ctx.stroke();

      // Endpoints (circles) - Only first and last to show domain limits
      if (data.points && data.points.length > 0) {
        const start = data.points[0];
        const end = data.points[data.points.length - 1];
        [start, end].forEach((p) => {
          ctx.fillStyle = '#4f46e5';
          ctx.beginPath();
          ctx.arc(toX(p.x), toY(p.y), 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      }
    } else if (data.formula) {
        ctx.beginPath();
        let first = true;
        const resolution = 0.05;
        for (let x = data.domain[0]; x <= data.domain[1]; x += resolution) {
            const y = data.formula(x);
            if (first) {
                ctx.moveTo(toX(x), toY(y));
                first = false;
            } else {
                ctx.lineTo(toX(x), toY(y));
            }
        }
        ctx.stroke();
    }

    // Hover tooltip
    if (hoverCoord) {
        const hx = toX(hoverCoord.x);
        const hy = toY(hoverCoord.y);

        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hx, 0); ctx.lineTo(hx, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, hy); ctx.lineTo(width, hy);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(hx, hy, 4, 0, Math.PI * 2);
        ctx.fill();

        // Label box
        const labelText = hoverCoord.label || `(${hoverCoord.x.toFixed(1)}, ${hoverCoord.y.toFixed(1)})`;
        ctx.font = 'bold 12px Inter';
        const textWidth = ctx.measureText(labelText).width;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(hx + 10, hy - 25, textWidth + 10, 20);
        ctx.fillStyle = '#1e293b';
        ctx.fillText(labelText, hx + 15, hy - 11);
    }
    if (highlightX !== undefined && !isNaN(highlightX)) {
      const x = toX(highlightX);
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw point on function if possible
      if (data.points) {
          // Find y for given x in piecewise
          for (let i = 0; i < data.points.length - 1; i++) {
              const p1 = data.points[i];
              const p2 = data.points[i+1];
              if (highlightX >= p1.x && highlightX <= p2.x) {
                  const t = (highlightX - p1.x) / (p2.x - p1.x);
                  const y = p1.y + t * (p2.y - p1.y);
                  ctx.fillStyle = '#f43f5e';
                  ctx.beginPath();
                  ctx.arc(toX(highlightX), toY(y), 5, 0, Math.PI * 2);
                  ctx.fill();
                  break;
              }
          }
      }
    }
  };

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data, highlightX, highlightY, showInterval, intervalType, hoverCoord]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Convert pixel to axis units
    const allX = data.points ? data.points.map(p => p.x) : [data.domain[0], data.domain[1]];
    const allY = data.points ? data.points.map(p => p.y) : [data.range[0], data.range[1]];
    const minX = Math.min(-5, ...allX) - 1;
    const maxX = Math.max(5, ...allX) + 1;
    const minY = Math.min(-5, ...allY) - 1;
    const maxY = Math.max(5, ...allY) + 1;
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    
    const scaleX = canvas.width / rangeX;
    const scaleY = canvas.height / rangeY;
    const scale = Math.min(scaleX, scaleY) * 0.9;
    const centerX = canvas.width / 2 - ((maxX + minX) / 2) * scale;
    const centerY = canvas.height / 2 + ((maxY + minY) / 2) * scale;

    const ux = (mx - centerX) / scale;

    // SNAP to function
    let snapY: number | null = null;
    let snapLabel: string | undefined;

    // Check roots snapping first
    for (let i = 0; i < data.roots.length; i++) {
        const root = data.roots[i];
        if (Math.abs(ux - root) < 0.2) {
            setHoverCoord({ x: root, y: 0, label: data.rootLabels?.[i] || `x = ${root}` });
            return;
        }
    }

    if (data.points) {
        for (let i = 0; i < data.points.length - 1; i++) {
            const p1 = data.points[i];
            const p2 = data.points[i+1];
            if (ux >= p1.x && ux <= p2.x) {
                const t = (ux - p1.x) / (p2.x - p1.x);
                snapY = p1.y + t * (p2.y - p1.y);
                break;
            }
        }
    } else if (data.formula) {
        if (ux >= data.domain[0] && ux <= data.domain[1]) {
            snapY = data.formula(ux);
        }
    }

    if (snapY !== null) {
        setHoverCoord({ x: ux, y: snapY, label: snapLabel });
    } else {
        setHoverCoord(null);
    }
  };

  return (
    <div className="relative w-full aspect-square bg-white rounded-xl shadow-inner border border-gray-100 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverCoord(null)}
        className="w-full h-full cursor-crosshair"
      />
    </div>
  );
};
