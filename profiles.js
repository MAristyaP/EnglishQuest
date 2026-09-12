class QuestProfiles {
  constructor(storage,bank){
    this.storage=storage;this.bank=bank;this.indexKey='english-quest-profiles-v1';
    this.meta={active:'default',profiles:[{id:'default',key:'english-quest-v1',name:'Young Explorer',avatar:'🧑‍🚀'}]};
    if(storage){const raw=JSON.parse(storage.getItem(this.indexKey)||'null');if(raw){if(!Array.isArray(raw.profiles)||!raw.profiles.length||raw.profiles.length>20||raw.profiles.some(p=>!p||typeof p.id!=='string'||!/^english-quest-(v1|profile-[a-z0-9-]+)$/.test(p.key)||typeof p.name!=='string'||p.name.length>40)||new Set(raw.profiles.map(p=>p.id)).size!==raw.profiles.length||new Set(raw.profiles.map(p=>p.key)).size!==raw.profiles.length)throw Error('Daftar profil tidak valid.');this.meta={active:raw.profiles.some(p=>p.id===raw.active)?raw.active:raw.profiles[0].id,profiles:raw.profiles.map(p=>({id:p.id,key:p.key,name:p.name,avatar:['🧑‍🚀','🦊','🐱','🐼','🦉','🐻'].includes(p.avatar)?p.avatar:'🧑‍🚀'}))};}}
  }
  current(){return this.meta.profiles.find(p=>p.id===this.meta.active);}
  load(){const raw=this.storage?JSON.parse(this.storage.getItem(this.current().key)||'null'):null;return raw?EQ.normalise(raw,this.bank):EQ.blank();}
  persist(data){if(!this.storage)throw Error('Penyimpanan browser tidak tersedia.');this.storage.setItem(this.current().key,JSON.stringify(data));this.storage.setItem(this.indexKey,JSON.stringify(this.meta));}
  select(id){const profile=this.meta.profiles.find(p=>p.id===id);if(!profile)throw Error('Profil tidak ditemukan.');EQ.normalise(JSON.parse(this.storage.getItem(profile.key)||'null')||EQ.blank(),this.bank);const next={...this.meta,active:id};this.storage.setItem(this.indexKey,JSON.stringify(next));this.meta=next;}
  name(value){const s=String(value||'').trim();if(!s||s.length>40)throw Error('Isi nama panggilan, maksimal 40 karakter.');return s;}
  create(name,avatar='🧑‍🚀'){return this.append([{name:this.name(name),avatar,data:EQ.blank()}])[0];}
  rename(name){const clean=this.name(name),next={...this.meta,profiles:this.meta.profiles.map(p=>p.id===this.meta.active?{...p,name:clean}:p)};this.storage.setItem(this.indexKey,JSON.stringify(next));this.meta=next;}
  backup(currentData){return {format:'EnglishQuestBackup',version:1,exportedAt:new Date().toISOString(),profiles:this.meta.profiles.map(p=>({name:p.name,avatar:p.avatar,data:p.id===this.meta.active?currentData:EQ.normalise(JSON.parse(this.storage.getItem(p.key)||'null')||EQ.blank(),this.bank)}))};}
  validateBackup(raw){
    if(!raw||raw.format!=='EnglishQuestBackup'||raw.version!==1||!Array.isArray(raw.profiles)||!raw.profiles.length||raw.profiles.length>20)throw Error('Pilih file cadangan JSON EnglishQuest versi 1.');
    if(raw.profiles.length+this.meta.profiles.length>20)throw Error('Maksimal 20 profil di browser ini.');
    return raw.profiles.map(p=>({name:this.name(p.name),avatar:['🧑‍🚀','🦊','🐱','🐼','🦉','🐻'].includes(p.avatar)?p.avatar:'🧑‍🚀',data:EQ.normalise(p.data,this.bank,true)}));
  }
  append(entries){
    if(!this.storage)throw Error('Penyimpanan browser tidak tersedia.');
    if(this.meta.profiles.length+entries.length>20)throw Error('Maksimal 20 profil di browser ini.');
    const added=[],written=[];
    try{
      entries.forEach((e,i)=>{const id=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10)+'-'+i,key='english-quest-profile-'+id;if(this.storage.getItem(key)!==null)throw Error('Silakan coba lagi.');const p={id,key,name:this.name(e.name),avatar:['🧑‍🚀','🦊','🐱','🐼','🦉','🐻'].includes(e.avatar)?e.avatar:'🧑‍🚀'};this.storage.setItem(key,JSON.stringify(e.data));written.push(key);added.push(p);});
      const next={...this.meta,profiles:[...this.meta.profiles,...added]};this.storage.setItem(this.indexKey,JSON.stringify(next));this.meta=next;return added;
    }catch(e){for(const key of written)try{this.storage.removeItem(key);}catch(_){}throw e;}
  }
}
