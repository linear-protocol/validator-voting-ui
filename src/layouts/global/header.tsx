import { Menu } from 'lucide-react';

import NEARLogo from '@/assets/icons/near.svg?react';
import { APP_MENUS } from '@/constants/app';

export default function Header() {
  return (
    <div className="flex items-center justify-between px-6 h-20 mb-6">
      <div className="flex items-center">
        <NEARLogo height={30} />
      </div>
      <div className="items-center text-app-black-600 hidden gap-4 lg:gap-10 md:flex">
        {APP_MENUS.map((menu) => (
          <a
            key={menu.value}
            href="#"
            className="text-base font-semibold cursor-pointer hover:opacity-75 transition-all duration-200"
          >
            {menu.label}
          </a>
        ))}
      </div>
      <div className="flex md:hidden w-9 h-9 border border-black/15 rounded-lg items-center justify-center cursor-pointer">
        <Menu width={26} height={26} />
      </div>
    </div>
  );
}
