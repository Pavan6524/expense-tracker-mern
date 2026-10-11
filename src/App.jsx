import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, CalendarDays, Check, ChevronDown, CircleHelp, CreditCard, Ellipsis, Filter, Plus, Search, Sparkles, Wallet, X, Pencil, Trash2, Coffee, CarFront, ShoppingBag, ReceiptText, Clapperboard, HeartPulse, Plane, Shapes, TrendingDown, Menu } from 'lucide-react';

const API = '/api/expenses';
const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Health', 'Travel', 'Other'];
const icons = [Coffee, CarFront, ShoppingBag, ReceiptText, Clapperboard, HeartPulse, Plane, Shapes];
const colors = ['#b9914a', '#527b73', '#b77865', '#7779a2', '#9874a5', '#6f9a75', '#4b91a2', '#8c908b'];
const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
const dateLabel = (value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total: 0, count: 0, categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ description: '', amount: '', category: categories[0], date: new Date().toISOString().slice(0, 10) });

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (category !== 'All categories') params.set('category', category);
      const [listRes, summaryRes] = await Promise.all([fetch(`${API}?${params}`), fetch(`${API}/summary`)]);
      const [list, totals] = await Promise.all([listRes.json(), summaryRes.json()]);
      if (!listRes.ok || !list.success) throw new Error(list.error?.message || 'Could not load expenses.');
      if (!summaryRes.ok || !totals.success) throw new Error(totals.error?.message || 'Could not load spending summary.');
      setExpenses(list.data); setSummary(totals.data);
    } catch (err) { setError(err.message || 'Could not connect to the server.'); }
    finally { setLoading(false); }
  }, [search, category]);

  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [load]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3200); return () => clearTimeout(timer); }, [notice]);

  const biggest = useMemo(() => summary.categories[0]?.total || 0, [summary]);
  const openNew = () => { setEditing(null); setForm({ description: '', amount: '', category: categories[0], date: new Date().toISOString().slice(0, 10) }); setFormOpen(true); };
  const openEdit = (expense) => { setEditing(expense._id); setForm({ description: expense.description, amount: String(expense.amount), category: expense.category, date: new Date(expense.date).toISOString().slice(0, 10) }); setFormOpen(true); };
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try {
      const response = await fetch(editing ? `${API}/${editing}` : API, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, amount: Number(form.amount) }) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error?.message || 'Could not save expense.');
      setFormOpen(false); setNotice(editing ? 'Expense updated successfully.' : 'Expense added successfully.'); await load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this expense? This action cannot be undone.')) return;
    try {
      const response = await fetch(`${API}/${id}`, { method: 'DELETE' }); const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error?.message || 'Could not delete expense.');
      setNotice('Expense removed.'); await load();
    } catch (err) { setError(err.message); }
  };

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#top"><span className="brand-mark"><Wallet size={21} strokeWidth={2.1} /></span><span>spendwise<span className="brand-dot">.</span></span></a>
      <div className="workspace"><div className="workspace-avatar">S</div><div><small>PERSONAL WORKSPACE</small><strong>My finances</strong></div><ChevronDown size={15} /></div>
      <div className="nav-label">WORKSPACE</div>
      <a className="nav-link active" href="#dashboard"><span className="nav-icon"><Sparkles size={17} /></span>Overview</a>
      <a className="nav-link" href="#transactions"><span className="nav-icon"><CreditCard size={17} /></span>Transactions<span className="nav-count">{summary.count}</span></a>
      <div className="sidebar-bottom"><div className="budget-card"><div className="budget-icon"><TrendingDown size={16} /></div><div className="budget-title">Mindful spending</div><p>Small steps add up. Keep an eye on where your money goes.</p><a href="#categories">View insights <ArrowUpRight size={13} /></a></div><div className="profile"><div className="profile-avatar">JD</div><div><strong>Jamie Davis</strong><small>Personal account</small></div><Ellipsis size={19} /></div></div>
    </aside>

    <main id="top" className="main-content">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div><div className="top-actions"><span className="date-chip"><CalendarDays size={15} /> {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span><button className="avatar-small" aria-label="Profile">JD</button></div></header>
      <div className="page-wrap" id="dashboard">
        <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line" /> YOUR MONEY, IN FOCUS</div><h1>A little more <em>clarity.</em></h1><p className="welcome-sub">Your spending, all in one place. Make every dollar feel intentional.</p></div><button className="primary-button" onClick={openNew}><Plus size={17} /> Add expense</button></section>
        {notice && <div className="notice"><Check size={16} /> {notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15} /></button></div>}
        {error && <div className="error-banner"><CircleHelp size={17} /><span>{error}</span><button onClick={load}>Try again</button></div>}

        <section className="stats-grid">
          <article className="stat-card main-stat"><div className="stat-top"><span className="stat-label">TOTAL SPENDING</span><span className="stat-icon green"><Wallet size={18} /></span></div><div className="stat-value">{loading ? '—' : money(summary.total)}</div><div className="stat-foot"><span className="status-dot" /> Across {summary.count} {summary.count === 1 ? 'transaction' : 'transactions'} <span className="muted-dot">·</span> all time</div><div className="stat-decoration"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div></article>
          <article className="stat-card"><div className="stat-top"><span className="stat-label">TRANSACTIONS</span><span className="stat-icon cream"><ReceiptText size={17} /></span></div><div className="stat-value">{loading ? '—' : String(summary.count).padStart(2, '0')}</div><div className="stat-foot"><span className="muted-dot">A complete picture of your spending</span></div><div className="transaction-bubbles"><span><ArrowDownLeft size={13} /></span><span><ArrowUpRight size={13} /></span><span><ArrowDownLeft size={13} /></span></div></article>
          <article className="stat-card"><div className="stat-top"><span className="stat-label">TOP CATEGORY</span><span className="stat-icon peach"><Sparkles size={17} /></span></div><div className="stat-value category-stat">{loading ? '—' : summary.categories[0]?._id || '—'}</div><div className="stat-foot">{!loading && summary.categories[0] ? `${money(summary.categories[0].total)} spent here` : 'Your biggest spending area'}</div><div className="top-category-accent"><span /><span /><span /><span /><span /></div></article>
        </section>

        <section className="content-grid">
          <article className="panel transactions-panel" id="transactions"><div className="panel-heading"><div><div className="section-kicker">THE DETAILS</div><h2>Recent transactions</h2></div><span className="item-count">{summary.count} total</span></div><div className="toolbar"><label className="search-box"><Search size={16} /><input aria-label="Search descriptions" placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} />{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={14} /></button>}</label><label className="select-wrap"><Filter size={14} /><select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}><option>All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></label></div>
            {loading ? <div className="state-box"><span className="spinner" /><p>Gathering your expenses...</p></div> : expenses.length === 0 ? <div className="state-box empty-state"><div className="empty-icon"><Search size={20} /></div><strong>{search || category !== 'All categories' ? 'No matching expenses' : 'A fresh start'}</strong><p>{search || category !== 'All categories' ? 'Try changing your search or category filter.' : 'Add your first expense to see your spending take shape.'}</p>{!search && category === 'All categories' && <button className="text-button" onClick={openNew}>Add an expense <ArrowUpRight size={14} /></button>}</div> : <div className="table-wrap"><table><thead><tr><th>DESCRIPTION</th><th>CATEGORY</th><th>DATE</th><th className="amount-heading">AMOUNT</th><th aria-label="Actions" /></tr></thead><tbody>{expenses.map((item) => { const index = categories.indexOf(item.category); const Icon = icons[index] || Shapes; return <tr key={item._id}><td><div className="expense-name"><span className="expense-icon" style={{ '--item-color': colors[index] }}><Icon size={16} /></span><span><strong>{item.description}</strong><small>{dateLabel(item.date)}</small></span></div></td><td><span className="category-pill" style={{ '--item-color': colors[index] }}><span />{item.category}</span></td><td className="date-cell">{dateLabel(item.date)}</td><td className="amount-cell">{money(item.amount)}</td><td><div className="row-actions"><button aria-label={`Edit ${item.description}`} onClick={() => openEdit(item)}><Pencil size={14} /></button><button aria-label={`Delete ${item.description}`} onClick={() => remove(item._id)}><Trash2 size={14} /></button></div></td></tr>; })}</tbody></table></div>}
          </article>
          <article className="panel categories-panel" id="categories"><div className="panel-heading"><div><div className="section-kicker">WHERE IT GOES</div><h2>By category</h2></div><button className="more-button" aria-label="More category options"><Ellipsis size={20} /></button></div><p className="panel-caption">A breakdown of your spending habits.</p>
            {loading ? <div className="category-loading"><span className="spinner" /></div> : summary.categories.length === 0 ? <div className="category-empty"><div className="donut empty-donut"><span><Shapes size={18} /></span></div><p>Your category breakdown will show up here.</p></div> : <><div className="donut" style={{ '--chart': (() => { let end = 0; return summary.categories.map((item) => { const start = end; end += item.total / summary.total * 100; return `${colors[categories.indexOf(item._id)] || colors[7]} ${start}% ${end}%`; }).join(', '); })() }}><div className="donut-center"><strong>{money(summary.total)}</strong><span>TOTAL SPENT</span></div></div><div className="category-list">{summary.categories.slice(0, 5).map((item) => { const index = categories.indexOf(item._id); const Icon = icons[index] || Shapes; return <div className="category-row" key={item._id}><span className="category-symbol" style={{ '--item-color': colors[index] || colors[7] }}><Icon size={14} /></span><span className="category-name">{item._id}<small>{item.count} {item.count === 1 ? 'expense' : 'expenses'}</small></span><span className="category-total">{money(item.total)}<small>{summary.total ? Math.round(item.total / summary.total * 100) : 0}%</small></span><span className="category-bar"><i style={{ width: `${biggest ? item.total / biggest * 100 : 0}%`, background: colors[index] || colors[7] }} /></span></div>; })}</div></>}
            <div className="insight-note"><span className="insight-spark"><Sparkles size={14} /></span><p><strong>A mindful moment</strong> Your awareness is the first step toward spending with purpose.</p></div>
          </article>
        </section>
        <footer className="footer-note"><span>Made for a more mindful relationship with money.</span><span><span className="footer-dot" /> Your data, your decisions.</span></footer>
      </div>
    </main>

    {formOpen && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setFormOpen(false); }}><section className="expense-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-head"><div><div className="section-kicker">{editing ? 'UPDATE DETAILS' : 'A NEW ENTRY'}</div><h2 id="modal-title">{editing ? 'Edit expense' : 'Add an expense'}</h2></div><button className="close-button" onClick={() => setFormOpen(false)} aria-label="Close"><X size={19} /></button></div><form onSubmit={submit}><label>Description<input autoFocus maxLength="120" required placeholder="e.g. Lunch with friends" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><label>Amount<div className="amount-input"><span>$</span><input required type="number" min="0.01" step="0.01" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div></label><div className="form-row"><label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Date<input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label></div>{error && <div className="form-error">{error}</div>}<div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setFormOpen(false)}>Cancel</button><button type="submit" className="primary-button" disabled={saving}>{saving ? 'Saving...' : <>{editing ? 'Save changes' : 'Add expense'} <ArrowUpRight size={15} /></>}</button></div></form></section></div>}
  </div>;
}
