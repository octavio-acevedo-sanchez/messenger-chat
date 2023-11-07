'use client';

import Link from 'next/link';
import clsx from 'clsx';
import type { IconType } from 'react-icons';

interface MobileItemProps {
	href: string;
	icon: IconType;
	active?: boolean;
	onClick?: () => void;
}

const MobileItem = ({
	href,
	icon: Icon,
	active,
	onClick
}: MobileItemProps): JSX.Element => {
	const handleClick = (): void => {
		if (onClick) {
			onClick();
		}
	};

	return (
		<Link
			href={href}
			onClick={handleClick}
			className={clsx(
				`
          group 
          flex 
          gap-x-3 
          text-sm
          leading-6
          font-semibold
          w-full
          justify-center
          p-4
          text-gray-500
          hover:text-black
          hover:bg-gray-100
        `,
				active && 'pg-gray-100 text-black'
			)}
		>
			<Icon className='h-6 w-6' />
		</Link>
	);
};

export default MobileItem;
