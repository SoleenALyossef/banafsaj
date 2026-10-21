import { useState } from "react";
import { D } from "./data.js";
import Accordion from "./Accordion.jsx";
import { Seg, Swatches, COLS } from "./Playground.jsx";
import dcss from "./dcss.css?raw";

const NL = String.fromCharCode(10);

function buildCode(A, items) {
  const cls = (A.s ? " " + A.s : "") + (A.i ? " " + A.i : "");
  const one = A.o === "1";
  if (A.k === "h") {
    const rows = items.map((q, k) => `  <details${one ? ' name="faq"' : ""}${k === 0 ? " open" : ""}><summary>${q[0]}</summary><p>${q[1]}</p></details>`).join(NL);
    return `<div class="d-acc${cls}" style="--ac:${A.c};--ar:${A.r}px">${NL}${rows}${NL}</div>`;
  }
  const list = items.map((q) => `  { q: ${JSON.stringify(q[0])}, a: ${JSON.stringify(q[1])} },`).join(NL);
  const toggle = one
    ? "const toggle = (i) => setOpen(open.includes(i) ? [] : [i]);"
    : `const toggle = (i) =>${NL}    setOpen(open.includes(i) ? open.filter((x) => x !== i) : [...open, i]);`;
  return `import { useState } from "react";

const items = [
${list}
];

export default function Accordion() {
  const [open, setOpen] = useState([0]);
  ${toggle}

  return (
    <div className="d-ra${cls}" style={{ "--ac": "${A.c}", "--ar": "${A.r}px" }}>
      {items.map((it, i) => (
        <div key={i} className={"i" + (open.includes(i) ? " on" : "")}>
          <button className="h" aria-expanded={open.includes(i)} onClick={() => toggle(i)}>
            {it.q}
          </button>
          <div className="b"><div><p>{it.a}</p></div></div>
        </div>
      ))}
    </div>
  );
}`;
}

function AccDesigner({ t, lang, onCopy }) {
  const [A, setA] = useState({ k: "r", s: "", i: "", r: 14, c: COLS[0], o: "1" });
  const up = (k) => (v) => setA({ ...A, [k]: v });
  const items = t.accItems;
  const cls = "d-ra" + (A.s ? " " + A.s : "") + (A.i ? " " + A.i : "");
  const code = buildCode(A, items);
  const cssOnly = () => {
    const p = A.k === "h" ? ".d-acc" : ".d-ra";
    onCopy(dcss.split(NL).filter((l) => l.startsWith(p)).join(NL));
  };

  return (
    <div style={{ marginBottom: 30 }}>
      <h3 style={{ fontSize: 24, margin: "0 0 16px" }}>{t.al_t}</h3>
      <div className="play">
        <div className="card ctl">
          <label>{t.al_s}</label>
          <Seg opts={[["", t.sa1], ["min", t.sa2], ["fill", t.sa3], ["side", t.sa4]]} val={A.s} onChange={up("s")} />
          <label>{t.al_i}</label>
          <Seg opts={[["", "+"], ["chev", "▾"]]} val={A.i} onChange={up("i")} />
          <label>{t.al_o}</label>
          <Seg opts={[["1", t.o1], ["0", t.o2]]} val={A.o} onChange={up("o")} />
          <label>{t.al_k}</label>
          <Seg opts={[["r", "React"], ["h", "HTML"]]} val={A.k} onChange={up("k")} />
          <label>{t.al_r}</label>
          <input type="range" min="0" max="28" value={A.r} onChange={(e) => up("r")(+e.target.value)} />
          <label>{t.al_c}</label>
          <Swatches val={A.c} onChange={up("c")} />
        </div>
        <div className="stage">
          <div className="dprev">
            <Accordion items={items} className={cls} single={A.o === "1"} style={{ "--ac": A.c, "--ar": A.r + "px" }} />
          </div>
          <pre>{code}</pre>
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <button className="btn ghost" onClick={cssOnly}>{t.al_css}</button>
            <button className="btn" onClick={() => onCopy(code)}>{t.copy}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StartPage({ t, lang, onCopy, onBack }) {
  const [cat, setCat] = useState("all");

  // interactive bits inside the raw HTML previews (toggles, tabs, pagination)
  const onGrid = (e) => {
    let b = e.target.closest(".d-tg");
    if (b) return b.classList.toggle("on");
    b = e.target.closest(".d-tabs button,.d-pg button");
    if (b) [...b.parentNode.children].forEach((x) => x.classList.toggle("on", x === b));
  };

  return (
    <main>
      <section style={{ paddingTop: 50 }}>
        <div className="wrap">
          <button className="btn ghost" onClick={onBack}>{t.st_back}</button>
          <div className="head" style={{ marginTop: 30 }}>
            <h2>{t.st_t}</h2>
            <p>{t.st_s}</p>
            <button className="btn" style={{ marginTop: 18 }} onClick={() => onCopy(dcss)}>{t.st_css}</button>
          </div>
          {(cat === "all" || cat === "acc") && <AccDesigner t={t} lang={lang} onCopy={onCopy} />}
          <div className="chips">
            {Object.keys(t.cats).map((k) => (
              <button key={k} className={k === cat ? "on" : ""} onClick={() => setCat(k)}>{t.cats[k]}</button>
            ))}
          </div>
          <div className="dgrid" onClick={onGrid}>
            {D.filter((x) => cat === "all" || x[0] === cat).map((x) => (
              <div className="card dcard" key={x[3]}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <b>{lang === "ar" ? x[1] : x[2]}</b>
                  <span className="badge">{t.cats[x[0]]}</span>
                </div>
                <div className="dprev" dangerouslySetInnerHTML={{ __html: x[3] }} />
                <pre>{x[3]}</pre>
                <button className="btn ghost" style={{ alignSelf: "flex-end", padding: "8px 18px", fontSize: 15 }} onClick={() => onCopy(x[3])}>{t.copy}</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
