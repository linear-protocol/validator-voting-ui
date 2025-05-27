import NEARLogo from '@/assets/icons/near.svg?react';
import LinearImg from '@/assets/images/linear.png';

export default function Header() {
  return (
    <div className="flex items-center justify-between px-6 sm:px-10 h-20 mb-6">
      <div className="flex items-center">
        <NEARLogo height={30} />
      </div>
      <a href="https://app.linearprotocol.org/" target="_blank" rel="noopener noreferrer">
        <div className="flex items-center text-app-black-600 gap-3 text-base">
          Powered by
          <img src={LinearImg} className="h-6" />
        </div>
      </a>
    </div>
  );
}
