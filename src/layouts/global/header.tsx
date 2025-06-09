import { ChevronDown } from 'lucide-react';

import NEARLogo from '@/assets/icons/near.svg?react';
import GithubImg from '@/assets/images/github.png';
import LinearImg from '@/assets/images/linear.png';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function Header() {
  return (
    <div className="flex items-center justify-between px-6 sm:px-10 h-20 mb-6">
      <div className="flex items-center">
        <NEARLogo height={30} />
      </div>
      <div className="flex items-center">
        <Popover>
          <PopoverTrigger asChild>
            <div className="gap-1 flex items-center cursor-pointer">
              <img src={GithubImg} className="h-6" />
              <ChevronDown className="h-4" />
            </div>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-32">
            <ul>
              <li className="text-app-black-800 hover:text-app-black-600 mb-2">
                <a
                  href="https://github.com/linear-protocol/validator-voting-contract"
                  target="_blank"
                >
                  Contract
                </a>
              </li>
              <li className="text-app-black-800 hover:text-app-black-600 mb-2">
                <a href="https://github.com/linear-protocol/validator-voting-ui" target="_blank">
                  UI
                </a>
              </li>
              <li className="text-app-black-800 hover:text-app-black-600">
                <a
                  href="https://github.com/linear-protocol/validator-voting-subgraph"
                  target="_blank"
                >
                  Subgraph
                </a>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
        <div className="bg-app-black-400 w-[1px] h-3 mx-2.5"></div>
        <a href="https://app.linearprotocol.org/" target="_blank" rel="noopener noreferrer">
          <div className="flex items-center text-app-black-600 gap-3 text-base">
            <span className="hidden sm:inline">Powered by</span>
            <img src={LinearImg} className="h-6" />
          </div>
        </a>
      </div>
    </div>
  );
}
