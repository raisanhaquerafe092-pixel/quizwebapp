import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, model: modelFromClient, task, mode, file, subject, subjectLabel, currentPage, question, context } = await req.json();
    const geminiKey = process.env.GEMINI_API_KEY || (process.env.gemini_api_key as string);
    const apiToken = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: "Missing HUGGINGFACE_API_TOKEN on server" },
        { status: 500 }
      );
    }

    const systemInstruction =
      "তুমি একজন সহায়ক বাংলা এআই শিক্ষক। সর্বদা বাংলা ভাষায় উত্তর দাও, এবং ব্যাখ্যাগুলো পরিষ্কারভাবে, ধাপে ধাপে দাও।";
    const composedPrompt = `${systemInstruction}\n\nপ্রশ্ন: ${prompt}\n\nউত্তর:`;

    // If Gemini key exists, use Gemini API first
    if (geminiKey) {
      if (mode === 'study_plan') {
        const promptPlan = `${systemInstruction}\n\nনিচের তথ্য অনুযায়ী একটি স্টাডি প্ল্যান তৈরি করো। JSON এ উত্তর দিও।\nস্কিমা: { "overview": string, "roadmap": [{"title": string, "details": string}], "key_points": string[], "game": {"description": string} }\nইনপুট: ${prompt}`;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`;
        const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: promptPlan }] }] }) });
        if (!r.ok) return NextResponse.json({ error: `Gemini error: ${r.status} ${await r.text()}` }, { status: 502 });
        const j = await r.json();
        const raw = j?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const fence = raw.match(/```(?:json)?\n([\s\S]*?)```/i);
        let jsonText = fence?.[1] || (raw.match(/\{[\s\S]*\}/)?.[0] ?? '{}');
        let parsed: any = {};
        try { parsed = JSON.parse(jsonText); } catch { parsed = {}; }
        return NextResponse.json({ plan: parsed, model: 'gemini-1.5-flash' });
      }
      
      if (mode === 'pdf_chat') {
        // Handle PDF-related questions with context
        const pdfChatPrompt = `${systemInstruction}\n\n
আপনি একজন বিশেষজ্ঞ শিক্ষক যিনি ${subjectLabel} বিষয়ে পড়াচ্ছেন। শিক্ষার্থী এই বিষয়ের পাঠ্যবই পড়ছে এবং বর্তমানে পৃষ্ঠা ${currentPage} এ রয়েছে।

প্রসঙ্গ: ${context || 'শিক্ষার্থী পাঠ্যবই পড়ছে'}

শিক্ষার্থীর প্রশ্ন: ${question}

অনুগ্রহ করে:
1. প্রশ্নের সরাসরি উত্তর দিন
2. বিষয়বস্তু সহজভাবে ব্যাখ্যা করুন
3. প্রয়োজনে উদাহরণ দিন
4. অতিরিক্ত তথ্য যা সহায়ক হতে পারে তা শেয়ার করুন
5. পরীক্ষার জন্য গুরুত্বপূর্ণ বিষয়গুলো উল্লেখ করুন

বাংলায় বিস্তারিত এবং সহায়ক উত্তর দিন:`;
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`;
        const r = await fetch(url, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ 
            contents: [{ 
              role: 'user', 
              parts: [{ text: pdfChatPrompt }] 
            }] 
          }) 
        });
        
        if (!r.ok) {
          return NextResponse.json({ 
            response: 'দুঃখিত, AI সেবা বর্তমানে অনুপলব্ধ। পরে আবার চেষ্টা করুন।', 
            model: 'gemini-1.5-flash',
            error: true
          }, { status: 502 });
        }
        
        const j = await r.json();
        const response = j?.candidates?.[0]?.content?.parts?.[0]?.text || 'দুঃখিত, আমি এই প্রশ্নের উত্তর দিতে পারছি না।';
        
        return NextResponse.json({ 
          response, 
          model: 'gemini-1.5-flash',
          subject: subjectLabel,
          currentPage
        });
      }
      
      if (mode === 'generate_questions') {
      if (mode === 'file_qa' && file?.data && file?.mime) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`;
        const parts: any[] = [];
        const visionPrompt = `${systemInstruction}\n\nনিচের সংযুক্ত চিত্র/ফাইল বিশ্লেষণ করো এবং বাংলা ভাষায় পরিষ্কারভাবে উত্তর দাও। যদি লেখায় তথ্য থাকে তা পড়ে সংক্ষেপে ব্যাখ্যা দাও। ব্যবহারকারীর প্রশ্ন: ${prompt}`;
        parts.push({ text: visionPrompt });
        parts.push({ inline_data: { mime_type: file.mime, data: file.data } });
        const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ role: 'user', parts }] }) });
        if (!r.ok) return NextResponse.json({ error: `Gemini error: ${r.status} ${await r.text()}` }, { status: 502 });
        const j = await r.json();
        const text = j?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return NextResponse.json({ text, model: 'gemini-1.5-flash' });
      }
        const schemaHint = `তুমি নিচের JSON স্কিমা অনুসারে প্রশ্ন তৈরি করবে। বাংলায় প্রশ্ন লেখো। শুধুমাত্র বৈধ JSON রেসপন্স দেবে, অন্য কিছু নয়।
স্কিমা:
{
  "mcq": [{"question": string, "options": [string, string, string, string], "correct_index": number}],
  "short": [{"question": string, "answer": string}],
  "long": [{"question": string, "answer": string}]
}
বিষয়বস্তু: ${prompt}`;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`;
        const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: schemaHint }] }] }) });
        if (!r.ok) return NextResponse.json({ error: `Gemini error: ${r.status} ${await r.text()}` }, { status: 502 });
        const j = await r.json();
        const raw = j?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        // Attempt to extract JSON from the response (supports fenced code blocks)
        let jsonText = raw;
        const fence = raw.match(/```(?:json)?\n([\s\S]*?)```/i);
        if (fence && fence[1]) jsonText = fence[1];
        // Fallback: greedy braces
        const brace = jsonText.match(/\{[\s\S]*\}/);
        if (brace) jsonText = brace[0];
        let parsed: any = {};
        try {
          parsed = JSON.parse(jsonText);
        } catch {
          // last resort: return empty skeleton
          parsed = { mcq: [], short: [], long: [] };
        }
        return NextResponse.json({ questions: parsed, model: 'gemini-1.5-flash' });
      }
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`;
      const gRes = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: composedPrompt }],
            },
          ],
        }),
      });
      if (!gRes.ok) {
        const msg = await gRes.text();
        return NextResponse.json({ error: `Gemini error: ${gRes.status} ${msg}` }, { status: 502 });
      }
      const gData = await gRes.json();
      const text = gData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return NextResponse.json({ text, model: "gemini-1.5-flash" });
    }

    // Decide default model: if prompt suggests fill-mask, prefer Bangla BERT; otherwise use a generative model
    const promptHasMask = typeof prompt === 'string' && prompt.includes('[MASK]');
    const defaultModel = promptHasMask ? "sagorsarker/bangla-bert-base" : "bigscience/bloomz-560m";
    const tryModels = [
      modelFromClient,
      process.env.HUGGINGFACE_MODEL_ID,
      defaultModel,
      "csebuetnlp/banglat5-base",
      "google/mt5-small",
    ].filter(Boolean) as string[];

    let data: any = null;
    let usedModel: string | null = null;
    let lastError: { status: number; body: string } | null = null;

    for (const modelId of tryModels) {
      const resp = await fetch(
        `https://router.huggingface.co/hf-inference/models/${encodeURIComponent(modelId)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            (() => {
              // If client hints task or masked prompt, pass raw inputs for fill-mask; else pass composedPrompt
              if (task === 'fill-mask' || promptHasMask || /bert/i.test(modelId)) {
                return {
                  inputs: prompt,
                  options: { wait_for_model: true },
                };
              }
              // text-generation / text2text-generation style
              return {
                inputs: composedPrompt,
                options: { wait_for_model: true },
                parameters: {
                  max_new_tokens: 512,
                  temperature: 0.7,
                  top_p: 0.9,
                },
              };
            })()
          ),
        }
      );

      if (!resp.ok) {
        lastError = { status: resp.status, body: await resp.text() };
        // If 404 or 403, continue to next fallback model
        if (resp.status === 404 || resp.status === 403) {
          continue;
        }
        // For other errors, break early
        break;
      }

      usedModel = modelId;
      data = await resp.json();
      break;
    }

    if (!data) {
      return NextResponse.json({
        error: `HF API error: ${lastError?.status ?? 500} ${lastError?.body ?? "Unknown"}`,
      }, { status: 502 });
    }

    let text: string = "";
    if (Array.isArray(data) && data.length) {
      // Handle possible shapes: [{generated_text: ...}] or fill-mask candidates
      if (typeof data[0]?.generated_text === 'string') {
        text = data[0].generated_text as string;
        if (text.includes("উত্তর:")) {
          text = text.split("উত্তর:").pop()?.trim() || text.trim();
        }
      } else if (data[0]?.sequence || data[0]?.token_str) {
        // fill-mask style: array of candidates
        const best = data[0];
        text = (best.sequence || best.token_str || "").toString();
      } else {
        text = JSON.stringify(data);
      }
    } else if (typeof data === "object" && data !== null) {
      text = (data as any)?.generated_text || (data as any)?.text || JSON.stringify(data);
    } else {
      text = String(data);
    }

    return NextResponse.json({ text, model: usedModel });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
