import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

async function request(path,body){
  const response=await fetch('/api/'+path,{method:'POST',body:body instanceof FormData?body:JSON.stringify(body),headers:body instanceof FormData?{}:{'Content-Type':'application/json'}});
  let data;try{data=await response.json()}catch{throw new Error('The server did not return JSON. Is the backend running?')}
  if(!response.ok)throw new Error(typeof data.detail==='string'?data.detail:'Request failed');
  return data;
}
function JsonView({data}){if(!data)return null;return <div className="results">{Object.entries(data).map(([key,val])=><section key={key}><h3>{key.replaceAll('_',' ')}</h3>{Array.isArray(val)?<ul>{val.map((x,i)=><li key={i}>{typeof x==='object'?<JsonView data={x}/>:String(x)}</li>)}</ul>:val&&typeof val==='object'?<JsonView data={val}/>:<p>{val===null?'Not estimated':String(val)}</p>}</section>)}</div>}
function App(){
  const [tab,setTab]=useState('food'),[file,setFile]=useState(null),[preview,setPreview]=useState(''),[result,setResult]=useState(null),[error,setError]=useState(''),[loading,setLoading]=useState(false);
  const [diet,setDiet]=useState('balanced'),[goal,setGoal]=useState('balanced'),[allergies,setAllergies]=useState(''),[ingredients,setIngredients]=useState(''),[servings,setServings]=useState(1),[equipment,setEquipment]=useState('stove'),[minutes,setMinutes]=useState(30);
  const tabs=[['food','Food recognition & nutrition','🥗'],['freshness','Freshness guidance','🍎'],['hygiene','Restaurant hygiene','🧼'],['meal','Meal planner','📅'],['kitchen','Smart kitchen','🍳']];
  function changeTab(id){setTab(id);setResult(null);setError('')}
  async function run(e){e.preventDefault();setLoading(true);setError('');setResult(null);try{
    let data;if(['food','freshness','hygiene'].includes(tab)){if(!file)throw new Error('Choose a food or kitchen image first.');const form=new FormData();form.append('image',file);form.append('mode',tab);data=await request('analyze',form)}
    else if(tab==='meal')data=await request('meal-plan',{diet,goal,allergies,ingredients,servings:Number(servings)});
    else data=await request('kitchen',{ingredients,equipment,time_minutes:Number(minutes),allergies});
    setResult(data)
  }catch(err){setError(err.message)}finally{setLoading(false)}}
  return <><header><div className="brand"><span>FV</span> FoodVerse <em>AI</em></div><a href="#workspace">Workspace ↓</a></header>
  <main><section className="hero"><div><small>✦ MULTIMODAL FOOD INTELLIGENCE AGENT</small><h1>Smarter food insights,<br/><i>better everyday choices.</i></h1><p>Explore food recognition, nutrition estimates, freshness cues, hygiene observations, meal plans and cooking guidance—all powered by a multimodal AI API.</p><a className="cta" href="#workspace">Explore the workspace ↗</a></div><div className="hero-art">🥗<span className="float one">🍎 Food insights</span><span className="float two">✨ AI powered</span></div></section>
  <section className="workspace" id="workspace"><div className="section-title"><small>YOUR WORKSPACE</small><h2>Choose an intelligence module</h2><p>Image-based modules use a real vision-capable model when the backend API key is configured.</p></div>
  <div className="tabs">{tabs.map(([id,label,emoji])=><button key={id} className={tab===id?'active':''} onClick={()=>changeTab(id)}>{emoji} {label}</button>)}</div>
  <div className="columns"><form className="panel" onSubmit={run}><h2>{tabs.find(t=>t[0]===tab)[1]}</h2>
  {['food','freshness','hygiene'].includes(tab)?<><label className="drop">{preview?<img src={preview} alt="Selected upload"/>:<div><strong>📷 Upload a photo</strong><p>JPG, PNG or WEBP · maximum 8 MB</p></div>}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{const f=e.target.files?.[0];setFile(f||null);if(preview)URL.revokeObjectURL(preview);setPreview(f?URL.createObjectURL(f):'')}}/></label><p className="hint">{tab==='food'?'Recognizes visible foods and estimates nutrition, with uncertainty.':tab==='freshness'?'Describes visible changes only; cannot certify safety.':'Describes visible hygiene cues; not a compliance inspection.'}</p></>:<>
  {tab==='meal'&&<><label>Eating preference<select value={diet} onChange={e=>setDiet(e.target.value)}><option value="balanced">Balanced</option><option value="vegetarian">Vegetarian</option><option value="vegan">Vegan</option><option value="high-protein">Higher protein</option></select></label><label>Goal<select value={goal} onChange={e=>setGoal(e.target.value)}><option value="balanced">Balanced</option><option value="budget">Budget-friendly</option><option value="higher-protein">Higher protein</option></select></label><label>Servings<input type="number" min="1" max="8" value={servings} onChange={e=>setServings(e.target.value)}/></label></>}
  <label>Ingredients available<textarea value={ingredients} onChange={e=>setIngredients(e.target.value)} placeholder="e.g. rice, lentils, tomatoes, carrots" required={tab==='kitchen'}/></label><label>Allergies / avoid<textarea value={allergies} onChange={e=>setAllergies(e.target.value)} placeholder="e.g. peanuts, milk"/></label>
  {tab==='kitchen'&&<><label>Equipment<input value={equipment} onChange={e=>setEquipment(e.target.value)}/></label><label>Minutes available<input type="number" min="5" max="180" value={minutes} onChange={e=>setMinutes(e.target.value)}/></label></>}
  </>}
  <button className="submit" disabled={loading}>{loading?'Analyzing…':tab==='meal'?'Generate meal plan':tab==='kitchen'?'Generate cooking guide':'Analyze image →'}</button>
  {error&&<div role="alert" className="error">{error}</div>}</form><div className="panel output"><h2>AI insights</h2>{!result?<div className="placeholder"><div>✦</div><h3>Your results appear here</h3><p>Complete the form and run the module to see AI-generated insights.</p></div>:<><JsonView data={result.result||result}/>{result.disclaimer&&<p className="hint">{result.disclaimer}</p>}</>}</div></div>
  <p className="disclaimer"><b>Safety:</b> AI outputs can be wrong. Image analysis cannot prove food safety, restaurant compliance, or exact calories. Verify allergens, temperatures, storage conditions and nutrition independently.</p></section>
  <section className="features"><h2>Five modules. One platform.</h2><div>{tabs.map(([id,label,emoji])=><article key={id}><span>{emoji}</span><h3>{label}</h3><p>{id==='food'?'Identify likely foods and get approximate nutrient estimates.':id==='freshness'?'Review visible quality cues and limitations.':id==='hygiene'?'Inspect observable cleanliness indicators.':id==='meal'?'Create meal ideas around dietary preferences.':'Generate recipes from available ingredients.'}</p></article>)}</div></section></main><footer>FoodVerse AI · Educational multimodal prototype · Built with React + FastAPI + Gemini API</footer></>;
}
createRoot(document.getElementById('root')).render(<App/>);
