import { useEffect, useRef, useState } from 'react';

const ROW_HEIGHT = 36;
type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  pad?: boolean;
  onChange: (value: number) => void;
};

export default function NumberWheel({
  label,
  value,
  min,
  max,
  pad,
  onChange,
}: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const lastValue = useRef(value);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [visibleValue, setVisibleValue] = useState(value);
  const count = max - min + 1;

  useEffect(() => {
    const element = scroller.current;
    if (element && (lastValue.current !== value || element.scrollTop === 0)) {
      element.scrollTop = (value - min) * ROW_HEIGHT;
      lastValue.current = value;
      setVisibleValue(value);
    }
  }, [value, min]);
  useEffect(() => () => clearTimeout(timeout.current), []);

  const choose = (next: number) => {
    const clamped = Math.max(min, Math.min(max, next));
    lastValue.current = clamped;
    setVisibleValue(clamped);
    onChange(clamped);
    scroller.current?.scrollTo({
      top: (clamped - min) * ROW_HEIGHT,
      behavior: 'instant',
    });
  };
  const first = Math.max(min, visibleValue - 3);
  const last = Math.min(max, visibleValue + 3);

  return (
    <div className="number-wheel">
      <div className="wheel-selection" aria-hidden="true" />
      <div
        ref={scroller}
        className="wheel-scroll"
        role="spinbutton"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onKeyDown={(event) => {
          const next = (
            {
              ArrowUp: value + 1,
              ArrowDown: value - 1,
              PageUp: value + 10,
              PageDown: value - 10,
              Home: min,
              End: max,
            } as Record<string, number>
          )[event.key];
          if (next !== undefined) {
            event.preventDefault();
            choose(next);
          }
        }}
        onScroll={(event) => {
          const element = event.currentTarget;
          const next = Math.max(
            min,
            Math.min(max, min + Math.round(element.scrollTop / ROW_HEIGHT)),
          );
          if (next !== lastValue.current) {
            lastValue.current = next;
            setVisibleValue(next);
            onChange(next);
          }
          clearTimeout(timeout.current);
          timeout.current = setTimeout(() => {
            const top = (lastValue.current - min) * ROW_HEIGHT;
            if (Math.abs(element.scrollTop - top) > 0.5)
              element.scrollTo({ top, behavior: 'instant' });
          }, 140);
        }}
      >
        <div
          className="wheel-track"
          style={{ height: (count + 2) * ROW_HEIGHT }}
          aria-hidden="true"
        >
          {Array.from({ length: last - first + 1 }, (_, index) => {
            const number = first + index;
            return (
              <div
                key={number}
                className={`wheel-option ${number === value ? 'wheel-option-selected' : ''}`}
                style={{ top: (number - min + 1) * ROW_HEIGHT }}
                onClick={() => choose(number)}
              >
                {pad ? String(number).padStart(2, '0') : number}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
