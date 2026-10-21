import { useEffect, useState } from "react";
import { T } from "./data.js";
import Accordion from "./Accordion.jsx";
import Playground from "./Playground.jsx";
import StartPage from "./StartPage.jsx";

const store = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };
const load = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const Tg = ({ on, onClick }) => <button className={"tg" + (on ? " on" : "")} onClick={onClick} aria-label="toggle" />;
const Head = ({ title, sub }) => (
  <div className="head"><h2>{title}</h2>{sub && <p>{sub}</p>}</div>
);

export default function App() {
  const [lang, setLang] = useState(() => load("bz-lang") || "ar");
  const [theme, setTheme] = useState(() => load("bz-theme"));
  const [view, setView] = useState("home");
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState(0);
  const [prog, setProg] = useState(72);
  const [tg, setTg] = useState([true, false, true]);
  const t = T[lang];

  useEffect(() => {
    const r = document.documentElement;
    r.lang = lang; r.dir = lang === "ar" ? "rtl" : "ltr";
    store("bz-lang", lang);
  }, [lang]);
  useEffect(() => {
    const r = document.documentElement;
    if (theme) { r.dataset.theme = theme; store("bz-theme", theme); } else delete r.dataset.theme;
  }, [theme]);

  const say = (m) => { setToast(m); setTimeout(() => setToast(""), 1800); };
  const copy = (x) => { navigator.clipboard?.writeText(x).catch(() => {}); say(t.copied); };
  const flip = (i) => setTg(tg.map((v, j) => (j === i ? !v : v)));
  const toggleTheme = () => {
    const dark = theme ? theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(dark ? "light" : "dark");
  };
  const go = (id) => {
    setMenu(false);
    setView(id === "start" ? "start" : "home");
    setTimeout(() => {
      const el = id !== "start" && id !== "top" && document.getElementById(id);
      el ? el.scrollIntoView({ behavior: "smooth" }) : scrollTo(0, 0);
    }, 30);
  };
  const A = ({ id, children, style }) => (
    <a href={"#" + id} style={style} onClick={(e) => { e.preventDefault(); go(id); }}>{children}</a>
  );

  return (
    <>
      <header>
        <div className="wrap bar">
          <A id="top"><span className="logo"><i></i><span>Banafsaj UI</span></span></A>
          <nav className={menu ? "open" : ""}>
            <A id="features">{t.nav1}</A><A id="playground">{t.nav2}</A><A id="gallery">{t.nav3}</A>
            <A id="pricing">{t.nav5}</A><A id="faq">{t.nav4}</A>
            <A id="start" style={{ color: "var(--accent)", fontWeight: 700 }}>{t.nav6}</A>
          </nav>
          <div className="tools">
            <button className="ic" onClick={toggleTheme} aria-label="theme">◐</button>
            <button className="ic" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>{lang === "ar" ? "EN" : "ع"}</button>
            <button className="ic burger" onClick={() => setMenu(!menu)} aria-label="menu">☰</button>
          </div>
        </div>
      </header>

      {view === "start" ? (
        <StartPage t={t} lang={lang} onCopy={copy} onBack={() => go("top")} />
      ) : (
        <main>
          <div className="wrap hero">
            <div>
              <span className="pill">{t.pill}</span>
              <h1 dangerouslySetInnerHTML={{ __html: t.h1 }} />
              <p className="lead">{t.lead}</p>
              <div className="cta">
                <button className="btn" onClick={() => go("start")}>{t.nav6}</button>
                <button className="btn ghost" onClick={() => go("playground")}>{t.cta1}</button>
                <button className="btn ghost" onClick={() => copy("npm i banafsaj-ui")}>{t.cta2}</button>
              </div>
            </div>
            <div className="card mock">
              <div className="row"><b>{t.m1}</b><span className="badge">{t.m2}</span></div>
              <div className="bar-p"><b></b></div>
              <div className="row"><button className="btn">{t.m3}</button><button className="btn ghost">{t.m4}</button></div>
              <div className="row"><Tg on={tg[2]} onClick={() => flip(2)} /><span style={{ color: "var(--muted)" }}>{t.m5}</span></div>
            </div>
          </div>

          <section id="features"><div className="wrap">
            <Head title={t.f_t} sub={t.f_s} />
            <div className="grid">
              {t.feats.map((f) => (
                <div className="card feat" key={f[1]}><div className="n">{f[0]}</div><h3>{f[1]}</h3><p>{f[2]}</p></div>
              ))}
            </div>
          </div></section>

          <section><div className="wrap card"><div className="stats">
            {[["40+", t.s1], ["2", t.s2], ["6 KB", t.s3], ["AA", t.s4]].map(([n, l]) => (
              <div key={l}><b>{n}</b><span>{l}</span></div>
            ))}
          </div></div></section>

          <section id="playground"><div className="wrap">
            <Head title={t.p_t} sub={t.p_s} />
            <Playground t={t} onCopy={copy} />
          </div></section>

          <section id="gallery"><div className="wrap">
            <Head title={t.g_t} sub={t.g_s} />
            <div className="gal">
              <div className="card"><h4>{t.g1}</h4><div className="row"><Tg on={tg[0]} onClick={() => flip(0)} /><Tg on={tg[1]} onClick={() => flip(1)} /></div></div>
              <div className="card"><h4>{t.g2}</h4><div className="row"><span className="badge">New</span><span className="badge">{t.g2b}</span><span className="badge">v2.0</span></div></div>
              <div className="card"><h4>{t.g3}</h4><input type="text" placeholder={t.g3p} /></div>
              <div className="card"><h4>{t.g4}</h4>
                <div className="tabs">{[t.t1, t.t2, t.t3].map((x, i) => <button key={i} className={tab === i ? "on" : ""} onClick={() => setTab(i)}>{x}</button>)}</div>
                <div style={{ color: "var(--muted)", fontSize: 15 }}>{t.tab[tab]}</div>
              </div>
              <div className="card"><h4>{t.g5}</h4><div className="bar-p"><b style={{ width: prog + "%" }}></b></div>
                <input type="range" min="5" max="100" value={prog} onChange={(e) => setProg(+e.target.value)} style={{ marginTop: 12 }} />
              </div>
              <div className="card"><h4>{t.g6}</h4><div className="row"><button className="btn" onClick={() => say(t.done)}>{t.g6b}</button></div></div>
            </div>
          </div></section>

          <section id="pricing"><div className="wrap">
            <Head title={t.pr_t} sub={t.pr_s} />
            <div className="grid">
              {t.plans.map((p, i) => (
                <div className={"card price" + (i === 1 ? " hot" : "")} key={p[0]}>
                  <h3>{p[0]}</h3><div className="amt">{p[1]}<small>{t.mo}</small></div><p>{p[2]}</p>
                  <ul>{p[3].map((f) => <li key={f}>{f}</li>)}</ul>
                  <button className={"btn" + (i === 1 ? "" : " ghost")} style={{ width: "100%", justifyContent: "center" }}>{t.pick}</button>
                </div>
              ))}
            </div>
          </div></section>

          <section><div className="wrap">
            <Head title={t.te_t} />
            <div className="grid">
              {t.quotes.map((q) => (
                <div className="card" key={q[1]}>
                  <p style={{ marginTop: 0 }}>“{q[0]}”</p><b>{q[1]}</b>
                  <div style={{ color: "var(--muted)", fontSize: 14 }}>{q[2]}</div>
                </div>
              ))}
            </div>
          </div></section>

          <section id="faq"><div className="wrap" style={{ maxWidth: 760 }}>
            <Head title={t.q_t} />
            <Accordion items={t.faq} className="d-ra fill" />
            <div className="head" style={{ marginTop: 50 }}><h2>{t.n_t}</h2><p>{t.n_s}</p></div>
            <div className="news"><input type="email" placeholder={t.n_p} /><button className="btn" onClick={() => say(t.thanks)}>{t.n_b}</button></div>
          </div></section>

          <section><div className="wrap"><div className="card band">
            <h2>{t.c_t}</h2><p>{t.c_s}</p>
            <button className="btn" onClick={() => go("start")}>{t.c_b}</button>
          </div></div></section>
        </main>
      )}

      <footer><div className="wrap">{t.foot}</div></footer>
      <div className={"toast" + (toast ? " show" : "")}>{toast}</div>
    </>
  );
}
