interface StepCardProps {
  icon: string;
  stepNumber: string;
  title: string;
  description: string;
  delay?: string;
}
const StepCard = ({ icon, stepNumber, title, description, delay }: StepCardProps) => (
  <div
    className="glass-card group relative rounded-2xl p-10 transition-all duration-500 fade-up"
    style={delay ? { transitionDelay: delay } : undefined}
  >
    <div className="absolute -top-6 left-10 w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-primary/10 transition-all">
      <span className="material-symbols-outlined text-primary">{icon}</span>
    </div>
    <div className="mt-4">
      <div className="font-label-mono text-primary text-[11px] mb-2 uppercase tracking-widest">
        {stepNumber}
      </div>
      <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
        {title}
      </h3>
      <p className="font-body-md text-on-surface/50 leading-relaxed">
        {description}
      </p>
    </div>
    <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-0 h-px bg-primary group-hover:w-full transition-all duration-500"></div>
  </div>
);

export default StepCard