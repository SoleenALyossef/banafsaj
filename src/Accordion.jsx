import { useState } from "react";

// items: [[question, answer], ...]
export default function Accordion({ items, className = "d-ra", style, single = true }) {
  const [open, setOpen] = useState([0]);
  const toggle = (i) =>
    setOpen(single ? (open.includes(i) ? [] : [i]) : open.includes(i) ? open.filter((x) => x !== i) : [...open, i]);

  return (
    <div className={className} style={style}>
      {items.map((q, i) => {
        const on = open.includes(i);
        return (
          <div key={i} className={"i" + (on ? " on" : "")}>
            <button className="h" aria-expanded={on} onClick={() => toggle(i)}>{q[0]}</button>
            <div className="b"><div><p>{q[1]}</p></div></div>
          </div>
        );
      })}
    </div>
  );
}
