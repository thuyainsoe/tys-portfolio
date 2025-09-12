const SectionTitle = ({ title, subtitle, centered = false }) => {
  return (
    <div className={`mb-8 lg:mb-10 ${centered ? 'text-center' : 'text-left'}`}>
      <div className="space-y-2">
        {/* Main title */}
        <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-white">
          {title}
        </h1>
        
        {/* Decorative line */}
        <div className={`w-16 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 ${
          centered ? 'mx-auto' : ''
        }`}></div>
        
        {/* Optional subtitle */}
        {subtitle && (
          <p className="text-neutral-400 text-sm mt-2">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default SectionTitle;