import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  BarChart3,
  Dna,
  LayoutDashboard
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Toaster, toast } from 'react-hot-toast';
import { useAHP } from './hooks/useAHP';

const STEPS = [
  { id: 0, title: 'Structure', icon: LayoutDashboard },
  { id: 1, title: 'Priorités', icon: Dna },
  { id: 2, title: 'Évaluation', icon: BarChart3 },
  { id: 3, title: 'Résultats', icon: TrendingUp },
];

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [newEntity, setNewEntity] = useState('');
  const { 
    criteria, 
    alternatives, 
    criteriaMatrix, 
    scores,
    updateCriteriaMatrix, 
    addCriterion, 
    removeCriterion, 
    addAlternative, 
    removeAlternative, 
    updateScore, 
    reset, 
    results 
  } = useAHP();

  const nextStep = () => {
    if (currentStep === 0 && (criteria.length < 3 || alternatives.length < 2)) {
      toast.error("Veuillez définir au moins 3 critères et 2 alternatives.");
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-base-300 font-sans transition-colors duration-300">
      {/* <Toaster position="top-right" /> */}
      
      {/* Navigation */}
      <div className="navbar bg-base-100 shadow-md px-4 md:px-8 sticky top-0 z-50">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            
            <span className="text-xl font-bold tracking-tight hidden sm:inline-block">AHP Decision <span className="text-primary">TAGNY TAGNY 21T2342</span></span>
          </div>
        </div>
        <div className="flex-none gap-4">
          <button onClick={reset} className="btn btn-ghost btn-sm gap-2 text-error">
            <RotateCcw size={26} />
            <span className="btn-soft">Réinitialiser</span>
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Stepper Header */}
        <div className="bg-base-100 rounded-2xl shadow-sm p-4 overflow-x-auto">
          <ul className="steps w-full min-w-[500px]">
            {STEPS.map((step, idx) => (
              <li 
                key={step.id} 
                className={`step ${idx <= currentStep ? 'step-primary font-medium' : ''} transition-all duration-500`}
                onClick={() => idx <= currentStep && setCurrentStep(idx)}
                style={{ cursor: idx <= currentStep ? 'pointer' : 'default' }}
              >
                <div className="flex flex-col items-center gap-1">
                  {/* <step.icon size={18} /> */}
                  <span className="text-xs uppercase tracking-widest">{step.title}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="min-h-[500px]"
          >
            {currentStep === 0 && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Criteria Management */}
                <Card title="Critères" description="Définissez les éléments sur lesquels vous basez votre décision.">
                  <div className="space-y-4">
                    <div className="join w-full">
                      <input 
                        type="text" 
                        placeholder="Ex: Prix, Qualité..." 
                        className="input input-bordered join-item w-full focus:input-primary"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addCriterion(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button 
                        className="btn btn-primary join-item"
                        onClick={(e) => {
                          const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                          if (input?.value) {
                            addCriterion(input.value);
                            input.value = '';
                          }
                        }}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {criteria.map(c => (
                        <div key={c.id} className="badge badge-lg py-4 badge-ghost gap-2 hover:badge-primary transition-all duration-300 group">
                          {c.name}
                          <button onClick={() => removeCriterion(c.id)} className="hover:text-error transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    {criteria.length < 3 && (
                      <p className="text-xs text-info flex items-center gap-1">
                        <AlertCircle size={12} /> Ajouté au moins 3 critères pour de meilleurs résultats.
                      </p>
                    )}
                  </div>
                </Card>

                {/* Alternatives Management */}
                <Card title="Alternatives" description="Les différentes options que vous comparez.">
                  <div className="space-y-4">
                    <div className="join w-full">
                      <input 
                        type="text" 
                        placeholder="Ex: Projet A, Fournisseur X..." 
                        className="input input-bordered join-item w-full focus:input-primary"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addAlternative(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button 
                        className="btn btn-primary join-item"
                        onClick={(e) => {
                          const input = (e.currentTarget.previousSibling as HTMLInputElement);
                          if (input.value) {
                            addAlternative(input.value);
                            input.value = '';
                          }
                        }}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {alternatives.map(a => (
                        <div key={a.id} className="badge badge-lg py-4 border-primary text-primary badge-outline gap-2 hover:bg-primary hover:text-white transition-all duration-300">
                          {a.name}
                          <button onClick={() => removeAlternative(a.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Comparaison des Critères</h2>
                    <p className="text-base-content/70">Comparez l'importance relative de chaque critère.</p>
                  </div>
                  <div className={`badge badge-lg gap-2 py-4 ${results.isConsistent ? 'badge-success' : 'badge-warning'}`}>
                    {results.isConsistent ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    Ratio de Cohérence: {(results.consistencyRatio * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th className="bg-base-200">Critère</th>
                        {criteria.map(c => <th key={c.id} className="text-center">{c.name}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {criteria.map((cRow, i) => (
                        <tr key={cRow.id}>
                          <th className="font-bold bg-base-100">{cRow.name}</th>
                          {criteria.map((cCol, j) => {
                            if (i === j) return <td key={cCol.id} className="text-center text-base-content/40 bg-base-200/30">1</td>;
                            if (i > j) return <td key={cCol.id} className="text-center italic text-xs text-base-content/50">{(1/criteriaMatrix[j][i]).toFixed(2)}</td>;
                            return (
                              <td key={cCol.id} className="text-center">
                                <select 
                                  className="select select-bordered select-sm w-full max-w-[100px]"
                                  value={criteriaMatrix[i][j]}
                                  onChange={(e) => updateCriteriaMatrix(i, j, parseFloat(e.target.value))}
                                >
                                  <option value={1}>Identique (1)</option>
                                  <option value={3}>Plus important (3)</option>
                                  <option value={5}>Beaucoup plus imp. (5)</option>
                                  <option value={7}>Trés fortement imp. (7)</option>
                                  <option value={9}>Dominant (9)</option>
                                  <option value={1/3}>Moins important (1/3)</option>
                                  <option value={1/5}>Beaucoup moins (1/5)</option>
                                  <option value={1/7}>Trés faible imp. (1/7)</option>
                                  <option value={1/9}>Insignifiant (1/9)</option>
                                </select>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {!results.isConsistent && (
                  <div className="alert alert-warning shadow-lg">
                    <AlertCircle />
                    <div>
                      <h3 className="font-bold">L'analyse semble incohérente</h3>
                      <div className="text-xs">Le Ratio de Cohérence ({ (results.consistencyRatio * 100).toFixed(1) }%) dépasse 10%. Vos jugements pourraient être contradictoires ou aléatoires. Essayez d'ajuster vos comparaisons.</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold">Évaluation des Alternatives</h2>
                  <p className="text-base-content/70">Attribuez un score de 1 à 10 pour chaque alternative selon chaque critère.</p>
                </div>

                <div className="grid gap-6">
                  {criteria.map(c => (
                    <Card key={c.id} title={c.name}>
                      <div className="grid gap-4">
                        {alternatives.map(a => (
                          <div key={a.id} className="flex flex-col sm:flex-row items-center gap-4">
                            <span className="sm:w-1/3 font-medium">{a.name}</span>
                            <div className="flex-1 w-full flex items-center gap-4">
                              <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={scores[c.id]?.[a.id] || 50} 
                                className="range range-primary range-sm"
                                onChange={(e) => updateScore(c.id, a.id, parseInt(e.target.value))}
                              />
                              <span className="w-12 text-center font-bold text-primary">{Math.round((scores[c.id]?.[a.id] || 50) / 10)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-12 pb-12">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-black tracking-tight text-primary">Analyse Finale</h2>
                  <p className="text-base-content/60">Voici le classement de vos alternatives basé sur vos propres priorités.</p>
                </div>

                {/* Champion Section */}
                <div className="bg-primary text-primary-content rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <span className="uppercase tracking-[0.2em] text-xs font-bold opacity-80">Meilleure Alternative</span>
                    <h3 className="text-5xl font-black mt-2">{results.ranking[0]?.name}</h3>
                    <div className="mt-6 flex items-center gap-4">
                      <div className="radial-progress border-4 border-primary-content/20 text-white" style={{ "--value": results.ranking[0]?.score, "--size": "5rem" } as any} role="progressbar">
                        <span className="font-bold text-sm">{Math.round(results.ranking[0]?.score)}%</span>
                      </div>
                      <p className="max-w-md text-primary-content/90 font-medium">
                        Cette option domine le classement avec une pertinence globale de {results.ranking[0]?.score?.toFixed(1)}%.
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-8 transform translate-x-12 -translate-y-12 group-hover:translate-x-4 group-hover:-translate-y-4 transition-all duration-700 opacity-20">
                    <CheckCircle2 size={160} />
                  </div>
                </div>

                {/* Charts & Ranking */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Rankings & Progress */}
                  <Card title="Classement et Scores">
                    <div className="space-y-6">
                      {results.ranking.map((a, i) => (
                        <div key={a.id} className="space-y-2 group">
                          <div className="flex justify-between items-end">
                            <span className="font-bold group-hover:text-primary transition-colors">
                              {i+1}. {a.name}
                            </span>
                            <span className="text-sm font-mono">{a.score.toFixed(1)}%</span>
                          </div>
                          <div className="h-4 w-full bg-base-200 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${a.score}%` }}
                              transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
                              className="h-full bg-gradient-to-r from-primary to-secondary"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Criteria Distribution Chart */}
                  <Card title="Poids des Critères">
                    <div className="h-64 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={Object.entries(results.criteriaWeights).map(([name, value]) => ({ name, value }))}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                          <YAxis axisLine={false} tickLine={false} hide />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Poids']}
                          />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {Object.entries(results.criteriaWeights).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {Object.entries(results.criteriaWeights).map(([name, val], idx) => (
                        <div key={name} className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                           <span className="text-xs font-medium">{name}: <span className="font-bold">{val.toFixed(1)}%</span></span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Step Navigation Buttons */}
        <div className="flex justify-between items-center bg-base-100 p-6 rounded-2xl shadow-sm border-t border-base-300 backdrop-blur-sm sticky bottom-8">
          <button 
            className={`btn btn-ghost gap-2 ${currentStep === 0 ? 'invisible' : ''}`}
            onClick={prevStep}
          >
            <ChevronLeft size={20} />
            Précédent
          </button>
          
          <button 
            className={`btn ${currentStep === STEPS.length - 1 ? 'btn-success' : 'btn-primary'} gap-2 px-8 min-w-[200px] shadow-lg shadow-primary/20`}
            onClick={currentStep === STEPS.length - 1 ? () => window.print() : nextStep}
          >
            {currentStep === STEPS.length - 1 ? (
              <>Exporter PDF</>
            ) : (
              <>Suivant <ChevronRight size={20} /></>
            )}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-100 text-base-content mt-20 border-t border-base-200 opacity-50">
        <div>
          <p className="font-bold">AHP Decision Professional 2026</p> 
          <p>Un outil d'aide à la décision basé sur la science mathématique.</p>
        </div>
      </footer>
    </div>
  );
}

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 h-full flex flex-col hover:shadow-xl transition-all duration-500 group">
      <div className="mb-4">
        <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{title}</h3>
        {description && <p className="text-sm text-base-content/60 leading-relaxed mt-1">{description}</p>}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
