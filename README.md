# 🧠 MiniDxO – The Transparent AI Diagnostician

**MiniDxO** is an interactive AI-powered medical diagnostic assistant built using **Lovable.dev** and **Claude 4 API**.  
It doesn’t give instant answers — it *thinks like a doctor*: asking step-by-step questions, referencing trusted medical texts, and transparently explaining its reasoning process.

---

#LINK TO ALREADY PUBLISHED SITE

https://minidxo-sarc.lovable.app/?utm_source=lovable-editor


## 🚀 Features

✅ **Conversational Symptom Analysis**  
- Dynamically asks follow-up questions about duration, intensity, and related symptoms.  
- Learns from your previous answers to refine the diagnosis.  

✅ **Transparent AI Reasoning**  
- Displays every reasoning step and cited medical references (Mayo Clinic, NIH, MedlinePlus).  
- Shows *why* each follow-up question is asked.  

✅ **Claude 4 API Integration**  
- Use your own Claude 4 API key for medical reasoning and diagnosis flow generation.  
- Automatically adapts conversation depth based on user’s responses.  

✅ **Lovable.dev Auto UI**  
- Intuitive chat-style interface created through Lovable’s AI builder.  
- Clean, responsive design with minimal setup.  

✅ **Educational, Not Diagnostic**  
- Designed for learning and awareness — not real medical advice.  

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React (Lovable auto-generated) |
| **Backend** | Node.js / Express |
| **AI Engine** | Claude 4 (via API) |
| **Data Storage** | Local JSON / Supabase (optional) |
| **Hosting** | Lovable / Vercel |

---

## ⚙️ Setup Guide

### 1️⃣ Add Your API Key
In Lovable, open your project’s **Environment Variables** and add:

ANTHROPIC_API_KEY = your_claude_4_api_key_here


### 2️⃣ Deploy / Run Locally
If you export the project:
```bash
npm install
npm run dev
