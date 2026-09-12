export const PROTOCOLS = [
  {id:'navigation',code:'EXP-01',title:'Odour-guided navigation',question:'Can the complete controller repeatedly find food and return to the nest?',options:{},events:[],ticks:2400},
  {id:'relocation',code:'EXP-02',title:'Environmental change',question:'How does a changed food location affect an established sensor–motor loop?',options:{},events:[{tick:1000,type:'relocate'}],ticks:2400},
  {id:'antenna',code:'EXP-03',title:'Unilateral sensory ablation',question:'What changes when the left odour and obstacle channels are silenced?',options:{},events:[{tick:1000,type:'antenna'}],ticks:2400},
  {id:'frozen',code:'EXP-04',title:'Frozen readout control',question:'How much does the plastic readout add to the engineered steering prior?',options:{plasticity:false},events:[],ticks:2400},
  {id:'memory',code:'EXP-05',title:'Memory interruption',question:'What follows a simultaneous reset of neural state, readout and food vector?',options:{},events:[{tick:1000,type:'erase'}],ticks:2400},
  {id:'lesion',code:'EXP-06',title:'Recurrent unit intervention',question:'What happens when the first eight recurrent units are clamped to zero?',options:{},events:[{tick:1000,type:'lesion'}],ticks:2400},
  {id:'no-prior',code:'EXP-07',title:'Remove the steering prior',question:'Can this small online learner solve the task without the designed navigation scaffold?',options:{prior:false},events:[],ticks:2400}
];
