import prisma from '@/app/libs/prismadb';

import getSession from './getSession';
import type { User } from '@prisma/client';

const getCurrentUser = async (): Promise<User | null> => {
	try {
		const session = await getSession();

		if (!session?.user?.email) {
			return null;
		}

		const currentUser = await prisma.user.findUnique({
			where: {
				email: session.user.email
			}
		});

		if (!currentUser) {
			return null;
		}

		return currentUser;
	} catch (error) {
		return null;
	}
};

export default getCurrentUser;
