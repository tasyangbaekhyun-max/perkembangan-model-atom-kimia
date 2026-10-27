export interface AtomTheme {
  bgLight: string
  borderLight: string
  activeRing: string
  textColor: string
  badgeBg: string
  gradient: string
}

export interface ScientistProfile {
  fullName: string
  lifespan: string
  nationality: string
  title: string
  avatarUrl: string
  bio: string
  keyContribution: string
  funFact: string
}

export interface AtomModel {
  id: 'democritus' | 'dalton' | 'thomson' | 'rutherford' | 'bohr' | 'quantum'
  name: string
  scientist: string
  period: string
  summary: string
  analogy: string
  representations: {
    macroscopic: string
    submicroscopic: string
    symbolic: string
  }
  chemicalRules: string[]
  historicalExperiment: string
  resolvedProblem: string
  limitations: string
  color: string
  theme: AtomTheme
  scientistProfile: ScientistProfile
}

export interface LearningLog {
  userId: string
  timestamp: string
  action: 'view_page' | 'run_simulation' | 'submit_quiz' | 'click_interaction'
  targetId: string
  metadata?: Record<string, unknown>
}
