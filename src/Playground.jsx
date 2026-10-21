import { useState } from "react";

export const COLS = ["#8b6fd6", "#a78bdb", "#7c8fe0", "#c084c8", "#6f5bb8"];

export function Seg({ opts, val, onChange }) {
  return (
    <div className="seg">
      {opts.map(([v, label]) => (
        <button key={v} className={val === v ? "on" : ""} onClick={() => onChange(v)}>{label}</button>
      ))}
    </div>
  );
}

export function Swatches({ val, onChange }) {
  return (
    <div className="sw">
      {COLS.map((c) => (
        <button key={c} aria-label={c} style={{ background: c }} className={val === c ? "on" : ""} onClick={() => onChange(c)} />
      ))}
    </div>
  );
}

export default function Playground({ t, onCopy }) {
  const [s, setS] = useState({ label: "", v: "solid", z: "md", r: 14, c: COLS[0] });
  const up = (k) => (v) => setS({ ...s, [k]: v });
  const pad = { sm: "8px 16px", md: "11px 24px", lg: "15px 34px" }[s.z];
  const fs = { sm: 14, md: 16, lg: 19 }[s.z];
  const variant =
    s.v === "solid" ? { background: s.c, color: "#fff" }
    : s.v === "soft" ? { background: s.c + "26", color: s.c, borderColor: "transparent" }
    : { background: "transparent", color: s.c };
  const label = s.label || t.m3;
  const code = `<Button\n  variant="${s.v}"\n  size="${s.z}"\n  radius={${s.r}}\n  color="${s.c}"\n>\n  ${label}\n</Button>`;

  return (
    <div className="play">
      <div className="card ctl">
        <label>{t.p_l}</label>
        <input type="text" placeholder={t.m3} value={s.label} onChange={(e) => up("label")(e.target.value)} />
        <label>{t.p_v}</label>
        <Seg opts={[["solid", "Solid"], ["soft", "Soft"], ["outline", "Outline"]]} val={s.v} onChange={up("v")} />
        <label>{t.p_z}</label>
        <Seg opts={[["sm", "S"], ["md", "M"], ["lg", "L"]]} val={s.z} onChange={up("z")} />
        <label>{t.p_r}</label>
        <input type="range" min="0" max="28" value={s.r} onChange={(e) => up("r")(+e.target.value)} />
        <label>{t.p_c}</label>
        <Swatches val={s.c} onChange={up("c")} />
      </div>
      <div className="stage">
        <div className="view">
          <button className="pv" style={{ "--pc": s.c, padding: pad, fontSize: fs, borderRadius: s.r, ...variant }}>{label}</button>
        </div>
        <pre>{code}</pre>
        <button className="btn ghost cp" onClick={() => onCopy(code)}>{t.copy}</button>
      </div>
    </div>
  );
}
