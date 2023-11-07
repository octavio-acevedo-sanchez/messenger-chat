import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';
import { HiChat, HiOutlineLogin, HiUsers } from 'react-icons/hi';
import { signOut } from 'next-auth/react';

import useConversation from './useConversation';

interface Route {
	label: string;
	href: string;
	icon: IconType;
	active?: boolean;
	onClick?: () => void;
}

const useRoutes = (): Route[] => {
	const pathname = usePathname.toString();
	const { conversationId } = useConversation();

	const routes = useMemo(
		() => [
			{
				label: 'Chat',
				href: '/conversations',
				icon: HiChat,
				active: pathname === '/conversations' || !!conversationId
			},
			{
				label: 'Users',
				href: '/users',
				icon: HiUsers,
				active: pathname === '/users'
			},
			{
				label: 'Logout',
				href: '#',
				onClick: async () => {
					await signOut();
				},
				icon: HiOutlineLogin
			}
		],
		[pathname, conversationId]
	);

	return routes;
};

export default useRoutes;
