"use client";
import React, { useEffect, useMemo, useState } from 'react'

type Tab = 'mcq' | 'short' | 'long';

type Mcq = {
  id?: number;
  class_name: string;
  subject: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: number;
}

type Qa = {
  id?: number;
  class_name: string;
  subject: string;
  question: string;
  answer: string;
}

const API = 'http://127.0.0.1:8000';

export default function page() {
  const [tab, setTab] = useState<Tab>('mcq');
  const [classNameValue, setClassNameValue] = useState('nine');
  const [subject, setSubject] = useState('bangla');

  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const endpoint = useMemo(() => {
    if (tab === 'mcq') return `${API}/mcq/question/`;
    if (tab === 'short') return `${API}/short/question/`;
    return `${API}/long/question/`;
  }, [tab]);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${endpoint}?class_name=${encodeURIComponent(classNameValue)}&subject=${encodeURIComponent(subject)}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch');
      setList(await res.json());
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, [tab, classNameValue, subject]);

  const createItem = async (data: any) => {
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Create failed');
    await fetchList();
  };
  const updateItem = async (id: number, data: any) => {
    const res = await fetch(`${endpoint}${id}/`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Update failed');
    await fetchList();
  };
  const deleteItem = async (id: number) => {
    const res = await fetch(`${endpoint}${id}/`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    await fetchList();
  };

  // Simple forms
  const [mcqForm, setMcqForm] = useState<Mcq>({ class_name: 'nine', subject: 'bangla', question: '', option1: '', option2: '', option3: '', option4: '', correct_option: 1 });
  const [qaForm, setQaForm] = useState<Qa>({ class_name: 'nine', subject: 'bangla', question: '', answer: '' });

  const bg: React.CSSProperties = { backgroundColor: 'rgb(18,18,22)', color: 'white' };

  return (
    <div style={bg} className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <button className="button" onClick={() => setTab('mcq')}>MCQ</button>
        <button className="button" onClick={() => setTab('short')}>Short</button>
        <button className="button" onClick={() => setTab('long')}>Long</button>
      </div>

      <div className="grid sm:grid-cols-3 gap-2 mb-4 max-w-xl">
        <input className="text-black p-2 rounded" placeholder="class (nine/ten)" value={classNameValue} onChange={e=>setClassNameValue(e.target.value)} />
        <input className="text-black p-2 rounded" placeholder="subject (bangla, math, ...)" value={subject} onChange={e=>setSubject(e.target.value)} />
        <button onClick={fetchList}>Filter</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {/* List */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Items</h2>
          <div className="space-y-2">
            {list.map((item: any) => (
              <div key={item.id} className="p-3 rounded border border-white/20">
                <div className="font-semibold">{item.question}</div>
                <div className="text-sm opacity-70">{item.class_name} • {item.subject}</div>
                {tab === 'mcq' && (
                  <ul className="list-disc ml-5">
                    <li>{item.option1}</li>
                    <li>{item.option2}</li>
                    <li>{item.option3}</li>
                    <li>{item.option4}</li>
                  </ul>
                )}
                {tab !== 'mcq' && <div className="opacity-80">Ans: {item.answer}</div>}
                <div className="flex gap-2 mt-2">
                  <button onClick={() => deleteItem(item.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Create New</h2>
          {tab === 'mcq' ? (
            <div className="grid grid-cols-1 gap-2">
              <input className="text-black p-2 rounded" placeholder="class_name" value={mcqForm.class_name} onChange={e=>setMcqForm({...mcqForm, class_name: e.target.value})} />
              <input className="text-black p-2 rounded" placeholder="subject" value={mcqForm.subject} onChange={e=>setMcqForm({...mcqForm, subject: e.target.value})} />
              <input className="text-black p-2 rounded" placeholder="question" value={mcqForm.question} onChange={e=>setMcqForm({...mcqForm, question: e.target.value})} />
              <input className="text-black p-2 rounded" placeholder="option1" value={mcqForm.option1} onChange={e=>setMcqForm({...mcqForm, option1: e.target.value})} />
              <input className="text-black p-2 rounded" placeholder="option2" value={mcqForm.option2} onChange={e=>setMcqForm({...mcqForm, option2: e.target.value})} />
              <input className="text-black p-2 rounded" placeholder="option3" value={mcqForm.option3} onChange={e=>setMcqForm({...mcqForm, option3: e.target.value})} />
              <input className="text-black p-2 rounded" placeholder="option4" value={mcqForm.option4} onChange={e=>setMcqForm({...mcqForm, option4: e.target.value})} />
              <input className="text-black p-2 rounded" placeholder="correct_option (1-4)" type="number" value={mcqForm.correct_option} onChange={e=>setMcqForm({...mcqForm, correct_option: Number(e.target.value)})} />
              <button onClick={() => createItem(mcqForm)}>Create MCQ</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              <input className="text-black p-2 rounded" placeholder="class_name" value={qaForm.class_name} onChange={e=>setQaForm({...qaForm, class_name: e.target.value})} />
              <input className="text-black p-2 rounded" placeholder="subject" value={qaForm.subject} onChange={e=>setQaForm({...qaForm, subject: e.target.value})} />
              <input className="text-black p-2 rounded" placeholder="question" value={qaForm.question} onChange={e=>setQaForm({...qaForm, question: e.target.value})} />
              <textarea className="text-black p-2 rounded" placeholder="answer" value={qaForm.answer} onChange={e=>setQaForm({...qaForm, answer: e.target.value})} />
              <button onClick={() => createItem(qaForm)}>{tab === 'short' ? 'Create Short' : 'Create Long'}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
