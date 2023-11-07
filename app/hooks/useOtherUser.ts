import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import type { FullConversationType } from '../types';
import type { User } from '@prisma/client';

const useOtherUser = (
	conversation: FullConversationType | { users: User[] }
): User[] => {
	const session = useSession();

	const otherUser = useMemo(() => {
		const currentUserEmail = session?.data?.user?.email;

		const otherUser = conversation.users.filter(
			user => user.email !== currentUserEmail
		);

		return otherUser;
	}, [session?.data?.user?.email, conversation.users]);

	return otherUser;
};

export default useOtherUser;