export function registerLearningTools(read:()=>unknown){
const context=(document as Document&{modelContext?:{registerTool:(tool:unknown,options:{signal:AbortSignal})=>void|Promise<void>}}).modelContext;
if(!context?.registerTool)return()=>{};
const lifecycle=new AbortController();
try{void Promise.resolve(context.registerTool({name:'read_learning_progress',title:'Read learning progress',description:'Read topic mastery and completion counts from the local learning profile. Does not submit answers or modify progress.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input:unknown){if(input===null||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('Expected an empty object.');return read();}},{signal:lifecycle.signal})).catch(()=>{});}catch{}
return ()=>lifecycle.abort();
}
