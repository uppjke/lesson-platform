interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg 
        className={sizeClasses[size]}
        viewBox="0 0 250.0 250.0" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="scale(0.06103515625 0.06103515625) translate(2048.0 2048.0)">
          <path 
            d="M530.211,1427.3 C1018.88,1427.3 1416.3,1029.88 1416.3,541.211 L1416.3,-589.211 C1416.3,-1077.88 1018.88,-1475.3 530.211,-1475.3 L-600.211,-1475.3 C-1088.88,-1475.3 -1486.3,-1077.88 -1486.3,-589.211 L-1486.3,541.211 C-1486.3,1029.88 -1088.88,1427.3 -600.211,1427.3 L530.211,1427.3 Z" 
            fill="#000000" 
          />
          <path 
            d="M-1.7053e-13,-461.901 L-1.7053e-13,-923.803 L-923.803,2.84217e-13 L-461.901,2.84217e-13 L-1.7053e-13,-461.901 Z" 
            fill="white" 
          />
          <path 
            d="M-1.7053e-13,461.901 L-1.13687e-13,923.803 L923.803,5.68434e-14 L461.901,1.13687e-13 L-1.7053e-13,461.901 Z" 
            fill="white" 
          />
          <path 
            d="M-138.31,-2.84217e-13 C-138.31,30.4869 -113.417,55.3799 -82.93,55.3799 L82.93,55.3799 C113.417,55.3799 138.31,30.4869 138.31,-2.84217e-13 C138.31,-30.4869 113.417,-55.3799 82.93,-55.3799 L-82.93,-55.3799 C-113.417,-55.3799 -138.31,-30.4869 -138.31,-2.84217e-13 Z" 
            fill="white" 
          />
        </g>
      </svg>
      <span className={`font-bold text-gray-900 ${
        size === 'sm' ? 'text-lg' : 
        size === 'md' ? 'text-2xl' : 'text-3xl'
      }`}>
        Изучатор
      </span>
    </div>
  );
}
